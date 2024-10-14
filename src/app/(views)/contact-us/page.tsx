"use client";

import BreadcrumbBanner from "@/components/globals/breadcrumb-banner";
import CustomFormField from "@/components/globals/custom-formfield";
import Navbar from "@/components/globals/landing-page/navbar";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContactValidation } from "@/lib/validators";
import { FormFieldType } from "@/constants";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createMessage } from "@/actions/contact";
import { useRouter } from "next/navigation";

const ContactUs = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ContactValidation>>({
    resolver: zodResolver(ContactValidation),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ContactValidation>) => {
    setIsPending(true);
    try {
      const response = await createMessage(values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <Navbar />
      <BreadcrumbBanner image="feature2.jpg" title="Contact Us" />
      <div className="grid grid-cols-5 gap-10 py-10 px-56">
        <div className="col-span-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.715796912353!2d120.93185297587118!3d14.327933983692581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d5001fbfa4bf%3A0xb4d57199ea2d4946!2sCOFFEE%20PRINCE!5e0!3m2!1sen!2sph!4v1728205073300!5m2!1sen!2sph"
            width="100%"
            height="400"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="col-span-2">
          <p className="text-3xl font-bold">
            We want to help in any way we can.
          </p>
          <p className="text-sm text-muted-foreground">
            We&apos;ve answered the most commonly asked questions.
          </p>
          <Form {...form}>
            <form
              className="space-y-3 mt-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Name"
                  placeholder="Enter your name"
                  name="name"
                  isRequired
                  disabled={isPending}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Email Address"
                  placeholder="Enter your email"
                  name="email"
                  isRequired
                  type="email"
                  disabled={isPending}
                />
              </div>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Message"
                placeholder="Enter your message..."
                name="message"
                isRequired
                disabled={isPending}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Send Message
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
