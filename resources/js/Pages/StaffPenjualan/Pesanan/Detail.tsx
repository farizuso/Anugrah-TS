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
import { Pembayaran, Pesanan } from "@/types";
import ConfirmPembayaran from "@/Components/ConfirmPembayaran";
import { format } from "date-fns";
import { Label } from "@/Components/ui/label";
import { router, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Input } from "@/Components/ui/input";

interface DetailProps {
    pesanan: Pesanan;
}

const Detail = ({ pesanan }: DetailProps) => {
    const [open, setOpen] = useState(false);

    const formatRupiah = (angka: number) =>
        `Rp ${angka.toLocaleString("id-ID")}`;

    const handleUpdatePembayaran = (metode: string) => {
        if (pesanan.metode_pembayaran) return;
        router.post(
            route("staffpenjualan.pesanan.update_pembayaran", pesanan.id),
            { metode_pembayaran: metode },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Metode pembayaran diperbarui");
                },
            }
        );
    };

    return (
        <AdminLayout>
            <div className="bg-blue-700 text-white px-6 py-4 rounded-t-md">
                <h2 className="text-2xl font-semibold">Detail Transaksi</h2>
                <p className="text-sm mt-1">Detail transaksi # {pesanan.id}</p>
            </div>

            <div className="p-6 space-y-6">
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
                            <strong>{pesanan.metode_pembayaran || "-"}</strong>
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
                        {pesanan.keterangan === "Cicilan" && (
                            <p className="text-orange-600 mt-1">
                                Sisa tagihan:{" "}
                                <strong>
                                    {formatRupiah(
                                        pesanan.total - pesanan.jumlah_terbayar
                                    )}
                                </strong>
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold mb-1">
                            Informasi Pengiriman
                        </p>
                        <p>
                            penerima:{" "}
                            <strong>
                                {pesanan.pelanggan?.nama_pelanggan || "-"}
                            </strong>
                        </p>
                        <p>
                            alamat:{" "}
                            <strong>{pesanan.pelanggan?.alamat || "-"}</strong>
                        </p>
                        <p>
                            no. telp:{" "}
                            <strong>{pesanan.pelanggan?.no_hp || "-"}</strong>
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="text-left px-4 py-2">Produk</th>
                                <th className="text-left px-4 py-2">Jumlah</th>
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

                <div>
                    <Label className="mb-1 block">
                        Pilih Metode Pembayaran
                    </Label>
                    <Select
                        defaultValue={pesanan.metode_pembayaran || ""}
                        onValueChange={handleUpdatePembayaran}
                        disabled={!!pesanan.metode_pembayaran}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih metode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tunai">Tunai</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                            <SelectItem value="cicilan">Cicilan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-3 flex-row mt-4">
                    <Button
                        onClick={() =>
                            window.open(
                                route("staffpenjualan.invoice.pdf", pesanan.id),
                                "_blank"
                            )
                        }
                    >
                        Cetak Tanda Terima
                    </Button>

                    {pesanan.status === "Dikirim" && (
                        <Button
                            variant="success"
                            onClick={() =>
                                router.post(
                                    route(
                                        "staffpenjualan.pesanan.selesai",
                                        pesanan.id
                                    )
                                )
                            }
                        >
                            Tandai Selesai
                        </Button>
                    )}

                    {pesanan.status === "Pending" && (
                        <Button
                            variant="default"
                            onClick={() =>
                                router.post(
                                    route(
                                        "staffpenjualan.pesanan.kirim",
                                        pesanan.id
                                    )
                                )
                            }
                        >
                            Konfirmasi Pengiriman
                        </Button>
                    )}
                </div>

                {pesanan.keterangan !== "Lunas" && (
                    <div className="pt-4 border-t">
                        <p className="text-red-600 mb-2">Status: Belum Lunas</p>
                        <ConfirmPembayaran
                            pesananId={pesanan.id}
                            sisaTagihan={
                                pesanan.total - pesanan.jumlah_terbayar
                            }
                        />
                    </div>
                )}

                {pesanan.riwayat_pembayaran?.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold mb-2">
                            Riwayat Pembayaran
                        </h4>
                        <ul className="space-y-2">
                            {pesanan.riwayat_pembayaran.map(
                                (pembayaran, idx) => (
                                    <li
                                        key={idx}
                                        className="border p-3 rounded bg-gray-50 text-sm"
                                    >
                                        <div>
                                            <strong>
                                                Rp{" "}
                                                {Number(
                                                    pembayaran.jumlah_bayar
                                                ).toLocaleString("id-ID")}
                                            </strong>{" "}
                                            -{" "}
                                            {new Date(
                                                pembayaran.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </div>
                                        {pembayaran.bukti_transfer && (
                                            <div className="mt-1">
                                                <a
                                                    href={`/storage/${pembayaran.bukti_transfer}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat Bukti Transfer
                                                </a>
                                                {pembayaran.bukti_transfer.endsWith(
                                                    ".pdf"
                                                ) ? (
                                                    <iframe
                                                        src={`/storage/${pembayaran.bukti_transfer}`}
                                                        className="w-full h-64 mt-2 border rounded"
                                                    ></iframe>
                                                ) : (
                                                    <img
                                                        src={`/storage/${pembayaran.bukti_transfer}`}
                                                        alt="Bukti Transfer"
                                                        className="mt-2 max-w-xs rounded border"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Detail;
