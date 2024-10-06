import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import { format } from "date-fns";
import MessageClient from "./_components/client";
import { MessageColumn } from "./_components/column";

const AdminMessage = async () => {
  const messages = await db.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedMessages: MessageColumn[] = messages.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      email: item.email,
      message: item.message,
    };
  });

  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
      <Card className="border-0">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Manage your message and view what's customer wants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MessageClient data={formattedMessages} />
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminMessage;
