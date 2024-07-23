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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

import getGoogleOAuthURL from "@/utils/getGoogleUrl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useUserDetails from "@/hooks.ts/useUserDetails";

const signUpSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    passwordConfirmation: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpInput = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { updateUserDetails, userDetails } = useUserDetails({
    preventInitialCall: true,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: SignUpInput) {
    setIsLoading(true);

    try {
      // Replace this with your actual API call
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values,
        { withCredentials: true, validateStatus: (status) => status < 500 }
      );

      if (response?.data?.type === "success" && response?.data?.user) {
        toast({
          variant: "success",
          title: "Signup successfull",
          description: `Welcome ${values.name}!`,
        });
        updateUserDetails(response?.data?.user);

        router.push("/");
      } else if (response?.data?.message) {
        toast({
          variant: "error",
          description: response?.data?.message,
        });
      } else {
        throw new Error("Failed to signup");
      }
    } catch (e) {
      toast({
        variant: "error",
        description: "An error occurred during sign up. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-[350px] w-full mx-auto my-8">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
              Sign Up
            </Button>
            <p className="text-xs text-gray-700 text-center">
              Already have an account?{" "}
              <span className="text-blue-500 ">
                <Link href="/login">Login</Link>
              </span>
            </p>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Link href={getGoogleOAuthURL()} className="w-full">
          <Button variant="outline" className="w-full">
            <Icons.google className="mr-2 h-4 w-4" />
            Sign up with Google
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
