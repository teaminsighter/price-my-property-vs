# Changelog

## 2025-12-04

### Form Flow Updates (pmpcms Alignment)
- Fixed Step 5 skip logic: Land Size now skips for Apartment property type
- Added Step 14a (14.1): "Recently Listed?" question for "Listing Soon" selection
- Added Step 14b (14.2): "Go Back to Your Agent" info page for recently listed properties
- Updated Step 14 routing: "Listing Soon" → 14a → (Yes → 14b exit, No → Step 15)
- Added Refinancing Path: Step 14.3 (Goals) → Step 14.4 (Banks) → Contact Details
- Updated Step 15 Extra Features to 6 options matching pmpcms (Sea/Water Views, Heating/Cooling, Lawn Area, Outdoor Entertaining, Spa/Pool/Sauna, None of the Above)
- Added "None of the Above" mutual exclusion logic in Extra Features
- Added Step 12.1: Agent Portal redirect page for Real Estate Agents
- Added Step 12.2: Quiz Error page for disqualified users (Tenant/Buyer/Not My Property)
- Added formData fields: `refinancingGoal`, `bank`

## 2025-12-03

### Lead Management
- Added lead details popup modal (click on lead row to view)
- Phone verification status shown in lead details
- Stats cards now show correct totals from API
- Date filtering on leads API

### Phone Verification & CRM Integration
- Changed flow: Form → submit → CRM (pending) → verify phone → CRM (active)
- Created `/api/leads/verify` endpoint to mark leads as verified
- Local DB saves `phoneVerified` status
- CRM integration calls `mark_lead_verified` API after phone verification

### Technical Notes
- API uses UPPERCASE status (NEW, MEDIUM) as required by Prisma schema
- Stats filter uses `.toLowerCase()` to handle both cases
- `markLeadVerifiedInCRM` function matches CRM API spec (`/api/mark_lead_verified`)

## 2025-12-02

### External CRM Integration
- Integrated with pmpcms CRM API (`/api/create_lead`)
- Added `externalLeadId` and `activeCampaignId` fields to Lead model
- Leads API captures and saves CRM IDs from response
- Added ActiveCampaign ID column to LeadManagementTable

### Phone Verification
- Implemented phone verification modal with SMS code
- Test phone numbers supported (64333333 → code: 123456)
- 10-minute code expiry with resend functionality

### Address & Form
- Server-side Google Places API integration
- Zipcode validation before form submission
- Fixed AddressForm button disabled styling (conditional className)

### Database
- Switched Prisma schema to MySQL provider for production
- Fixed FormAnalytics `answers` and `stepHistory` columns (`@db.Text` for long content)

### Deployment
- Added comprehensive automated deployment script with PM2 support
- Added Hostinger deployment script

### Admin
- Removed default credentials from login page
- Added seed file for admin user creation
- PM2 + ngrok setup for production

## 2025-11-26

### GTM Tracking & Attribution
- Implemented full GTM dataLayer tracking with 15+ event types
- Created GTMTrackingProvider for automatic page view and scroll tracking
- Enable dynamic GTM container connect/disconnect without page reload

### User ID Tracking
- Created user-tracking.ts utility for visitor ID generation
- Generate unique visitor ID stored in localStorage (persists across sessions)
- Capture GA Client ID from _ga cookie
- Capture Facebook cookies (_fbp, _fbc)
- Push user_id, client_id, visitor_id to all GTM dataLayer events
- Add is_returning_visitor and session_count to tracking
- Store uniqueUserId, gaClientId, fbp, fbc in Lead database records
- Enable cross-platform user stitching for GA4, Google Ads, Facebook

### UTM Attribution
- Add UTM/GCLID/FBCLID capture, persistence, and database storage
- Store attribution data in lead records

### UI Improvements
- Added Ken Burns zoom effect to hero slideshow for smoother transitions
- Updated landing page images to new .webp assets
- Fixed form step navigation (removed blank step 16 issue)

## 2025-11-25

### User Management
- Added full user management API routes (CRUD operations)
- Added password change and profile update functionality
- Added email change support for admin profile with duplicate validation

### GTM Integration
- Added GTM script injection with dynamic settings
- Moved GTM Config from Tracking Setup to Integrations tab
- Added GTMConfigSimple component to IntegrationsContent

### Tracking & Attribution
- Added UTM parameter tracking for lead attribution
- Added column header tooltips for lead management table

### Database
- Added MySQL-compatible Prisma schema for Hostinger deployment
- Added analytics overview API route

### Bug Fixes
- Fixed Suspense boundary for useSearchParams in AddressForm
- Updated auth route to use shared Prisma client

## 2025-11-20

### Initial Release
- Multi-step property valuation form with Google Maps integration
- Comprehensive admin dashboard with analytics
- Form analytics tracking with step-by-step analysis
- Lead management and CRM features
- A/B testing and page builder functionality
- Real-time visitor analytics
- NextAuth authentication
- Prisma ORM with database schema
- Responsive UI with Tailwind CSS
- Production build optimized
