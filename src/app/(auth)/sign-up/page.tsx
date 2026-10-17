"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";

import { useDebounceCallback } from "usehooks-ts";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schema/signupSehema";
import { ApiResponse } from "@/types/ApiResponse";

import { Field } from "@/components/ui/field";
import { FieldGroup } from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setSubmtting] = useState(false);
  const debounceUsername = useDebounceCallback(setUsername, 300);
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const checkUsernameunique = async () => {
      if (username) {
        setCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`,
          );
          console.log(response);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            (axiosError.response?.data.message as string) ??
              "Error checking username",
          );
        } finally {
          setCheckingUsername(false);
        }
      }
    };
    checkUsernameunique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setSubmtting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success("sign in successfully", {
        description: "now please verfiy account with email",
      });
      router.replace(`/verfiy/${username}`);
      setSubmtting(false);
    } catch (error) {
      console.log("error in signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        "Something went wrong. Please try again.";
      toast.error("signup failed", { description: errorMessage });
      setSubmtting(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-lg border p-8"
        >
          <h1 className="text-4xl font-bold">Join to sent Mestry Message...</h1>
          <h1 className="text-2xl font-bold">Create account</h1>

          {/* USERNAME */}

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="john_doe"
                  autoComplete="off"
                  onChange={(e) => {
                    field.onChange(e);
                    debounceUsername(e.target.value);
                  }}
                />
                {isCheckingUsername && (
                  <FieldDescription>Checking username...</FieldDescription>
                )}
                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      isCheckingUsername ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Sign up"}
          </Button>
        </form>
      </div>
    </>
  );
}

export default Signup;
