import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cn } from "@/lib/utils";
import React from "react";

interface SecondaryButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const SecondaryButton = ({
  className,
  children,
  ...props
}: SecondaryButtonProps) => {
  return (
    <TouchableOpacity
      className={cn("border border-primary/10 w-fit p-4 rounded-lg", className)}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
