import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `inline-flex 
          h-10 w-full
          text-sm 
          shadow-sm 
          rounded-md border border-white
          px-3 py-1 
          bg-transparent 
          transition-colors 
          file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground 
          placeholder:text-search-muted 
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
          disabled:cursor-not-allowed disabled:opacity-50`,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
