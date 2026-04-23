"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";


const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    // send reset email
    router.push("/auth/verify-otp")
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full p-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Forgot password?</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        If you forgot your password, well, then we'll email you instructions to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              placeholder="Enter your email"
            />
            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Sending..." : "Submit"}
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