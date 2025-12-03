"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import MapBackground from "@/components/MapBackground";
import { formTracker } from "@/lib/form-analytics-tracker";
import GTM from "@/lib/gtm";
import { PhoneVerificationModal } from "@/components/PhoneVerificationModal";
import { usePhoneVerification } from "@/hooks/use-phone-verification";
import { formatPhoneNumber, isValidNZPhone } from "@/lib/phone-utils";

// Step component variants for animations
const stepVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function GetStartedClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(3); // Start at Property Type step
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const previousStepRef = useRef(3);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);

  // Phone verification hook
  const {
    isVerificationOpen,
    phoneToVerify,
    verificationId,
    isVerified,
    startVerification,
    handleVerified,
    closeVerification,
    resetVerification,
  } = usePhoneVerification();
  const [formData, setFormData] = useState({
    address: "",
    postal: "",
    propertyType: "",
    houseSqm: 250,
    landSize: 625,
    houseAge: 20,
    bedrooms: 3,
    bathrooms: 2,
    cvValuation: 750000,
    hasGarage: "",
    garageCapacity: "",
    condition: "",
    relationship: "",
    situation: "",
    otherSituation: "",
    extraFeatures: [] as string[],
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    // UTM tracking fields
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
    gclid: "",
    fbclid: "",
    // User tracking IDs
    uniqueUserId: "",
    gaClientId: "",
    fbp: "",
    fbc: "",
    source: "Website Form",
  });

  const totalSteps = 16; // Reduced from 17 since we removed the address step

  // Get address, postal and UTM parameters from URL query parameters
  useEffect(() => {
    const addressFromUrl = searchParams.get("address");
    const postalFromUrl = searchParams.get("postal");
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");
    const utmContent = searchParams.get("utm_content");
    const gclid = searchParams.get("gclid");
    const fbclid = searchParams.get("fbclid");

    setFormData(prev => ({
      ...prev,
      ...(addressFromUrl && { address: addressFromUrl }),
      ...(postalFromUrl && { postal: postalFromUrl }),
      ...(utmSource && { utmSource }),
      ...(utmMedium && { utmMedium }),
      ...(utmCampaign && { utmCampaign }),
      ...(utmTerm && { utmTerm }),
      ...(utmContent && { utmContent }),
      ...(gclid && { gclid }),
      ...(fbclid && { fbclid }),
    }));

    // Log UTM params for debugging
    if (utmSource || utmMedium || utmCampaign || gclid || fbclid) {
      console.log('UTM Parameters captured:', {
        utmSource, utmMedium, utmCampaign, utmTerm, utmContent, gclid, fbclid
      });
    }
  }, [searchParams]);

  // Auto-redirect to home after 3 seconds on thank you page
  useEffect(() => {
    if (currentStep === 18) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  // Initialize analytics session on mount
  useEffect(() => {
    formTracker.createSession();
    formTracker.trackStepEnter(currentStep);

    // Initialize GTM tracking and track form start
    GTM.initializeTracking();
    GTM.trackFormStart('property_valuation', formTracker.getSessionId?.() || undefined);

    // Capture user tracking IDs
    const userIds = GTM.getAllUserTrackingIds();
    setFormData(prev => ({
      ...prev,
      uniqueUserId: userIds.visitorId || "",
      gaClientId: userIds.gaClientId || "",
      fbp: userIds.fbp || "",
      fbc: userIds.fbc || "",
    }));

    if (process.env.NODE_ENV === 'development') {
      console.log('🆔 User tracking IDs captured:', userIds);
    }
  }, []);

  // Step names for tracking (Note: step 16 doesn't exist, jumps from 15 to 17)
  const stepNames: Record<number, string> = {
    3: 'Property Type',
    4: 'House Size',
    5: 'Land Size',
    6: 'House Age',
    7: 'Bedrooms',
    8: 'Bathrooms',
    9: 'CV Valuation',
    10: 'Garage',
    10.5: 'Garage Capacity',
    11: 'Condition',
    12: 'Relationship',
    13: 'Situation',
    14: 'Clarify Situation',
    15: 'Extra Features',
    16: 'Skip', // This step is skipped
    17: 'Contact Details',
    18: 'Thank You'
  };

  // Track step changes
  useEffect(() => {
    const previousStep = previousStepRef.current;

    if (previousStep !== currentStep) {
      // Get answer for previous step
      const getAnswerForStep = (step: number) => {
        switch(step) {
          case 3: return formData.propertyType;
          case 4: return formData.houseSqm;
          case 5: return formData.landSize;
          case 6: return formData.houseAge;
          case 7: return formData.bedrooms;
          case 8: return formData.bathrooms;
          case 9: return formData.cvValuation;
          case 10: return formData.hasGarage;
          case 10.5: return formData.garageCapacity;
          case 11: return formData.condition;
          case 12: return formData.relationship;
          case 13: return formData.situation;
          case 14: return formData.otherSituation;
          case 15: return formData.extraFeatures;
          case 17: return { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, mobile: formData.mobile };
          default: return null;
        }
      };

      // Track exit of previous step
      formTracker.trackStepExit(previousStep, getAnswerForStep(previousStep), formData);

      // Track enter of new step
      formTracker.trackStepEnter(currentStep);

      // GTM: Track form step progression
      GTM.trackFormProgress({
        form_name: 'property_valuation',
        step_number: currentStep,
        step_name: stepNames[currentStep] || `Step ${currentStep}`,
        total_steps: totalSteps,
        form_session_id: formTracker.getSessionId?.() || undefined
      });

      // Update ref
      previousStepRef.current = currentStep;
    }
  }, [currentStep, formData]);

  const handleNext = () => {
    // Determine next step based on conditions
    let nextStep = currentStep + 1;

    // Skip logic based on property type
    const isLandOnly = formData.propertyType === "Land Only";
    const isApartment = formData.propertyType === "Apartment";

    if (currentStep === 3) {
      // After property type selection
      if (isLandOnly && nextStep === 4) nextStep = 5; // Skip house SQM
    }

    if (currentStep === 4 && isLandOnly) {
      nextStep = 9; // Skip to CV valuation
    }

    if (currentStep === 5 && isApartment) {
      nextStep = 6; // Skip land size for apartments
    }

    if (currentStep === 5 && !isApartment && !isLandOnly) {
      nextStep = 6;
    }

    if (currentStep === 8 && isLandOnly) {
      nextStep = 9; // Skip bathrooms
    }

    if (currentStep === 10 && isLandOnly) {
      nextStep = 12; // Skip garage and condition
    }

    if (currentStep === 11 && isLandOnly) {
      nextStep = 12; // Skip condition
    }

    if (currentStep === 12) {
      // Relationship routing
      if (formData.relationship === "Real Estate Agent") {
        alert("Redirecting to agent page...");
        return;
      }
      if (["Tenant", "Buyer", "Not My Property"].includes(formData.relationship)) {
        alert("Sorry, this service is only for property owners.");
        return;
      }
    }

    if (currentStep === 13) {
      if (formData.situation === "Other") {
        nextStep = 14; // Go to clarify
      } else {
        nextStep = 15; // Skip to extra features
      }
    }

    if (currentStep === 14) {
      if (formData.otherSituation === "Refinancing") {
        alert("Redirecting to refinancing path...");
        return;
      }
      // All other options go to step 15 (extra features)
      nextStep = 15;
    }

    // Skip step 16 (doesn't exist) - go straight to 17
    if (nextStep === 16) {
      nextStep = 17;
    }

    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit form first, then start phone verification
  const submitForm = async () => {
    try {
      // Submit to API (without phone verification - that comes after)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phoneVerified: false, // Will be updated after phone verification
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Mark analytics session as completed
        await formTracker.markCompleted(result.leadId);

        // GTM: Track lead submission (MAIN CONVERSION EVENT)
        GTM.trackLeadSubmission(
          {
            lead_id: result.leadId,
            property_type: formData.propertyType,
            property_value: `$${formData.cvValuation.toLocaleString()}`,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            location: formData.address,
            timeframe: formData.situation,
            situation: formData.situation,
          },
          {
            email: formData.email,
            phone_number: formData.mobile,
            first_name: formData.firstName,
            last_name: formData.lastName,
            address: {
              street: formData.address,
              country: 'NZ'
            }
          },
          formTracker.getSessionId?.() || undefined
        );

        // GTM: Track form completion
        GTM.trackFormComplete(
          'property_valuation',
          totalSteps,
          0, // We don't have total time tracked here
          formTracker.getSessionId?.() || undefined
        );

        // Save lead ID and start phone verification
        setCreatedLeadId(result.leadId);
        startVerification(formData.mobile);
      } else {
        // GTM: Track error
        GTM.trackError('form_submission', 'API returned error', 'GetStartedClient.handleSubmit');
        alert("There was an error submitting your form. Please try again.");
      }
    } catch (error) {
      // GTM: Track error
      GTM.trackError('form_submission', error instanceof Error ? error.message : 'Unknown error', 'GetStartedClient.handleSubmit');
      alert("There was an error submitting your form. Please try again.");
    }
  };

  // Handle submit button click - validate and submit form
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate phone number format
    if (!isValidNZPhone(formData.mobile)) {
      setPhoneError("Please enter a valid NZ phone number");
      return;
    }

    setPhoneError(null);

    // Submit form directly - phone verification will happen after
    submitForm();
  };

  // Handle successful phone verification - mark lead as verified
  const onPhoneVerified = async (verificationId: string) => {
    handleVerified(verificationId);

    // Call API to mark lead as verified (local + CRM)
    if (createdLeadId) {
      try {
        const response = await fetch('/api/leads/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadId: createdLeadId,
            verificationId: verificationId,
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log('Lead marked as verified');
        } else {
          console.error('Failed to mark lead as verified:', result.error);
        }
      } catch (error) {
        console.error('Error marking lead as verified:', error);
      }
    }

    // Go to thank you page
    setCurrentStep(18);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderStep = () => {
    const isLandOnly = formData.propertyType === "Land Only";

    switch (currentStep) {
      case 3:
        return (
          <StepContainer title="Select Property Type">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Free Standing", "Town House", "Apartment", "Land Only", "Terraced", "Semi Detached"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    updateFormData("propertyType", type);
                    setTimeout(handleNext, 300);
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.propertyType === type
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 hover:border-primary bg-white text-gray-900"
                  }`}
                >
                  <span className="text-lg font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 4:
        if (isLandOnly) return null;
        return (
          <StepContainer title="House Size (SQM)">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{formData.houseSqm} sqm</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={formData.houseSqm}
                onChange={(e) => updateFormData("houseSqm", parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0 sqm</span>
                <span>500 sqm</span>
              </div>
            </div>
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer title="Size of Land">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{formData.landSize} sqm</span>
              </div>
              <input
                type="range"
                min="250"
                max="3000"
                step="50"
                value={formData.landSize}
                onChange={(e) => updateFormData("landSize", parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>250 sqm</span>
                <span>3,000 sqm</span>
              </div>
            </div>
          </StepContainer>
        );

      case 6:
        if (isLandOnly) return null;
        return (
          <StepContainer title="How Old is the House?">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{formData.houseAge} years</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.houseAge}
                onChange={(e) => updateFormData("houseAge", parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Brand New</span>
                <span>100+ years</span>
              </div>
            </div>
          </StepContainer>
        );

      case 7:
        if (isLandOnly) return null;
        return (
          <StepContainer title="Number of Bedrooms">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{formData.bedrooms}</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={formData.bedrooms}
                onChange={(e) => updateFormData("bedrooms", parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>6+</span>
              </div>
            </div>
          </StepContainer>
        );

      case 8:
        if (isLandOnly) return null;
        return (
          <StepContainer title="Number of Bathrooms">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{formData.bathrooms}</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={formData.bathrooms}
                onChange={(e) => updateFormData("bathrooms", parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>4+</span>
              </div>
            </div>
          </StepContainer>
        );

      case 9:
        return (
          <StepContainer title="Last CV Valuation">
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">
                  ${(formData.cvValuation / 1000).toFixed(0)}K
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={formData.cvValuation}
                onChange={(e) => updateFormData("cvValuation", parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>$100K</span>
                <span>$3M</span>
              </div>
            </div>
          </StepContainer>
        );

      case 10:
        if (isLandOnly) return null;
        return (
          <StepContainer title="Does it have an Internal Garage?">
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => {
                  updateFormData("hasGarage", "Yes");
                  setCurrentStep(10.5); // Go to garage capacity
                }}
                className="p-8 rounded-lg border-2 border-gray-300 hover:border-primary transition-all bg-white text-gray-900"
              >
                <span className="text-2xl font-bold">Yes</span>
              </button>
              <button
                onClick={() => {
                  updateFormData("hasGarage", "No");
                  setTimeout(handleNext, 300);
                }}
                className="p-8 rounded-lg border-2 border-gray-300 hover:border-primary transition-all bg-white text-gray-900"
              >
                <span className="text-2xl font-bold">No</span>
              </button>
            </div>
          </StepContainer>
        );

      case 10.5:
        return (
          <StepContainer title="Garage Capacity">
            <div className="grid grid-cols-3 gap-4">
              {["1", "2", "3+"].map((capacity) => (
                <button
                  key={capacity}
                  onClick={() => {
                    updateFormData("garageCapacity", capacity);
                    setTimeout(() => setCurrentStep(11), 300);
                  }}
                  className="p-8 rounded-lg border-2 border-gray-300 hover:border-primary transition-all bg-white text-gray-900"
                >
                  <span className="text-3xl font-bold">{capacity}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 11:
        if (isLandOnly) return null;
        return (
          <StepContainer title="Condition of House">
            <div className="grid grid-cols-1 gap-4">
              {["Needs Work", "Liveable & Tidy", "Recently Renovated"].map((cond) => (
                <button
                  key={cond}
                  onClick={() => {
                    updateFormData("condition", cond);
                    setTimeout(handleNext, 300);
                  }}
                  className="p-6 rounded-lg border-2 border-gray-300 hover:border-primary transition-all text-left bg-white text-gray-900"
                >
                  <span className="text-xl font-semibold">{cond}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 12:
        return (
          <StepContainer title="Your Relationship with this Property">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Owner", "Estate", "Buyer", "Tenant", "Not My Property", "Real Estate Agent"].map((rel) => (
                <button
                  key={rel}
                  onClick={() => {
                    updateFormData("relationship", rel);
                    setTimeout(handleNext, 300);
                  }}
                  className="p-6 rounded-lg border-2 border-gray-300 hover:border-primary transition-all bg-white text-gray-900"
                >
                  <span className="text-lg font-semibold">{rel}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 13:
        return (
          <StepContainer title="What's Your Situation?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Downsizing", "Selling Investment", "Need Larger Home", "Thinking of Selling", "Moving", "Other"].map((sit) => (
                <button
                  key={sit}
                  onClick={() => {
                    updateFormData("situation", sit);
                    setTimeout(handleNext, 300);
                  }}
                  className="p-6 rounded-lg border-2 border-gray-300 hover:border-primary transition-all bg-white text-gray-900"
                >
                  <span className="text-lg font-semibold">{sit}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 14:
        return (
          <StepContainer title="Can you clarify?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Listing Soon", "Want Appraisal", "Have Bought Already", "Find Out Worth", "Refinancing"].map((other) => (
                <button
                  key={other}
                  onClick={() => {
                    updateFormData("otherSituation", other);
                    setTimeout(handleNext, 300);
                  }}
                  className="p-6 rounded-lg border-2 border-gray-300 hover:border-primary transition-all bg-white text-gray-900"
                >
                  <span className="text-lg font-semibold">{other}</span>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 15:
        return (
          <StepContainer title="Select Extra Features">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Sea View", "Heating", "Lawn", "Outdoor Area", "Spa", "Pool", "Deck", "Fireplace"].map((feature) => (
                <button
                  key={feature}
                  onClick={() => {
                    const features = formData.extraFeatures.includes(feature)
                      ? formData.extraFeatures.filter((f) => f !== feature)
                      : [...formData.extraFeatures, feature];
                    updateFormData("extraFeatures", features);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.extraFeatures.includes(feature)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  <span className="font-semibold">{feature}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">Select at least one feature</p>
          </StepContainer>
        );

      case 17:
        return (
          <StepContainer title="Your Contact Details">
            <div className="space-y-4">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                placeholder="First Name"
                className="w-full px-6 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-600"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                placeholder="Last Name"
                className="w-full px-6 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-600"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="Email"
                className="w-full px-6 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-600"
              />
              <div>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    updateFormData("mobile", formatted);
                    setPhoneError(null);
                  }}
                  placeholder="Mobile (e.g., 021 234 5678)"
                  className={`w-full px-6 py-4 border-2 bg-white/10 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-600 ${
                    phoneError ? 'border-red-500' : 'border-white/30'
                  }`}
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
                {isVerified && phoneToVerify === formData.mobile && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Phone verified
                  </p>
                )}
              </div>
            </div>
          </StepContainer>
        );

      case 18:
        return (
          <div className="text-center space-y-8 py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Thank You!</h2>
            <p className="text-xl text-gray-800 max-w-md mx-auto">
              Your property valuation request has been submitted successfully.
            </p>
            <p className="text-lg text-gray-700">
              One of our expert agents will contact you shortly.
            </p>
            <p className="text-sm text-gray-600 mt-8">
              Redirecting to home page in 3 seconds...
            </p>
          </div>
        );

      default:
        return <div>Step {currentStep}</div>;
    }
  };

  // Calculate actual progress (steps 3-17 = 15 steps total, but totalSteps is 16 for display)
  const actualStepNumber = currentStep - 2; // Step 3 becomes Step 1, etc.
  const progressPercent = Math.round((actualStepNumber / 15) * 100);

  return (
    <>
      {/* Load Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => {
          setIsGoogleMapsLoaded(true);
        }}
        onReady={() => {
          setIsGoogleMapsLoaded(true);
        }}
        onError={() => {
          // Handle error silently
        }}
      />

      {/* Map Background */}
      {formData.address && (
        <>
          {/* Loading background while map loads */}
          {!isGoogleMapsLoaded && (
            <div className="fixed inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-50 to-blue-100" />
          )}

          {/* Actual map */}
          {isGoogleMapsLoaded && <MapBackground address={formData.address} />}
        </>
      )}

      <div className="min-h-screen flex items-center justify-center p-4 relative pointer-events-none z-10">
        <div className="w-full max-w-3xl relative pointer-events-auto z-20">
        {/* Property Address Display */}
        {formData.address && (
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-xl">
            <p className="text-sm text-primary font-semibold">Property Address:</p>
            <p className="text-lg font-bold text-primary">{formData.address}</p>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-30">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="relative z-40"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-end mt-8">
            {currentStep < 17 && ![3, 10, 11, 12, 13, 14, 15].includes(currentStep) && (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors font-semibold"
              >
                Continue →
              </button>
            )}
            {currentStep === 15 && formData.extraFeatures.length > 0 && (
              <button
                onClick={() => setCurrentStep(17)}
                className="px-8 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors font-semibold"
              >
                Continue →
              </button>
            )}
            {currentStep === 17 && (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors font-semibold"
              >
                Submit →
              </button>
            )}
          </div>
        </div>

        {/* Home Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>

    {/* Phone Verification Modal */}
    <PhoneVerificationModal
      isOpen={isVerificationOpen}
      onClose={closeVerification}
      phone={phoneToVerify}
      onVerified={onPhoneVerified}
    />
    </>
  );
}

// Helper component for step container
function StepContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-8 min-h-[200px]">
      <h2 className="text-3xl md:text-4xl font-bold text-primary text-center drop-shadow-sm">{title}</h2>
      <div className="relative z-50">{children}</div>
    </div>
  );
}
