"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SendIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import useMintToToken from "@/hooks/useMintToToken";
const formSchema = z.object({
  to: z.string(),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
});

type FormSchemaType = z.infer<typeof formSchema>;

type Props = {
  mintAddress: string;
  trigger?: React.ReactNode;
};

const MintToTokenModal: React.FC<Props> = ({ mintAddress, trigger }) => {
  const { mutateAsync, isPending } = useMintToToken(mintAddress);
  const [open, setOpen] = React.useState(false);
  const { publicKey } = useWallet();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: publicKey?.toBase58() || "",
      amount: 0,
    },
  });
  async function onSubmit(values: FormSchemaType) {
    await mutateAsync({
      to: values.to,
      amount: values.amount,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button>
            <SendIcon className="mr-2" />
            Mint more tokens
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to mint more tokens to this address?
          </DialogTitle>
          <DialogDescription>
            This will mint more tokens to the address you specify. Please ensure
            that you have the correct address and amount before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Receiver address" {...field} />
                    </FormControl>
                    <FormDescription>
                      This address will receive the minted tokens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount of tokens to mint"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the amount of tokens to mint to the address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <SendIcon className="mr-2" />
                )}{" "}
                Mint
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MintToTokenModal;
