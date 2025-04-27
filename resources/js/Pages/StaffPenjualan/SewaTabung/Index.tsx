// File: resources/js/Pages/StaffPenjualan/SewaTabung/Index.tsx

import React from "react";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "react-toastify";

interface SewaTabung {
    id: number;
    pelanggan: {
        nama_pelanggan: string;
        alamat: string;
        no_hp: string;
    };
    jumlah_tabung: number;
    total_jaminan: number;
    tgl_sewa: string;
    tgl_kembali?: string;
    status: string;
}

interface Props {
    posts: SewaTabung[];
}

const Index = ({ posts }: Props) => {
    const formatRupiah = (angka: number) =>
        `Rp ${angka.toLocaleString("id-ID")}`;

    const handleKembali = (id: number) => {
        if (confirm("Yakin tabung sudah dikembalikan?")) {
            router.post(
                route("sewa_tabung.kembali", id),
                {},
                {
                    onSuccess: () => toast.success("Status tabung diperbarui."),
                }
            );
        }
    };

    const handleHapus = (id: number) => {
        if (confirm("Yakin ingin menghapus data ini?")) {
            router.delete(route("sewa_tabung.destroy", id), {
                onSuccess: () => toast.success("Data sewa tabung dihapus."),
            });
        }
    };

    return (
        <AdminLayout>
            <div className="px-6 py-4">
                <h1 className="text-2xl font-semibold mb-4">
                    Daftar Sewa Tabung
                </h1>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="w-full table-auto text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Pelanggan</th>
                                <th className="p-3">Jumlah Tabung</th>
                                <th className="p-3">Total Jaminan</th>
                                <th className="p-3">Tanggal Sewa</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((sewa) => (
                                <tr key={sewa.id} className="border-b">
                                    <td className="p-3">
                                        <div className="font-semibold">
                                            {sewa.pelanggan.nama_pelanggan}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {sewa.pelanggan.alamat} -{" "}
                                            {sewa.pelanggan.no_hp}
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">
                                        {sewa.jumlah_tabung}
                                    </td>
                                    <td className="p-3 text-center">
                                        {formatRupiah(sewa.total_jaminan)}
                                    </td>
                                    <td className="p-3 text-center">
                                        {format(
                                            new Date(sewa.tgl_sewa),
                                            "dd MMM yyyy"
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        {sewa.status}
                                    </td>
                                    <td className="p-3 flex gap-2 justify-center">
                                        {sewa.status === "Disewa" && (
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    handleKembali(sewa.id)
                                                }
                                            >
                                                Konfirmasi Kembali
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleHapus(sewa.id)}
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
