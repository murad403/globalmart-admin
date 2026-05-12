"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().optional(),
  email: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  user_type: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  postal_Code: z.string().min(1, "Postcode is required"),
  street_address: z.string().min(1, "Street address is required"),
});

type FormData = z.infer<typeof schema>;

const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.12.15:8001/api/v1";
  const origin = baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: profileResponse, isLoading: isFetching, refetch } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const profileData = profileResponse?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      user_type: "admin",
      country: "",
      city: "",
      postal_Code: "",
      street_address: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      const p = profileData.profile || {};
      reset({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        first_name: p.first_name || "",
        last_name: p.last_name || "",
        phone: profileData.phone || p.phone_number || "",
        user_type: profileData.user_type || "admin",
        country: p.country || "",
        city: p.city || "",
        postal_Code: p.postal_Code || p.postal_code || "",
        street_address: p.street_address || "",
      });
      if (profileData.image) {
        setAvatarUrl(getFullImageUrl(profileData.image));
      }
    }
  }, [profileData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const existingProfile = profileData?.profile || {};
      const newFullName = `${data.first_name} ${data.last_name}`.trim();

      const payload = {
        full_name: newFullName || data.full_name || "Admin User",
        phone: data.phone,
        profile: {
          ...existingProfile,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone,
          country: data.country,
          city: data.city,
          postal_Code: data.postal_Code,
          street_address: data.street_address,
        },
      };

      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("image", file);
      try {
        await updateProfile(formData).unwrap();
        toast.success("Profile photo updated successfully!");
        refetch();
      } catch (err: any) {
        toast.error("Failed to update profile photo");
      }
      e.target.value = "";
    }
  };

  const initial = profileData?.full_name ? profileData.full_name.charAt(0).toUpperCase() : "A";
  const loading = isFetching || isUpdating;

  if (isFetching) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-5"></div>

        {/* Avatar skeleton */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="h-14 w-14 bg-gray-200 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Form grid skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(10)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-1.5"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Admin Profile</h2>

      {/* Avatar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-blue-600 shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xl font-bold">{initial}</span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-gray-200 cursor-pointer px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Upload New Photo
          </button>
          <button
            type="button"
            onClick={() => setAvatarUrl(null)}
            className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
          >
            Remove
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register("full_name")}
              readOnly
              className="w-full cursor-not-allowed bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              {...register("email")}
              type="email"
              readOnly
              className="w-full cursor-not-allowed bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              {...register("first_name")}
              placeholder="Enter first name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              {...register("last_name")}
              placeholder="Enter last name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Enter phone number"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <input
              {...register("user_type")}
              readOnly
              className="w-full cursor-not-allowed bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm capitalize focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              {...register("country")}
              placeholder="Enter country"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              {...register("city")}
              placeholder="Enter city"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <input
              {...register("postal_Code")}
              placeholder="Enter postcode"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.postal_Code && <p className="text-red-500 text-xs mt-1">{errors.postal_Code.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              {...register("street_address")}
              placeholder="Enter street address"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            {errors.street_address && <p className="text-red-500 text-xs mt-1">{errors.street_address.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 cursor-pointer px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (profileData) {
                const p = profileData.profile || {};
                reset({
                  full_name: profileData.full_name || "",
                  email: profileData.email || "",
                  first_name: p.first_name || "",
                  last_name: p.last_name || "",
                  phone: profileData.phone || p.phone_number || "",
                  user_type: profileData.user_type || "admin",
                  country: p.country || "",
                  city: p.city || "",
                  postal_Code: p.postal_Code || p.postal_code || "",
                  street_address: p.street_address || "",
                });
              }
            }}
            className="rounded-lg border border-gray-200 cursor-pointer px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 sm:w-auto disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}