"use server";

import { getCurrentUser, removeToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

const SIGN_IN_URL = "/auth/sign-in";
const DASHBOARD_URL = "/";

// Function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;

        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp;

        if (!exp) return false;
        return Date.now() >= exp * 1000;
    } catch (error) {
        return true;
    }
}

export async function proxy(request: NextRequest) {
    const { access, userType } = await getCurrentUser();
    const { pathname } = request.nextUrl;
    const isAuthPage = pathname.startsWith("/auth");

    const hasValidAccess = access && !isTokenExpired(access);
    const isAdmin = userType === "admin";

    // If access token exists but is expired
    if (access && isTokenExpired(access)) {
        await removeToken();
        return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
    }

    // If valid access token exists and user is admin, but on auth page, redirect to dashboard
    if (hasValidAccess && isAdmin && isAuthPage) {
        return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
    }

    // If not on auth page, verify user has valid access AND is an admin
    if (!isAuthPage) {
        if (!hasValidAccess || !isAdmin) {
            // If they are not an admin but have an access token, remove token to clear session
            if (access) {
                await removeToken();
            }
            return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/auth/:path*",
        "/users/:path*",
        "/ai-customers/:path*",
        "/categories/:path*",
        "/contents/:path*",
        "/faq/:path*",
        "/finance/:path*",
        "/messages/:path*",
        "/overview/:path*",
        "/products/:path*",
        "/reports/:path*",
        "/settings/:path*",
        "/ai-translation/:path*",
        "/manage-translation/:path*",
        "/upload-dataset/:path*"
    ]
};