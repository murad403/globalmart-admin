"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "This password is too short. It must contain at least 8 characters.")
      .refine((val) => !/^\d+$/.test(val), {
        message: "This password is entirely numeric.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await resetPassword({ new_password: data.newPassword }).unwrap();
      if (res.success) {
        toast.success(res.message || "Your password has been reset successfully.");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("reset_email");
        }
        router.push("/auth/auth-success");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    }
  };

  const loading = isSubmitting || isLoading;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full p-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Reset password?</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Enter New Password &amp; Confirm Password to get inside
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("newPassword")}
              type={showNew ? "text" : "password"}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="New Password"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-400">
              {showNew ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="Confirm Password"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-400">
              {showConfirm ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : "Change Password"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Return to{" "}
        <Link href="/" className="text-orange-500 font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}