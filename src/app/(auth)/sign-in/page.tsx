"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
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
function Signin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setSubmtting] = useState(false);
  const debounceUsername = useDebounceValue(username, 300);
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
      if (debounceUsername) {
        setCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debounceUsername}`,
          );
          console.log(response);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            (axiosError.response?.data.message as string) ??
              "Error checking username",
          );
        }
      }
    };
    checkUsernameunique();
  }, [debounceUsername]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setSubmtting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast("sign in successfully", {
        description: "now please verfiy account with email",
      });
      router.replace(`/verfiy-code/${username}`);
      setSubmtting(false);
    } catch (error) {
      console.log("error in signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast("signup failed", { description: errorMessage });
      setSubmtting(false);
    }
  };
  return (
    // <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //   <div className="w-full max-w-md p-8 space-y-d bg-white rounded-lg shadow-md">
    //     <div className="text-center">
    //       <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
    //         Join Mystery Message
    //       </h1>
    //       <p className="mb-4">Sign up to start your anonymous adventure</p>
    //     </div>
    //     <Controller
    //       name="username"
    //       control={form.control}
    //       render={({ field, fieldState }) => (
    //         <Field data-invalid={fieldState.invalid}>
    //           <FieldLabel htmlFor={field.name}>username</FieldLabel>
    //           <Input
    //             {...field}
    //             id={field.name}
    //             aria-invalid={fieldState.invalid}
    //             placeholder="username"
    //             autoComplete="off"
    //           />
    //           <FieldDescription>
    //             Join our application for send mistry messages.
    //           </FieldDescription>
    //           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    //         </Field>
    //       )}
    //     />
    //     //email
    //     <Controller
    //       name="email"
    //       control={form.control}
    //       render={({ field, fieldState }) => (
    //         <Field data-invalid={fieldState.invalid}>
    //           <FieldLabel htmlFor={field.name}>email</FieldLabel>
    //           <Input
    //             {...field}
    //             id={field.name}
    //             aria-invalid={fieldState.invalid}
    //             placeholder="email"
    //             autoComplete="off"
    //           />
    //           <FieldDescription>
    //             Join our application for send mistry messages.
    //           </FieldDescription>
    //           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    //         </Field>
    //       )}
    //     />
    //   </div>
    // </div>
    <>
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-lg border p-8"
        >
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

export default Signin;
