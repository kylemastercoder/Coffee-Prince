"use server";

import db from "@/lib/db";
import { ContactValidation } from "@/lib/validators";
import { z } from "zod";

export const createMessage = async (
  values: z.infer<typeof ContactValidation>
) => {
  const validatedField = ContactValidation.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, message } = validatedField.data;

  try {
    const messages = await db.message.create({
      data: {
        name,
        email,
        message,
      },
    });
    return { success: "Message sent successfully", messages };
  } catch (error: any) {
    return {
      error: `Failed to send message. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteMessage = async (messageId: string) => {
    if (!messageId) {
      return { error: "Message ID is required" };
    }
  
    try {
      const message = await db.message.delete({
        where: {
          id: messageId,
        },
      });
  
      return { success: "Message deleted successfully", message };
    } catch (error: any) {
      return {
        error: `Failed to delete message. Please try again. ${error.message || ""}`,
      };
    }
  };
