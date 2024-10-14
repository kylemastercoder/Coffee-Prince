/* eslint-disable @typescript-eslint/no-unused-vars */
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdminPage = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const admin = await db.admin.findFirst({
    where: {
      id: userId,
    },
  });

  if (!admin) {
    redirect("/admin/sign-in");
  } else {
    redirect("/admin/dashboard");
  }
};

export default AdminPage;
