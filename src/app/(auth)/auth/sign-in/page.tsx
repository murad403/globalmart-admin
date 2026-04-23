"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().trim().nonempty("Email is required").email("Invalid email"),
  password: z.string().trim().nonempty("Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        console.log(data);
        router.push('/')
        // handle sign in
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full p-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Sign In</h1>
            <p className="text-gray-500 text-sm text-center mb-6">
                Access the Dreamspos panel using your email and passcode.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            {...register("email")}
                            type="email"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                            placeholder="Enter email"
                        />
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                            placeholder="Enter password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400"
                        >
                            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            {...register("rememberMe")}
                            type="checkbox"
                            className="w-4 h-4 accent-orange-500"
                            defaultChecked
                        />
                        <span className="text-sm text-gray-600">Remember Me</span>
                    </label>
                    <Link href="/auth/forgot-password" className="text-sm text-orange-500 font-medium hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    );
}