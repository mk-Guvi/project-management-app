"use client";
import React from "react";
import ProfileComponent from "./ProfileComponent";
import useUserDetails from "@/hooks.ts/useUserDetails";

function Topbar() {
  return (
    <div className="fixed w-full top-0 z-10  bg-background items-center px-8 h-[60px] border-b drop-shadow flex justify-between gap-2 flex-wrap">
      <h1 className="font-semibold tracking-wide">Project management</h1>
      <ProfileComponent />
    </div>
  );
}

export default Topbar;
