"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";

const schema = z.object({
  marketplaceName: z.string().min(1, "Marketplace name is required"),
  supportEmail: z.string().email("Invalid email"),
  platformFee: z.coerce.number().min(0).max(100),
  escrowPeriod: z.coerce.number().min(1),
});

type FormData = z.infer<typeof schema>;

type UploadBoxProps = {
  label: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  url: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function UploadBox({ label, fileRef, url, onChange }: UploadBoxProps) {
  return (
    <div
      onClick={() => fileRef.current?.click()}
      className="min-h-25 cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 transition-colors hover:border-blue-300"
    >
      {url ? (
        <Image src={url} alt={label} width={160} height={64} className="h-16 w-auto object-contain" />
      ) : (
        <>
          <Upload className="mb-1 h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-400">{label}</span>
        </>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}

interface Toggle {
  wholesaler: boolean;
  reseller: boolean;
  manualApproval: boolean;
  emailVerification: boolean;
}

export default function GeneralSettings() {
  const [toggles, setToggles] = useState<Toggle>({
    wholesaler: true,
    reseller: true,
    manualApproval: true,
    emailVerification: true,
  });

  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      marketplaceName: "GlobalMart Pro",
      supportEmail: "admin@globalmart.com",
      platformFee: 5,
      escrowPeriod: 7,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log({ ...data, toggles });
  };

  const ToggleSwitch = ({ name }: { name: keyof Toggle }) => (
    <button
      type="button"
      onClick={() => setToggles((t) => ({ ...t, [name]: !t[name] }))}
      className={`relative w-10 h-5 rounded-full transition-colors ${toggles[name] ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggles[name] ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );

  return (
    <div className="space-y-8 rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
      {/* Platform Branding */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Platform Branding</h2>
        <p className="text-sm text-gray-400 mb-4">Configure your marketplace identity</p>

        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Platform Logo</p>
            <UploadBox
              label="Upload Logo"
              fileRef={logoRef}
              url={logoUrl}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setLogoUrl(URL.createObjectURL(f)); }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Favicon</p>
            <UploadBox
              label="Upload Favicon"
              fileRef={faviconRef}
              url={faviconUrl}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setFaviconUrl(URL.createObjectURL(f)); }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Name</label>
              <input
                {...register("marketplaceName")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              {errors.marketplaceName && <p className="text-red-500 text-xs mt-1">{errors.marketplaceName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input
                {...register("supportEmail")}
                type="email"
                readOnly
                className="w-full cursor-not-allowed border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              {errors.supportEmail && <p className="text-red-500 text-xs mt-1">{errors.supportEmail.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
              <input
                {...register("platformFee")}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              {errors.platformFee && <p className="text-red-500 text-xs mt-1">{errors.platformFee.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escrow Period (Days)</label>
              <input
                {...register("escrowPeriod")}
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              {errors.escrowPeriod && <p className="text-red-500 text-xs mt-1">{errors.escrowPeriod.message}</p>}
            </div>
          </div>

          {/* Registration Control */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Registration Control</h3>
            <p className="text-sm text-gray-400 mb-4">Manage how new users join the platform</p>

            <div className="space-y-4">
              {[
                { key: "wholesaler" as keyof Toggle, label: "Wholesaler Registration", desc: "Allow new wholesalers to sign up" },
                { key: "reseller" as keyof Toggle, label: "Reseller Registration", desc: "Allow new resellers to sign up" },
                { key: "manualApproval" as keyof Toggle, label: "Manual Approval", desc: "Admins must verify all new accounts" },
                { key: "emailVerification" as keyof Toggle, label: "Email Verification", desc: "Require email confirmation for all users" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <ToggleSwitch name={key} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 sm:w-auto">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}