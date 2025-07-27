import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function strLimit(value: string, limit: number, end = "...") {
    return value.length > limit ? value.substring(0, limit) + end : value;
}

export function getFirstWord(value: string) {
    return value.split(" ")[0];
}

export function formatTanggalIndonesia(tanggal: string | Date) {
    // console.log("formatTanggalIndonesia menerima:", tanggal);
    return formatInTimeZone(tanggal, 'Asia/Jakarta', "dd MMMM yyyy HH:mm", { locale: id });
}

export function formatTanggalIndonesiaTok(tanggal: string | Date) {
    // console.log("formatTanggalIndonesia menerima:", tanggal);
    return formatInTimeZone(tanggal, 'Asia/Jakarta', "dd MMMM yyyy", { locale: id });
}

export function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}
