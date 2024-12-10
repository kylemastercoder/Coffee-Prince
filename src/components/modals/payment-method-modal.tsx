"use client";

import { PaymentMethod } from "@prisma/client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ImageUpload from "../globals/image-uploader";
import {
  createPaymentMethod,
  updatePaymentMethod,
} from "@/actions/payment-method";
import { toast } from "sonner";

const PaymentMethodModal = ({ data }: { data: PaymentMethod[] }) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(data[0]?.name || "");
  const [image, setImage] = useState(data[0]?.image || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (data.length) {
        const response = await updatePaymentMethod({ name, image }, data[0].id);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success(response.success);
          window.location.reload();
        }
      } else {
        const response = await createPaymentMethod({ name, image });
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success(response.success);
          window.location.reload();
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Gcash Name (optional)</Label>
            <Input
              placeholder="Enter Gcash Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>QR Code Image</Label>
            <ImageUpload
              defaultValue={image}
              onImageUpload={(url) => setImage(url)}
            />
          </div>
        </div>
        <Button className="mt-3 w-full" type="submit" disabled={loading}>
          {data.length ? "Update Payment Method" : "Add Payment Method"}
        </Button>
      </form>
    </>
  );
};

export default PaymentMethodModal;
