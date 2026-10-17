"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";

import { verfiySchema } from "@/schema/verfiySchema";
import { ApiResponse } from "@/types/ApiResponse";

import { Field } from "@/components/ui/field";
import { FieldGroup } from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FieldDescription } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
function verifyAccount() {
  const rouetr = useRouter();
  const Params = useParams<{ username: string }>();
  const form = useForm({
    resolver: zodResolver(verfiySchema),
  });

  const onSumbit = async (data: z.infer<typeof verfiySchema>) => {
    try {
      const response = await axios.post(`/api/verfiy-code`, {
        username: Params.username,
        code: data.code,
      });
      toast.success("Success", { description: "response.data.message" });
      rouetr.replace(`/sign-in`);
    } catch (error) {
      console.log("error in signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        "Something went wrong. Please try again.";
      toast.error("sign-in failed", { description: errorMessage });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <h2 className="text-2xl font-extrabold tracking-tighter mb-6">
            Enter vefiaction code sent to your email
          </h2>
        </div>
        <form
          onSubmit={form.handleSubmit(onSumbit)}
          className="w-full max-w-md space-y-6 rounded-lg border p-8"
        >
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>verfication code</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="otp"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit">sumbit</Button>
        </form>
      </div>
    </div>
  );
}

export default verifyAccount;
