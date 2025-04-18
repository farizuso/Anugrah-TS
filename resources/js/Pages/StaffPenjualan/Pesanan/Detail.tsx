import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { FaEye } from "react-icons/fa";
import { Pesanan } from "@/types";
import ConfirmPembayaran from "@/Components/ConfirmPembayaran";
import { format } from "date-fns";
import { Label } from "@/Components/ui/label";
import { router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

interface DetailProps {
    pesanan: Pesanan;
}

const Detail = ({ pesanan }: DetailProps) => {
    const [open, setOpen] = useState(false);

    const handleUpdatePembayaran = (metode: string) => {
        if (confirm("Yakin ingin mengubah metode pembayaran?")) {
            router.post(
                route(
                    "staffpenjualan.pesanan.update_pembayaran",
                    pesanan.id
                ),
                { metode_pembayaran: metode },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        console.log("Metode pembayaran diperbarui");
                    },
                }
            );
        }
    };

    const formatRupiah = (angka: number) =>
        `Rp ${angka.toLocaleString("id-ID")}`;

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="bg-blue-700 text-white px-6 py-4 rounded-t-md">
                <h2 className="text-2xl font-semibold">Detail Transaksi</h2>
                <p className="text-sm mt-1">
                    Detail transaksi # {pesanan.id}
                </p>
            </div>

            <div className="p-6 space-y-6">
                {/* INFO 2 KOLOM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold mb-1">
                            Informasi Pemesanan
                        </p>
                        <p>
                            tanggal pesanan:{" "}
                            <strong>
                                {format(
                                    new Date(pesanan.tgl_pesanan),
                                    "dd MMM yyyy"
                                )}
                            </strong>
                        </p>
                        <p>
                            metode pembayaran:{" "}
                            <strong>
                                {pesanan.metode_pembayaran || "-"}
                            </strong>
                        </p>
                        <p>
                            status pembayaran:{" "}
                            <strong className="capitalize">
                                {pesanan.keterangan}
                            </strong>
                        </p>
                        <p>
                            status pengiriman:{" "}
                            <strong className="capitalize">
                                {pesanan.status || "-"}
                            </strong>
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">
                            Informasi Pengiriman
                        </p>
                        <p>
                            penerima:{" "}
                            <strong>
                                {pesanan.pelanggan?.nama_pelanggan ||
                                    "-"}
                            </strong>
                        </p>
                        <p>
                            alamat:{" "}
                            <strong>
                                {pesanan.pelanggan?.alamat || "-"}
                            </strong>
                        </p>
                        <p>
                            no. telp:{" "}
                            <strong>
                                {pesanan.pelanggan?.no_hp || "-"}
                            </strong>
                        </p>
                    </div>
                </div>

                {/* TABEL PRODUK */}
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="text-left px-4 py-2">
                                    Produk
                                </th>
                                <th className="text-left px-4 py-2">
                                    Jumlah
                                </th>
                                <th className="text-left px-4 py-2">
                                    Harga/unit
                                </th>
                                <th className="text-left px-4 py-2">
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pesanan.details.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">
                                        {item.produk?.nama_produk}
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.quantity} tabung
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatRupiah(item.harga)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {formatRupiah(
                                            item.harga * item.quantity
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t">
                                <td className="px-4 py-2" colSpan={3}>
                                    Biaya Pengiriman
                                </td>
                                <td className="px-4 py-2">
                                    {formatRupiah(
                                        pesanan.biaya_pengiriman || 0
                                    )}
                                </td>
                            </tr>
                            <tr className="font-bold border-t bg-gray-100">
                                <td className="px-4 py-2" colSpan={3}>
                                    Total
                                </td>
                                <td className="px-4 py-2 text-blue-700">
                                    {formatRupiah(pesanan.total)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* UBAH METODE PEMBAYARAN */}
                <div>
                    <Label className="mb-1 block">
                        Ubah Metode Pembayaran
                    </Label>
                    <Select
                        defaultValue={pesanan.metode_pembayaran || ""}
                        onValueChange={handleUpdatePembayaran}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih metode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tunai">Tunai</SelectItem>
                            <SelectItem value="transfer">
                                Transfer
                            </SelectItem>
                            <SelectItem value="cicilan">Cicilan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* TOMBOL CETAK */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() =>
                            window.open(
                                route(
                                    "staffpenjualan.invoice.show",
                                    pesanan.id
                                ),
                                "_blank"
                            )
                        }
                    >
                        Cetak Invoice
                    </Button>
                    <Button
                        onClick={() =>
                            window.open(
                                route(
                                    "staffpenjualan.invoice.pdf",
                                    pesanan.id
                                ),
                                "_blank"
                            )
                        }
                    >
                        Cetak Tanda Terima
                    </Button>
                </div>

                {/* FORM PEMBAYARAN */}
                {pesanan.keterangan === "Lunas" ? (
                    <p className="text-green-600">Keterangan: Sudah Lunas</p>
                ) : (
                    <div className="pt-4 border-t">
                        <p className="text-red-600 mb-2">Status: Belum Lunas</p>
                        <ConfirmPembayaran pesananId={pesanan.id} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Detail;
