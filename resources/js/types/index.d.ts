import { id } from "date-fns/locale";
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string;
}

export interface Todo {
    id: number;
    name: string;
}
export interface TodoWithMethod extends Todo {
    _method: string;
}

export interface LaporanPembelian {
    id: number;
    tgl_pembelian: Date;
    supplier: Supplier;
    total: number;
    keterangan: string;
    details: {
        id: number;
        harga: number;
        quantity: number;
        produk: {
            id: number;
            nama_produk: string;
        };
    }[];
}

export interface Supplier {
    id: number;
    nama_supplier: string;
    alamat: string;
    no_telp: number;
}

export interface Pesanan {
    id: number;
    tgl_pesanan: Date;
    pelanggan: Pelanggan;
    produk: Produk;
    quantity: number;
    total: number;
    status_pesanan: string;
}

export interface Pembayaran {
    id: number;
    pesanan: Pesanan;
    metode_pembayaran: string;
    jumlah_dibayar: number;
    status_pembayaran: string;
}

export interface Produk {
    id: number;
    nama_produk: string;
    simbol: string;
    jenis: string;
    harga_jual: number;
    stok: string;
}

export interface Pelanggan {
    id: number;
    nama_pelanggan: string;
    alamat: string;
    no_hp: string;
}

export interface Rekap {
    id: number;
    tgl_keluar: Date;
    tgl_kembali: Date;
    tgl_masuk_pabrik: Date;
    keterangan: string;
    produk: Produk;
    pelanggan: Pelanggan;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string;
        error: string;
    };
    produks: Produk[];
    pelanggans: Pelanggan[];
    LaporanPembelian: LaporanPembelian[];
};

export interface DebouncedWindowSizeOptions {
    initialWidth?: number;
    initialHeight?: number;
    wait?: number;
    leading?: boolean;
}
export declare const useWindowSize: (
    options?: DebouncedWindowSizeOptions
) => readonly [number, number];
export declare const useWindowHeight: (
    options?: Omit<DebouncedWindowSizeOptions, "initialWidth">
) => number;
export declare const useWindowWidth: (
    options?: Omit<DebouncedWindowSizeOptions, "initialHeight">
) => number;
