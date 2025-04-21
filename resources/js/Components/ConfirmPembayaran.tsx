import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";

interface Props {
    pesananId: number;
    sisaTagihan: number;
}

const ConfirmPembayaran = ({ pesananId, sisaTagihan }: Props) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        jumlah_terbayar: 0,
        bukti_transfer: null as File | null,
    });

    const formatRupiah = (angka: number): string =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.jumlah_terbayar > sisaTagihan) {
            toast.error("Jumlah pembayaran melebihi sisa tagihan.");
            return;
        }

        const formData = new FormData();
        formData.append("jumlah_terbayar", String(data.jumlah_terbayar));
        if (data.bukti_transfer) {
            formData.append("bukti_transfer", data.bukti_transfer);
        }
        post(route("staffpenjualan.pesanan.konfirmasi_pembayaran", pesananId), {
            data: formData,
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Jumlah Pembayaran</Label>
                <Input
                    type="text"
                    value={formatRupiah(data.jumlah_terbayar)}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        const angka = parseInt(raw || "0");
                        setData("jumlah_terbayar", angka);
                    }}
                />
                {errors.jumlah_terbayar && (
                    <p className="text-sm text-red-500">
                        {errors.jumlah_terbayar}
                    </p>
                )}
            </div>

            <div>
                <Label>Bukti Transfer (Opsional)</Label>
                <Input
                    type="file"
                    onChange={(e) =>
                        setData("bukti_transfer", e.target.files?.[0] || null)
                    }
                />
                {errors.bukti_transfer && (
                    <p className="text-sm text-red-500">
                        {errors.bukti_transfer}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? "Menyimpan..." : "Konfirmasi Pembayaran"}
            </Button>
        </form>
    );
};

export default ConfirmPembayaran;
