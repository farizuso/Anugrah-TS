// File: Invoice.tsx

import React from "react";
import { PageProps, Pesanan } from "@/types";

interface InvoiceProps {
    pesanan: Pesanan;
}

const Invoice = ({ pesanan }: InvoiceProps) => {
    return (
        <div className="p-8 max-w-2xl mx-auto font-sans text-sm text-black bg-white">
            <h1 className="text-2xl font-bold mb-4">Invoice Pesanan</h1>
            <div className="mb-4">
                <p>
                    <strong>Tanggal:</strong> {pesanan.tgl_pesanan}
                </p>
                <p>
                    <strong>Pelanggan:</strong>{" "}
                    {pesanan.pelanggan?.nama_pelanggan}
                </p>
                <p>
                    <strong>Status Pembayaran:</strong> {pesanan.keterangan}
                </p>
            </div>

            <table className="w-full mb-4 border-collapse border">
                <thead>
                    <tr>
                        <th className="border px-2 py-1">#</th>
                        <th className="border px-2 py-1">Produk</th>
                        <th className="border px-2 py-1">Qty</th>
                        <th className="border px-2 py-1">Harga</th>
                        <th className="border px-2 py-1">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {pesanan.details.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-2 py-1">{index + 1}</td>
                            <td className="border px-2 py-1">
                                {item.produk?.nama_produk}
                            </td>
                            <td className="border px-2 py-1">
                                {item.quantity}
                            </td>
                            <td className="border px-2 py-1">
                                Rp {Number(item.harga).toLocaleString("id-ID")}
                            </td>
                            <td className="border px-2 py-1">
                                Rp{" "}
                                {(item.harga * item.quantity).toLocaleString(
                                    "id-ID"
                                )}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td
                            colSpan={4}
                            className="border px-2 py-1 text-right font-bold"
                        >
                            Total
                        </td>
                        <td className="border px-2 py-1 font-bold text-green-600">
                            Rp {Number(pesanan.total).toLocaleString("id-ID")}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-4 text-center text-sm text-gray-500">
                Terima kasih atas pesanan Anda.
            </div>
        </div>
    );
};

export default Invoice;
