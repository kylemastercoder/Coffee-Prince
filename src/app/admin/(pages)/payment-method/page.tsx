import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentMethodModal from "@/components/modals/payment-method-modal";
import db from "@/lib/db";

const PaymentMethod = async () => {
    const paymentMethod = await db.paymentMethod.findMany({});
  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-5">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment method and view what&apos;s customer wants.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentMethodModal data={paymentMethod} />
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentMethod;
