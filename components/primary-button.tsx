import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import React from "react";

interface PrimaryButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const PrimaryButton = ({
  className,
  children,
  ...props
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      className={cn("bg-primary w-fit p-4 rounded-full", className)}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};
