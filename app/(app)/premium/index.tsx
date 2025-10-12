import React from "react";
import { StripeContextProvider } from "@/context/StripeContext";
import PaymentScreen from "@/components/payment/PaymentScreen";

export default function PremiumScreen() {
  return (
    <StripeContextProvider>
      <PaymentScreen />
    </StripeContextProvider>
  );
}
