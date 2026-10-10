import { Suspense } from "react";
import OTPForm from "../../../components/auth/OTPForm";
import Spinner from "../../../components/ui/Spinner";

export const metadata = {
  title: "Verify Email | COMSATS Alumni Portal",
  description: "Enter your 6-digit verification code to complete account verification.",
};

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Spinner size="lg" /></div>}>
      <OTPForm />
    </Suspense>
  );
}
