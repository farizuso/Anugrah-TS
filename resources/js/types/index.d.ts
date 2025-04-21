import { id } from "date-fns/locale";

export interface Auth {
    auth: {
        user?: User | null; // optional untuk safety
    };
    flash: {
        success?: string;
        error?: string;
    };
}

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
    status: string;
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

export interface Pembayaran {
    id: number;
    pesanan_id: number;
    jumlah_bayar: number;
    bukti_transfer?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Pesanan {
    id: number;
    tgl_pesanan: Date;
    pelanggan: Pelanggan;
    total: number;
    is_lunas: boolean;
    keterangan: string;
    metode_pembayaran: string;
    status: string;
    jumlah_terbayar: number;
    details: {
        id: number;
        harga: number;
        quantity: number;
        produk: {
            id: number;
            nama_produk: string;
        };
    }[];
    riwayat_pembayaran: Pembayaran[]; // ✅ updated: required field
}

export interface Stok {
    id: number;
    produk_id: number;
    jumlah_stok: number;
}

export interface Produk {
    id: number;
    nama_produk: string;
    simbol: string;
    jenis: string;
    harga_jual: number;
    stok?: Stok | null; // tambahkan ini
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
