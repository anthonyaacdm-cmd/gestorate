
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ className, size = 24 }) => {
  return (
    <Loader2 
      className={cn("animate-spin-smooth text-[var(--primary-color)]", className)} 
      size={size} 
    />
  );
};

export default LoadingSpinner;
