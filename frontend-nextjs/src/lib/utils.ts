import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SERVER_URL = 'https://unimelb-course-planner-57f483cf5eff.herokuapp.com';
export const CLIENT_URL = 'http://localhost:3000';
