
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] animate-fade-in", 
      className
    )}>
      {Icon && (
        <div className="bg-[var(--bg-tertiary)] p-4 rounded-full mb-4">
          <Icon className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
