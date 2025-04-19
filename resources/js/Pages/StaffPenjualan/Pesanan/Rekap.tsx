import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PageProps, Pesanan } from "@/types";
import { usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

interface RekapProps {
    rekap: Pesanan[];
}

const Rekap = ({ rekap }: RekapProps) => {
    const auth = usePage<PageProps>().props.auth;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const totalPenjualan = rekap.reduce(
        (sum, pesanan) => sum + pesanan.total,
        0
    );
    const totalTerbayar = rekap.reduce(
        (sum, pesanan) => sum + pesanan.jumlah_terbayar,
        0
    );

    const formatRupiah = (angka: number) =>
        `Rp ${angka.toLocaleString("id-ID")}`;

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Rekap Laporan Penjualan</h1>

            {/* FILTER */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <Label>Dari Tanggal</Label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <Label>Sampai Tanggal</Label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <a
                    href={route("staffpenjualan.rekap.penjualan", {
                        start_date: startDate,
                        end_date: endDate,
                    })}
                    className="self-end bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    Filter
                </a>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2">Tanggal</th>
                            <th className="border px-3 py-2">No Pesanan</th>
                            <th className="border px-3 py-2">Pelanggan</th>
                            <th className="border px-3 py-2">Total</th>
                            <th className="border px-3 py-2">Dibayar</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Pembayaran</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rekap.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-3 py-2">
                                    {format(
                                        new Date(item.tgl_pesanan),
                                        "dd-MM-yyyy"
                                    )}
                                </td>
                                <td className="border px-3 py-2">#{item.id}</td>
                                <td className="border px-3 py-2">
                                    {item.pelanggan?.nama_pelanggan}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                    {formatRupiah(item.total)}
                                </td>
                                <td className="border px-3 py-2 text-right">
                                    {formatRupiah(item.jumlah_terbayar)}
                                </td>
                                <td className="border px-3 py-2 text-center capitalize">
                                    {item.status}
                                </td>
                                <td className="border px-3 py-2 text-center capitalize">
                                    {item.keterangan}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-100 font-semibold">
                        <tr>
                            <td
                                className="border px-3 py-2 text-right"
                                colSpan={3}
                            >
                                TOTAL
                            </td>
                            <td className="border px-3 py-2 text-right text-blue-700">
                                {formatRupiah(totalPenjualan)}
                            </td>
                            <td className="border px-3 py-2 text-right text-green-700">
                                {formatRupiah(totalTerbayar)}
                            </td>
                            <td className="border px-3 py-2" colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </AdminLayout>
    );
};

export default Rekap;
