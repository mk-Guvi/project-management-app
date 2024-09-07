"use client";
import React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import getGoogleOAuthURL from "@/utils/getGoogleUrl";
import { useRouter } from "next/navigation";
import useUserDetails from "@/hooks.ts/useUserDetails";
import { BackendPost } from "@/utils/backend";
import { backendRoutes } from "@/constants";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { fetchUserDetails, userDetails } = useUserDetails({
    preventInitialCall: true,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setIsLoading(true);

    try {
      const response = await BackendPost({
        path: backendRoutes.login,
        data: values,
        headers: {
          "X-API-NAME": "login",
        },
      });

      if (response?.type == "success") {
        await fetchUserDetails();
        router.push("/");
      } else if (response?.message) {
        toast({
          variant: "error",
          description: response?.message,
        });
      } else {
        throw new Error("Failed to login");
      }
    } catch (e) {
      console.log(e);
      toast({
        variant: "error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
    
  }

  return (
    <Card className="max-w-[350px] w-full m-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login
            </Button>
            <p className="text-xs text-gray-700 text-center">
              Don&apos;t have an account?{" "}
              <span className="text-blue-500 ">
                <Link href="/signup">Signup</Link>
              </span>
            </p>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Link href={getGoogleOAuthURL()} className="w-full">
          <Button
            variant="outline"
            className="w-full"
            // onClick={handleGoogleSignIn}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
