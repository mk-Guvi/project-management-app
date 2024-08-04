"use server"
import { cookies } from "next/headers";

// Define a custom type for cookie options
interface CookieOptions {
  maxAge?: number; // in milliseconds
  httpOnly?: boolean;
  domain?: string;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  name?:string
  value?:string
}

const domain = process.env.COOKIE_DOMAIN || "localhost";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain,
  path: "/",
  sameSite: "none",
  secure: true, // true in production, false in development
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10, // 1 year
};

// Async function to set a cookie
export const setCookie = async (key: string, value: string, options: CookieOptions) => {
  const cookieOptions = {
    name: key,
    value,
    ...options,
  };
  cookies().set(cookieOptions);
};

// Async function to create a cookie
export const createCookie = async (key: string, value: string) => {
  await setCookie(key, value, accessTokenCookieOptions);
};

// Async function to delete a cookie
export const deleteCookie = async (key: string) => {
  const deleteOptions: CookieOptions = {
    name: key,
    value: '', // Setting value to an empty string
    maxAge: 0, // Set maxAge to 0 to delete the cookie
    domain,
    path: '/',
  };
  await setCookie(key, '', deleteOptions);
};
