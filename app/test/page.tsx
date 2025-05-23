"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  createChargeLinkAction,
  createPayLinkAction,
} from "../_actions/helio.action";

const TestPage = () => {
  const handleCreatePayLink = async () => {
    const link = await createPayLinkAction();
    console.log("HELIO API result", link);
  };
  const handleCreateChargeLink = async () => {
    const link = await createChargeLinkAction();
    console.log("HELIO API result", link);
  };
  return (
    <div>
      TestPage
      <Button onClick={handleCreatePayLink}>Create paylink</Button>
      <Button onClick={handleCreateChargeLink}>Create paylink</Button>
    </div>
  );
};

export default TestPage;
