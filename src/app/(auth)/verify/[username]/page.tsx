"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/Schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const verifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      await axios.post("/api/verify-code", {
        username: param.username,
        code: data.code,
      });
      toast("Sucess");
      router.replace(`sign-in`);
    } catch (error) {}
  };
  return (
    <div
      className="flex justify-center items-center
  min-h-screen bg-gray-100"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your Account
          </h1>
          <p className="mb-4">
            Enter the vverification code sent to your email
          </p>
        </div>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Code</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="OTP code"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal">
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
};

export default verifyAccount;
