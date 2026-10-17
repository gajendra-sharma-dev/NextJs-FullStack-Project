"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { signinSchema } from "@/schema/signIn.sehema";
import { useDebounceCallback } from "usehooks-ts";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ApiResponse } from "@/types/ApiResponse";

import { Field } from "@/components/ui/field";
import { FieldGroup } from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
function Signup() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login failed", {
          description: "Incorrect email or password",
        });
      } else {
        toast.error("error", {
          description: result.error,
        });
      }
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-lg border p-8"
        >
          <h1 className="text-4xl font-bold">Welcome back...</h1>
          <h1 className="text-2xl font-bold">Login account</h1>

          {/* EMAIL */}
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email/Username</FieldLabel>
                <Input
                  {...field}
                  id={field.name}

                  aria-invalid={fieldState.invalid}
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

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </>
  );
}

export default Signup;
