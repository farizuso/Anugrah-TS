// import { Produk } from '@/types';
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Todo{
    id: number;
    name: string;
}
export interface TodoWithMethod extends Todo {
    _method: string;
}

export interface Produk{
    id: number;
    no_botol: string;
    nama_produk: string;
    simbol: string;
    harga: string;
    stok: string;
    deskripsi: string;
}

export interface Pelanggan{
    id: number;
    nama_pelanggan: string;
    alamat: string;
    no_hp: string;
}
export interface Stok {
    id: number;
    produk: Produk; 
    lokasi_penyimpanan: string;
    jumlah_stok: number;
    minimum_stok: number;
    tgl_update_stok: Date;
}



export interface Rekap{
    id: number;
    tgl_keluar: Date;
    tgl_kembali: Date;
    tgl_masuk_pabrik: Date;
    keterangan: string;
    produk : Produk
    pelanggan : Pelanggan
}


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash: {
        success: string;
        error: string;
    };
    produks : Produk[]
    pelanggans : Pelanggan[]
};

export interface DebouncedWindowSizeOptions {
    initialWidth?: number
    initialHeight?: number
    wait?: number
    leading?: boolean
  }
  export declare const useWindowSize: (
    options?: DebouncedWindowSizeOptions
  ) => readonly [number, number]
  export declare const useWindowHeight: (
    options?: Omit<DebouncedWindowSizeOptions, 'initialWidth'>
  ) => number
  export declare const useWindowWidth: (
    options?: Omit<DebouncedWindowSizeOptions, 'initialHeight'>
  ) => number
  
