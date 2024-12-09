"use server";

import { CartItem } from "@/actions/orders";
import { NotifyEmailHTML } from "@/components/globals/thankyou-email";
import nodemailer from "nodemailer";

export const sendReceiptEmail = async (
  name: string,
  email: string,
  orderDate: string,
  orderNumber: string,
  items: CartItem[],
  totalPrice: number
) => {
  const htmlContent = await NotifyEmailHTML({
    name,
    orderNumber,
    orderDate,
    items,
    totalPrice,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kylemastercoder14@gmail.com",
      pass: "ssslhdkdxbqulvdt",
    },
  });

  const message = {
    from: "kylemastercoder14@gmail.com",
    to: email,
    subject: "Coffee Prince",
    text: `Coffee Prince - Order Receipt`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    return { success: true };
  } catch (error) {
    console.error("Error sending notification", error);
    return { message: "An error occurred. Please try again." };
  }
};
