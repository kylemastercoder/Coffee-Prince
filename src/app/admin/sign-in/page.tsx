/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserLoginValidation } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/constants";
import { Loader2 } from "lucide-react";
import CustomFormField from "@/components/globals/custom-formfield";

const AdminSignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof UserLoginValidation>>({
    resolver: zodResolver(UserLoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserLoginValidation>) => {
    if (!isLoaded) return;

    try {
      setIsPending(true);
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      // If sign-in process is complete, set the created session as active and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/admin/dashboard");
        toast.success("Welcome back, Admin!");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(
        error.message || "No user found with the provided credentials."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome Back, Admin!</DialogTitle>
          <DialogDescription>
            Please login your admin account to access the dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <div className="grid gap-2">
              <CustomFormField
                control={form.control}
                name="email"
                placeholder="jdelacruz@gmail.com"
                disabled={isPending}
                isRequired
                label="Email Address"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <div className="grid gap-2">
              <CustomFormField
                control={form.control}
                name="password"
                placeholder="********"
                disabled={isPending}
                isRequired
                type="password"
                label="Password"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <Button disabled={isPending}>
              {isPending && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Continue
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSignIn;
