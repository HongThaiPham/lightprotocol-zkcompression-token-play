import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import React, { PropsWithChildren } from "react";

const ZoneLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col opacity-90">
      <Header />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center p-8">
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default ZoneLayout;
