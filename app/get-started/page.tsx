import { Suspense } from "react";
import GetStartedClient from "@/components/GetStartedClient";

export default function GetStartedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    }>
      <GetStartedClient />
    </Suspense>
  );
}
