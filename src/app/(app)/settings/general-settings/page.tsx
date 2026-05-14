"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Loader2, Layers, Globe, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import getFullImageUrl from "@/utils/getFullImageUrl";
import { 
  useGetPlateformBrandingQuery, 
  useUpdatePlateformBrandingMutation 
} from "@/redux/features/auth/auth.api";

// Map precisely to backend response schema fields and required payload spellings
const schema = z.object({
  marketplace_name: z.string().min(1, "Marketplace name is required"),
  support_email: z.string().email("Invalid email address provided"),
  platfrom_persentize: z.coerce.number().min(0).max(100),
  escrow_period: z.coerce.number().min(1),
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
      className="min-h-28 cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 hover:border-slate-900 group"
    >
      {url ? (
        <div className="relative w-full h-20 flex items-center justify-center overflow-hidden rounded-lg bg-white p-1 border border-slate-100 shadow-2xs">
          <img src={url} alt={label} className="h-full w-auto object-contain max-w-full" />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] font-bold text-white px-2 py-1 bg-slate-900/80 rounded backdrop-blur-xs">
              Replace
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2">
          <div className="grid size-9 place-items-center rounded-full bg-white text-slate-400 shadow-2xs mb-1.5 group-hover:scale-110 transition-transform">
            <Upload className="size-4" />
          </div>
          <span className="text-xs font-semibold text-slate-600">{label}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}

interface Toggle {
  wholesaler_registration_alow: boolean;
  reseller_registration: boolean;
  email_verification: boolean;
}

export default function GeneralSettings() {
  const [toggles, setToggles] = useState<Toggle>({
    wholesaler_registration_alow: true,
    reseller_registration: true,
    email_verification: true,
  });

  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  // RTK Query/Mutation integration
  const { data: response, isLoading } = useGetPlateformBrandingQuery();
  const [updateBrandingMutation, { isLoading: isMutating }] = useUpdatePlateformBrandingMutation();

  const brandingData = response?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      marketplace_name: "",
      support_email: "",
      platfrom_persentize: 2.5,
      escrow_period: 7,
    },
  });

  // Prepopulate remote platform branding items on ready state
  useEffect(() => {
    if (brandingData) {
      reset({
        marketplace_name: brandingData.marketplace_name || "",
        support_email: brandingData.support_email || "",
        platfrom_persentize: brandingData.platfrom_persentize ?? 2.5,
        escrow_period: brandingData.escrow_period ?? 7,
      });

      setToggles({
        wholesaler_registration_alow: brandingData.wholesaler_registration_alow ?? true,
        reseller_registration: brandingData.reseller_registration ?? true,
        email_verification: brandingData.email_verification ?? true,
      });

      if (brandingData.platform_logo) {
        setLogoUrl(getFullImageUrl(brandingData.platform_logo));
      }
      if (brandingData.favicon) {
        setFaviconUrl(getFullImageUrl(brandingData.favicon));
      }
    }
  }, [brandingData, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaviconFile(file);
      setFaviconUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("marketplace_name", data.marketplace_name.trim());
      formData.append("support_email", data.support_email.trim());
      formData.append("platfrom_persentize", data.platfrom_persentize.toString());
      formData.append("escrow_period", data.escrow_period.toString());
      
      // Explicitly append boolean toggle options formatted exactly as required by the schema
      formData.append("wholesaler_registration_alow", toggles.wholesaler_registration_alow.toString());
      formData.append("reseller_registration", toggles.reseller_registration.toString());
      formData.append("email_verification", toggles.email_verification.toString());

      if (logoFile) {
        formData.append("platform_logo", logoFile);
      }
      if (faviconFile) {
        formData.append("favicon", faviconFile);
      }

      await updateBrandingMutation(formData).unwrap();
      toast.success("Platform branding properties updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update platform branding configuration.");
    }
  };

  const ToggleSwitch = ({ name }: { name: keyof Toggle }) => (
    <button
      type="button"
      onClick={() => setToggles((t) => ({ ...t, [name]: !t[name] }))}
      disabled={isLoading || isMutating}
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
        toggles[name] ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          toggles[name] ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xs">
      {/* Upper Main Component Identifiers */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Globe className="size-5 text-slate-700" />
          <span>Platform Branding Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage system interface graphics, identity definitions, and primary registry configurations
        </p>
      </div>

      {isLoading ? (
        /* Rich Aesthetics Loading Previews */
        <div className="space-y-6 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Graphics upload panel */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Platform Primary Logo
              </label>
              <UploadBox
                label="Upload Logo Graphic"
                fileRef={logoRef}
                url={logoUrl}
                onChange={handleLogoChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Platform Favicon Icon
              </label>
              <UploadBox
                label="Upload Favicon Image"
                fileRef={faviconRef}
                url={faviconUrl}
                onChange={handleFaviconChange}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Input Parameter Form Values */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Marketplace Identity Name <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("marketplace_name")}
                  placeholder="e.g. Global Mart"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-900 transition-all"
                />
                {errors.marketplace_name && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.marketplace_name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Support Helpdesk Email <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("support_email")}
                  type="email"
                  placeholder="e.g. support@globalmart.com"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-900 transition-all"
                />
                {errors.support_email && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.support_email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Platform Commission Percentage (%)
                </label>
                <input
                  {...register("platfrom_persentize")}
                  type="number"
                  step="any"
                  placeholder="2.5"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-900 transition-all"
                />
                {errors.platfrom_persentize && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.platfrom_persentize.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Escrow Settlement Period (Days)
                </label>
                <input
                  {...register("escrow_period")}
                  type="number"
                  placeholder="7"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-900 transition-all"
                />
                {errors.escrow_period && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.escrow_period.message}</p>
                )}
              </div>
            </div>

            {/* Registration Authorization Settings Options */}
            <div className="pt-4 border-t border-slate-100">
              <div className="mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="size-4.5 text-slate-700" />
                  <span>Platform Gatekeeper & Registration Security</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Toggle dynamic user registry options and automated validation layers directly
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                {[
                  {
                    key: "wholesaler_registration_alow" as keyof Toggle,
                    label: "Wholesaler Registry Portal",
                    desc: "Authorize open external onboarding forms for wholesale supplier entities",
                  },
                  {
                    key: "reseller_registration" as keyof Toggle,
                    label: "Reseller Registry Portal",
                    desc: "Authorize general independent drop-shipping agent onboarding forms",
                  },
                  {
                    key: "email_verification" as keyof Toggle,
                    label: "Mandatory SMTP Verification",
                    desc: "Enforce OTP email token multi-factor authorization logic on initial registry",
                  },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-b-0 border-slate-100">
                    <div className="pr-3">
                      <p className="text-xs font-extrabold text-slate-800">{label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <div className="shrink-0">
                      <ToggleSwitch name={key} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Control Action Button Row */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isMutating}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isMutating && <Loader2 className="size-3.5 animate-spin" />}
                <span>{isMutating ? "Saving..." : "Save Changes"}</span>
              </button>
              <button type="button" className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 sm:w-auto cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}