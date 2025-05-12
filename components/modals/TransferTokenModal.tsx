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
import useTransferToken from "@/hooks/useTransferToken";
const formSchema = z.object({
  to: z.string(),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
});

type FormSchemaType = z.infer<typeof formSchema>;

type Props = {
  mintAddress: string;
  trigger?: React.ReactNode;
};

const TransferTokenModal: React.FC<Props> = ({ mintAddress, trigger }) => {
  const { mutateAsync, isPending } = useTransferToken(mintAddress);
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
            Transfer Tokens
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to transfer tokens to this address?
          </DialogTitle>
          <DialogDescription>
            This action will transfer the specified amount of tokens to the
            address you provide. Please ensure that the address is correct.
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
                        placeholder="Amount of tokens to transfer"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the amount of tokens to transfer to the address.
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
                Transfer
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferTokenModal;
