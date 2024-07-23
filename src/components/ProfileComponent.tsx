import React, { useState, useRef, useEffect } from "react";
import useUserDetails from "@/hooks.ts/useUserDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "./ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProfileComponent = () => {
  const { userDetails, updateUserDetails } = useUserDetails();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        { withCredentials: true }
      );

      if (response.data.type === "success") {
        toast({
          variant: "success",
          description: `Successfully logged out.`,
        });
        updateUserDetails(null);
        router.push("/login");
      } else {
        throw new Error(response.data.message || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "error",
        description: "Failed to logout.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:shadow-lg">
          <AvatarImage src={userDetails?.picture} alt={userDetails?.name} />
          <AvatarFallback>
            {userDetails?.name?.[0]?.toUpperCase() || "M"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="p-2 space-y-1">
          <p className="font-medium truncate" title={userDetails?.name}>
            {userDetails?.name}
          </p>
          <p
            className="text-sm truncate text-muted-foreground"
            title={userDetails?.email}
          >
            {userDetails?.email}
          </p>
          <Button
            onClick={handleLogout}
            className="w-full !mt-2 bg-gray-900 text-white hover:bg-gray-800"
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileComponent;
