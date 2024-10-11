import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SERVER_URL = 'http://localhost:4000';
export const CLIENT_URL = 'http://localhost:3000';
