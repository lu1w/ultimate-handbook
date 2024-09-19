/** This file is set up for using shadcn components */
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export { cn };
