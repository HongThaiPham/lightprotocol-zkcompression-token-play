import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CreateCTokenForm from "./CreateCTokenForm";

const CreateCTokenPage = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create cToken using Token 2022</CardTitle>
        <CardDescription>
          This page is for creating a new CToken using the Token 2022 standard.
          You can specify the token name, symbol, and additional metadata. The
          cToken will be created using the Light Protocol library, which
          provides a simple and efficient way to create and manage compressed
          tokens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateCTokenForm />
      </CardContent>
    </Card>
  );
};

export default CreateCTokenPage;
