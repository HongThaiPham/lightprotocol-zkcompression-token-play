import React, { PropsWithChildren } from "react";

const ZoneLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center p-8">
      {children}
    </div>
  );
};

export default ZoneLayout;
