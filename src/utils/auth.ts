"use server";
import { cookies } from "next/headers";

export const saveToken = async (access: string, userType: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("access", access, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  cookieStore.set("user_type", userType, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const getCurrentUser = async (): Promise<{ access: string | undefined; userType: string | undefined }> => {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  const userType = cookieStore.get("user_type")?.value;
  return { access, userType };
};

export const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("access");
  cookieStore.delete("user_type");
};