"use client";

import BreadcrumbBanner from "@/components/globals/breadcrumb-banner";
import Navbar from "@/components/globals/landing-page/navbar";
import React, { useState } from "react";
import Link from "next/link";
import useCart from "@/hooks/use-cart";
import Image from "next/image";
import { Circle, ImageIcon, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled } from "@tabler/icons-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckoutFormValidation } from "@/lib/validators";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAddressData } from "@/lib/address-selection";
import { Button } from "@/components/ui/button";
import { placeOrder } from "@/actions/orders";
import { useUser } from "@clerk/nextjs";

const Checkout = () => {
  const cart = useCart();
  const router = useRouter();
  const { user } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Gcash");
  const handleSelectPaymentMethod = (name: string) => {
    setSelectedPaymentMethod(name);
  };

  const form = useForm<z.infer<typeof CheckoutFormValidation>>({
    resolver: zodResolver(CheckoutFormValidation),
    defaultValues: {
      contactNumber: "",
      address: "",
      region: "",
      province: "",
      municipality: "",
      barangay: "",
      proofOfPayment: "",
    },
  });

  const pricePerMenu = cart.items.map((item) => item.price * item.quantity);

  const totalPrice = pricePerMenu.reduce((total, price) => total + price, 0);

  const totalQuantity = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const onSubmit = async (values: z.infer<typeof CheckoutFormValidation>) => {
    setIsPending(true);
    try {
      const response = await placeOrder(
        values,
        selectedPaymentMethod,
        cart.items,
        user?.fullName as string
      );
      if (response?.error) {
        toast.error(response.message);
      } else {
        cart.removeAll();
        toast.success(response.success);
        router.push(`/thank-you?orderId=${response?.orderId}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`An unexpected error occurred: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsPending(false);
    }
  };

  const selectedRegionName = form.watch("region");
  const selectedProvinceName = form.watch("province");
  const selectedMunicipalityName = form.watch("municipality");

  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(
    selectedRegionName,
    selectedProvinceName,
    selectedMunicipalityName
  );

  return (
    <>
      <Navbar />
      <BreadcrumbBanner image="bg1.jpg" title="Checkout" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row py-14 lg:px-52 md:px-20 px-10"
        >
          <div className="w-full md:w-1/2 pr-6">
            <Link href="/cart" className="text-gray-200 hover:underline">
              &larr; Back to cart
            </Link>
            <h2 className="text-lg mt-5 font-bold">
              Product Information & Review
            </h2>
            <p className="text-sm text-muted-foreground">
              By placing your order, you agree to Coffee Prince&apos;s{" "}
              <Link
                href="#"
                className="text-orange-600 font-semibold underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            {cart.items.length === 0 && (
              <p className="text-muted-foreground font-semibold">
                No items added to cart
              </p>
            )}
            <div>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="mt-4 border gap-x-3 flex items-start p-4 rounded-md shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="relative h-24 w-24">
                      {item.image ? (
                        <Image
                          fill
                          src={item.image}
                          alt="Product Image"
                          className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-secondary">
                          <ImageIcon
                            aria-hidden="true"
                            className="h-4 w-4 text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <h3 className="font-medium">
                      {item.name} - {formatPrice(item.price * item.quantity)}
                    </h3>
                    <div>
                      <Badge variant="secondary">{item.flavor}</Badge>
                      <Badge variant="outline" className="ml-2">
                        {item.variant}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-5">
              Payments are secured and encrypted.
            </p>
            <div className="space-y-1.5 text-sm mt-3">
              <div className="flex">
                <span className="flex-1">Total Item/s</span>
                <span>{totalQuantity} pc/s</span>
              </div>
              <div className="flex">
                <span className="flex-1">Total Payment</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold text-lg mb-2">Scan To Pay</p>
              <Image src="/images/qr.png" alt="QR" width={300} height={300} />
            </div>
          </div>
          <div className="w-full md:w-1/2 pl-6 border-l border-border">
            <h2 className="text-lg font-semibold">Payment Details</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Complete your purchase by providing your details.
            </p>
            <div className="space-y-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="contactNumber"
                label="Contact Number"
                isRequired
                disabled={isPending}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="address"
                label="House/Unit/Block No., Street, Subdivision/Village"
                placeholder="1234 Coffee St."
                isRequired
                disabled={isPending}
              />
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  name="region"
                  label="Region"
                  placeholder="Select Region"
                  options={regionOptions}
                  isRequired
                  disabled={isPending}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  name="province"
                  label="Province"
                  placeholder="Select Province"
                  options={provinceOptions}
                  isRequired
                  disabled={isPending || !selectedRegionName}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  name="municipality"
                  label="Municipality"
                  placeholder="Select Municipality"
                  options={municipalityOptions}
                  isRequired
                  disabled={isPending || !selectedProvinceName}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  name="barangay"
                  label="Barangay"
                  placeholder="Select Barangay"
                  options={barangayOptions}
                  isRequired
                  disabled={isPending || !selectedMunicipalityName}
                />
              </div>
              <div className="flex items-center gap-x-2">
                <label
                  className={`${
                    selectedPaymentMethod === "Gcash"
                      ? "cursor-pointer"
                      : "cursor-default"
                  } w-full`}
                >
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="payment_method"
                    onChange={() => handleSelectPaymentMethod("Gcash")}
                    checked={selectedPaymentMethod === "Gcash"}
                    disabled={isPending}
                  />
                  <div
                    className={`w-full rounded-md p-3 transition-all shadow-md border ${
                      selectedPaymentMethod === "Gcash"
                        ? "border-orange-600"
                        : "border-input"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                          {selectedPaymentMethod === "Gcash" ? (
                            <IconCircleCheckFilled className="text-orange-600" />
                          ) : (
                            <Circle />
                          )}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-x-2">
                              <p className="font-semibold">Gcash</p>
                              <Badge variant="success">Recommended</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                <label
                  className={`${
                    selectedPaymentMethod === "Maya"
                      ? "cursor-pointer"
                      : "cursor-default"
                  } w-full`}
                >
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="payment_method"
                    onChange={() => handleSelectPaymentMethod("Maya")}
                    checked={selectedPaymentMethod === "Maya"}
                    disabled={isPending}
                  />
                  <div
                    className={`w-full rounded-md p-3 transition-all shadow-md border ${
                      selectedPaymentMethod === "Maya"
                        ? "border-orange-600"
                        : "border-input"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                          {selectedPaymentMethod === "Maya" ? (
                            <IconCircleCheckFilled className="text-orange-600" />
                          ) : (
                            <Circle />
                          )}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-x-2">
                              <p className="font-semibold">Maya</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                <label
                  className={`${
                    selectedPaymentMethod === "COD"
                      ? "cursor-pointer"
                      : "cursor-default"
                  } w-full`}
                >
                  <input
                    type="radio"
                    className="peer sr-only"
                    name="payment_method"
                    onChange={() => handleSelectPaymentMethod("COD")}
                    checked={selectedPaymentMethod === "COD"}
                    disabled={isPending}
                  />
                  <div
                    className={`w-full rounded-md p-3 transition-all shadow-md border ${
                      selectedPaymentMethod === "COD"
                        ? "border-orange-600"
                        : "border-input"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                          {selectedPaymentMethod === "COD" ? (
                            <IconCircleCheckFilled className="text-orange-600" />
                          ) : (
                            <Circle />
                          )}
                          <div className="flex flex-col">
                            <div className="flex items-center gap-x-2">
                              <p className="font-semibold">Cash On Delivery</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DROP_ZONE}
                name="proofOfPayment"
                label="Proof of Payment (For Gcash and Maya)"
                isRequired={false}
                disabled={isPending}
              />
              <Button disabled={isPending} className="w-full mt-3">
                {isPending && <Loader2 className="animate-spin mr-2" />}
                Pay {formatPrice(totalPrice)} &rarr;
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Checkout;
