"use client";
import React from "react";
import { useLightProtocol } from "./providers/LightProtocolProvider";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

const CreateMintButton = () => {
  const { createMint } = useLightProtocol();
  const { mutate, isPending } = useMutation({
    mutationKey: ["createMint"],
    mutationFn: () =>
      createMint({
        decimals: 9,
      }),
  });
  const handleClick = async () => {
    mutate();
  };
  return (
    <div>
      CreateMintButton
      <Button onClick={handleClick}>
        {isPending ? <Loader2Icon className="animate-spin mr-2" /> : null}
        Create Token mint
      </Button>
    </div>
  );
};

export default CreateMintButton;
