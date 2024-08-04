"use server";
import { cookies } from "next/headers";

const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost";
interface CookieOptions {
  maxAge?: number; // in milliseconds
  httpOnly?: boolean;
  domain?: string;
  path?: string;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
}

export const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain,
  path: "/",
  sameSite: "none",
  secure: true, // true in production, false in development
};

export const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

// Function to set a cookie
export const setCookie = (
  key: string,
  value: string,
  options?: CookieOptions
) => {
  cookies().set({
    name: key,
    value,
    ...options,
  });
};


// Function to delete a cookie
export const deleteCookie = (key: string) => {
  cookies().set({
    name: key,
    value: "", // Setting value to an empty string
    maxAge: 0, // Set maxAge to 0 to delete the cookie
    domain,
    path: "/",
  });
};
