"use client";
import React from "react";
import { useGetProfileQuery } from "@/redux/features/auth/auth.api";

const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.12.15:8001/api/v1";
  const origin = baseUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};

const TopbarUserProfile = () => {
  const { data: profileResponse } = useGetProfileQuery(undefined);
  const profileData = profileResponse?.data;

  const fullName = profileData?.full_name || "Admin User";
  const userType = profileData?.user_type || "admin";
  const image = getFullImageUrl(profileData?.image);

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "A";

  return (
    <div className="flex items-center gap-2.5">
      <div className="hidden text-right sm:block">
        <p className="text-base font-semibold text-slate-800">{fullName}</p>
        <p className="text-xs md:text-sm text-slate-500 capitalize">{userType}</p>
      </div>
      <div className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-blue-500 text-xs font-semibold text-white shrink-0">
        {image ? (
          <img src={image} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>
    </div>
  );
};

export default TopbarUserProfile;
