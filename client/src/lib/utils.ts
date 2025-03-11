import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format as dateFnsFormat } from "date-fns"
import { ru } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Russian currency (rubles)
 * @param amount - The amount to format
 * @returns Formatted amount with ruble symbol (e.g., "1 500,00 ₽")
 */
export function formatRubles(amount: number | string): string {
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format number with Russian style: space as thousands separator and comma as decimal separator
  return numAmount.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    currencyDisplay: 'symbol'
  }).replace('RUB', '₽'); // Replace the currency code with the symbol
}

/**
 * Format a date in Russian format (DD.MM.YYYY)
 * @param date - The date to format
 * @returns Formatted date string (e.g., "31.12.2023")
 */
export function formatRussianDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
    
  return dateFnsFormat(dateObj, 'dd.MM.yyyy', { locale: ru });
}

/**
 * Format a datetime in Russian format with time (DD.MM.YYYY HH:mm)
 * @param date - The date to format
 * @returns Formatted datetime string (e.g., "31.12.2023 14:30")
 */
export function formatRussianDateTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
    
  return dateFnsFormat(dateObj, 'dd.MM.yyyy HH:mm', { locale: ru });
}
