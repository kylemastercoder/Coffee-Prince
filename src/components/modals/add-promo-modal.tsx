"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "../globals/modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createPromos } from "@/actions/promos";
import { toast } from "sonner";

const AddPromoModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for form inputs
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [offSale, setOffSale] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createPromos({ name, code, description, offSale });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        setShowModal(false);

        setName("");
        setCode("");
        setDescription("");
        setOffSale("");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Promo"
        description="Add a new promo code for your customers."
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                placeholder="Enter Promo Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Code</Label>
              <Input
                placeholder="Enter Promo Code (e.g., COFFEE2024)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Enter Promo Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Off Sale (%)</Label>
              <Input
                placeholder="Enter Off Sale (e.g., 30)"
                value={offSale}
                onChange={(e) => setOffSale(e.target.value)}
                required
              />
            </div>
          </div>
          <Button className="mt-3 w-full" type="submit" disabled={loading}>
            {loading ? "Adding Promo..." : "Add Promo"}
          </Button>
        </form>
      </Modal>
      <Button size="sm" onClick={() => setShowModal(true)}>
        + Add Promo
      </Button>
    </>
  );
};

export default AddPromoModal;
