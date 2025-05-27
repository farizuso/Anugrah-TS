import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function strLimit(value: string, limit: number, end = '...') {
    return value.length > limit ? value.substring(0, limit) + end : value;
}

export function getFirstWord(value: string) {
    return value.split(' ')[0];
}

export function formatTanggalIndonesia(dateString: string) {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale: id });
}
