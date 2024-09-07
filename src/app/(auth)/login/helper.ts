"use server";

import { cookies } from "next/headers";
import { BackendPost } from "@/utils/backend";
import { backendRoutes } from "@/constants";

export async function loginAction(values: { email: string; password: string }) {
  try {
    const response = await BackendPost({
      path: backendRoutes.login,
      data: values,
      headers: {
        "X-API-NAME": "login",
      },
    });

    if (response?.type === "success" && response?.accessToken && response?.refreshToken) {
      // Set HTTP-only cookies
      cookies().set("accessToken", response.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });

      cookies().set("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return { success: true };
    } else {
      return { success: false, error: response?.message || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}