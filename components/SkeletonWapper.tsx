import React, { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Loader2Icon } from "lucide-react";

type Props = {
  isLoading: boolean;
  fullWidth?: boolean;
} & PropsWithChildren;

const SkeletonWapper: React.FC<Props> = ({
  children,
  isLoading,
  fullWidth = true,
}) => {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full", "relative")}>
      <div className="absolute inset-0 flex flex-col h-full w-full items-center justify-center space-y-3">
        <Loader2Icon className="animate-spin stroke-orange-500 size-14" />
        <div className="bg-gradient-to-r from-blue-700 via-slate-500 to-orange-600 bg-clip-text text-transparent">
          <p className="text-md font-semibold text-center">
            Payment is being processed, please wait.... <br />
            Don&apos;t close the window or refresh the page.
          </p>
        </div>
      </div>
      <div className="opacity-10 relative flex h-full w-full items-center justify-center">
        {children}
      </div>
    </Skeleton>
  );
};

export default SkeletonWapper;
