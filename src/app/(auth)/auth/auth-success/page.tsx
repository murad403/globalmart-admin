"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function AuthSuccess() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Success</h1>
      <p className="text-gray-500 text-sm mb-6">Your new password has been successfully saved</p>

      <Link
        href="/auth/sign-in"
        className="block w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-center"
      >
        Back to Sign In
      </Link>
    </div>
  );
}