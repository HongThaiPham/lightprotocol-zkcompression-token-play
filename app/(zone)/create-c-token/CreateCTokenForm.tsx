"use client";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import useCreateMint from "@/hooks/useCreateMint";

const formSchema = z.object({
  name: z.string().min(5, "Name is required"),
  symbol: z.string().min(3, "Symbol is required"),
  uri: z.string().url("URI must be a valid URL"),
  decimals: z.coerce
    .number()
    .min(0, "Decimals must be a positive number")
    .max(18, "Decimals must be less than or equal to 18"),
  additionalMetadata: z
    .array(
      z.object({
        trait_type: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(
            10,
            `The maximum allowed length for this field is 10 characters`
          ),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(
            32,
            `The maximum allowed length for this field is 32 characters`
          ),
      })
    )
    .optional(),
  initialSupply: z.coerce
    .number()
    .min(1, "Initial supply must be a positive number"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateCTokenForm = () => {
  const { mutate, isPending } = useCreateMint();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      uri: "",
      decimals: 6,
      initialSupply: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalMetadata",
  });

  function onSubmit(values: FormSchemaType) {
    mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-2xl shadow-card bg-white flex flex-col gap-5 p-5 mb-5">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input token name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the token. It will be used to identify
                    the token in the system.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="Input token symbol" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the symbol of the token. It will be used to identify
                    the token in the system.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Input token decimals"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the number of decimal places for the token.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uri"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Token URI</FormLabel>
                  <FormControl>
                    <Input placeholder="Input token URI" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the URI of the token. It will be used to identify
                    the token in the system.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Supply</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Input token initial supply"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the initial supply of the token.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {fields.map((field, index) => (
            <div className="flex w-full items-center gap-6" key={field.id}>
              <FormField
                control={form.control}
                name={`additionalMetadata.${index}.trait_type`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Trait type</FormLabel>
                    <FormControl>
                      <Input placeholder="Trait type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`additionalMetadata.${index}.value`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Trait value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size={"icon"}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  remove(index);
                }}
                className="shrink-0 self-end"
              >
                <TrashIcon />
              </Button>
            </div>
          ))}

          <Button
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              append({ trait_type: "", value: "" });
            }}
            className="self-start"
          >
            <PlusIcon />
            Add attributes
          </Button>
          <div className="flex items-center justify-end space-x-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                <CheckIcon />
              )}
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateCTokenForm;
