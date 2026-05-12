"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Timer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { saveToken } from "@/utils/auth";
import { toast } from "sonner";

const schema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type FormData = z.infer<typeof schema>;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email");
  const [email, setEmail] = useState<string>("");

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
    } else if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("reset_email");
      if (stored) setEmail(stored);
    }
  }, [queryEmail]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")} s`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setValue("otp", newDigits.join(""));
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!email) {
      toast.error("Email address not found. Please restart from Forgot Password.");
      return;
    }
    try {
      const res = await verifyOtp({ email, otp: data.otp }).unwrap();
      if (res.success) {
        toast.success(res.message || "Email verified successfully!");
        if (res.data?.access) {
          await saveToken(res.data.access, res.data.user?.user_type || "admin");
        }
        router.push("/auth/reset-password");
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found.");
      return;
    }
    if (isResending) return;
    try {
      const res = await forgotPassword({ email }).unwrap();
      if (res.success) {
        toast.success("A new OTP has been sent to your email.");
        setTimeLeft(600);
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const loading = isSubmitting || isLoading;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full p-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Email OTP Verification</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        OTP sent to your Email Address {email ? <span className="font-medium text-gray-800">{email}</span> : "ending ******doe@example.com"}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2 justify-center">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 ${digit ? "border-orange-400" : "border-gray-200"
                }`}
            />
          ))}
        </div>

        {errors.otp && <p className="text-red-500 text-xs text-center">{errors.otp.message}</p>}

        <div className="flex items-center justify-center gap-1 text-sm">
          <Timer className="h-4 w-4 text-red-500" />
          <span className={`font-medium ${timeLeft < 60 ? "text-red-500" : "text-gray-600"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <p className="text-center text-sm text-gray-500">
          Didn't get the OTP?{" "}
          <button
            type="button"
            disabled={isResending}
            onClick={handleResend}
            className="text-gray-800 font-semibold hover:underline disabled:opacity-50"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & Proceed"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading verification...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}