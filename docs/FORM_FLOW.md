# Property Valuation Form Flow

## Overview

Multi-step property valuation form with conditional logic, phone verification, and CRM integration.

---

## Form Steps

### Step 1: Address Entry (Pre-form)
- **Location:** Homepage (`/`)
- **Component:** `AddressForm.tsx`
- **Input:** Text with Addy.co.nz autocomplete
- **Validation:** Required, valid NZ address
- **On Submit:** Redirects to `/get-started?address=...&postal=...`

---

### Step 3: Property Type
- **Options:** Free Standing, Town House, Apartment, Land Only, Terraced, Semi Detached
- **Auto-submit:** Yes (clicks option → next step)
- **Affects:** Skip logic for later steps

### Step 4: House Size (SQM)
- **Input:** Slider (0-500 sqm)
- **Skip if:** `propertyType = "Land Only"`

### Step 5: Land Size
- **Input:** Slider (250-3000 sqm)
- **Skip if:** `propertyType = "Apartment"`

### Step 6: House Age
- **Input:** Slider (0-100 years)
- **Skip if:** `propertyType = "Land Only"`

### Step 7: Bedrooms
- **Input:** Slider (0-6)
- **Skip if:** `propertyType = "Land Only"`

### Step 8: Bathrooms
- **Input:** Slider (0-4)
- **Skip if:** `propertyType = "Land Only"`

### Step 9: CV Valuation
- **Input:** Slider ($100K - $3M)
- **Always shown**

### Step 10: Internal Garage
- **Input:** Yes / No buttons
- **Skip if:** `propertyType = "Land Only"`
- **If Yes:** Goes to Step 10.5

### Step 10.5: Garage Capacity
- **Input:** 1 / 2 / 3+ buttons
- **Only shown if:** `hasGarage = "Yes"`

### Step 11: Condition of House
- **Options:** Needs Work, Liveable & Tidy, Recently Renovated
- **Skip if:** `propertyType = "Land Only"`

### Step 12: Relationship with Property
- **Options:** Owner, Estate, Buyer, Tenant, Not My Property, Real Estate Agent
- **Routing:**
  - `Owner` / `Estate` → Step 13
  - `Buyer` / `Tenant` / `Not My Property` → Step 12.2 (Error page)
  - `Real Estate Agent` → Step 12.1 (Agent redirect)

### Step 12.1: Agent Portal (Exit)
- **Display:** Info about agent portal
- **Action:** Redirect to external agent page

### Step 12.2: Quiz Error (Exit)
- **Display:** "Service only for property owners"
- **Action:** Back to home

### Step 13: Situation
- **Options:** Downsizing, Selling Investment, Need Larger Home, Thinking of Selling, Moving, Other
- **Routing:**
  - `Other` → Step 14
  - All others → Step 15

### Step 14: Clarify "Other" Situation
- **Options:** Listing Soon, Want Appraisal, Have Bought Already, Find Out Worth, Refinancing
- **Routing:**
  - `Listing Soon` → Step 14.1
  - `Refinancing` → Step 14.3
  - All others → Step 15

### Step 14.1: Recently Listed?
- **Question:** "Has your place been listed for sale in the last 30 days?"
- **Routing:**
  - `Yes` → Step 14.2 (Exit)
  - `No` → Step 15

### Step 14.2: Go Back to Agent (Exit)
- **Display:** "Go back to your Real Estate Agent"
- **Action:** Link to find agent / back to home

### Step 14.3: Refinancing Goals
- **Options:** Refix mortgage, Buy second property, Help family, Renovating
- **Next:** Step 14.4

### Step 14.4: Bank Selection
- **Options:** ASB, BNZ, Westpac, Kiwibank, TSB, Other
- **Next:** Step 17

### Step 15: Extra Features
- **Options (6):** Sea/Water Views, Heating/Cooling, Lawn Area, Outdoor Entertaining, Spa/Pool/Sauna, None of the Above
- **Input:** Multi-select checkboxes
- **Validation:** At least one required
- **Logic:** "None of the Above" clears other selections

### Step 17: Contact Details
- **Fields:** First Name, Last Name, Email, Mobile
- **Validation:** All required, valid NZ phone number
- **On Submit:** Triggers form submission flow

### Step 18: Thank You
- **Display:** Success message
- **Action:** Auto-redirect to home after 3 seconds

---

## Pre-Form Submit Flow

```
User fills Step 17 (Contact Details)
         ↓
Click "Submit"
         ↓
┌─────────────────────────────────┐
│ Client-side Validation          │
│ - All fields required           │
│ - Phone: isValidNZPhone()       │
└─────────────────────────────────┘
         ↓ (pass)
┌─────────────────────────────────┐
│ submitForm()                    │
│ POST /api/leads                 │
│ - All form data                 │
│ - UTM params                    │
│ - Tracking IDs (GA, FB, etc)    │
│ - phoneVerified: false          │
└─────────────────────────────────┘
```

---

## Form Submission Flow (`/api/leads`)

```
┌─────────────────────────────────┐
│ 1. Receive form data            │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ 2. Create Lead in local DB      │
│ - Status: NEW                   │
│ - Priority: MEDIUM              │
│ - Temperature: warm             │
│ - phoneVerified: false          │
│ - stepsCompleted: 17            │
│ - completionRate: 100           │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ 3. Sync to External CRM (async) │
│ POST PMPCMS_API_URL/create_lead │
│ - Maps all form fields          │
│ - Returns: externalLeadId,      │
│   activeCampaignId              │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ 4. Update local lead with       │
│    external IDs                 │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ 5. Return success + leadId      │
└─────────────────────────────────┘
```

---

## Post-Form Submit Flow (Phone Verification)

```
┌─────────────────────────────────┐
│ Lead created successfully       │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ Open PhoneVerificationModal     │
│ startVerification(mobile)       │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ POST /api/verify-phone/send     │
│ - Check rate limit (3/hour)     │
│ - Generate 6-digit code         │
│ - Store in PhoneVerification    │
│ - Send SMS via TransmitSMS      │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ User enters code                │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ POST /api/verify-phone/verify   │
│ - Validate code                 │
│ - Check expiration (10 min)     │
│ - Max 3 attempts                │
└─────────────────────────────────┘
         ↓ (success)
┌─────────────────────────────────┐
│ POST /api/leads/verify          │
│ - Update local: phoneVerified   │
│ - Call CRM: mark_lead_verified  │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ Navigate to Step 18 (Thank You) │
└─────────────────────────────────┘
```

---

## SMS Configuration

**Provider:** TransmitSMS (AU/NZ)

**Environment Variables:**
```
SMS_API_URL=https://api.transmitsms.com/send-sms.json
SMS_API_USERNAME=your_username
SMS_API_PASSWORD=your_password
```

**Test Numbers (bypass SMS):**
- `64333333`, `+64333333`, `0333333`
- Code: `123456`

**Rate Limit:** 3 SMS per phone per hour

---

## Data Flow Summary

```
Homepage (Address)
    → /get-started (Steps 3-17)
    → /api/leads (Create lead)
    → /api/verify-phone/send (Send SMS)
    → /api/verify-phone/verify (Verify code)
    → /api/leads/verify (Mark verified)
    → Thank You page
    → Redirect to home
```

---

## Form Data Fields

```typescript
{
  // Property
  address: string
  postal: string
  propertyType: string
  houseSqm: number
  landSize: number
  houseAge: number
  bedrooms: number
  bathrooms: number
  cvValuation: number
  hasGarage: string
  garageCapacity: string
  condition: string

  // User Journey
  relationship: string
  situation: string
  otherSituation: string
  refinancingGoal: string
  bank: string
  extraFeatures: string[]

  // Contact
  firstName: string
  lastName: string
  email: string
  mobile: string

  // Tracking
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  gclid: string
  fbclid: string
  uniqueUserId: string
  gaClientId: string
  fbp: string
  fbc: string
}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `components/AddressForm.tsx` | Homepage address entry |
| `components/GetStartedClient.tsx` | Main form (all steps) |
| `components/PhoneVerificationModal.tsx` | SMS verification UI |
| `app/api/leads/route.ts` | Create lead API |
| `app/api/leads/verify/route.ts` | Mark lead verified |
| `app/api/verify-phone/send/route.ts` | Send SMS code |
| `app/api/verify-phone/verify/route.ts` | Verify SMS code |
| `lib/phone-utils.ts` | Phone formatting/validation |
| `lib/form-analytics-tracker.ts` | Form analytics |
| `lib/gtm.ts` | GTM tracking events |
