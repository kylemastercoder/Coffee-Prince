import { z } from "zod";

export const MenuFormValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  stocks: z.coerce.number().min(1, { message: "Stocks is required" }),
  featured: z.string().min(1, { message: "Featured is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  flavors: z
    .array(z.string().min(1, { message: "Please provide at least one flavor" }))
    .min(1, { message: "Flavor is required" }),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Variant Name is required" }),
        price: z.coerce.number().min(1, { message: "Price is required" }),
      })
    )
    .nonempty({ message: "At least one variant is required" }),
});

export const CheckoutFormValidation = z.object({
  address: z.string().min(1, { message: "Address is required" }),
  municipality: z.string().min(1, { message: "Municipality is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  barangay: z.string().min(1, { message: "Barangay is required" }),
  region: z.string().min(1, { message: "Region is required" }),
  contactNumber: z.string().min(1, { message: "Contact Number is required" }),
  proofOfPayment: z.string().optional(),
});
