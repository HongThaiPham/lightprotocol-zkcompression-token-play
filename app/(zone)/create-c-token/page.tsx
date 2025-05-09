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
        <CardTitle>Create CToken using Token 2022</CardTitle>
        <CardDescription>
          This page is for creating a new CToken using the Token 2022 contract.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateCTokenForm />
      </CardContent>
    </Card>
  );
};

export default CreateCTokenPage;
