import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

const ConfirmPembayaran = ({ pesananId }: { pesananId: number }) => {
    const { data, setData, post, progress, errors, reset } = useForm({
        jumlah_terbayar: "",
        bukti_transfer: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("staffpenjualan.pesanan.konfirmasi", pesananId), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
                <Label>Jumlah Pembayaran</Label>
                <Input
                    type="number"
                    value={data.jumlah_terbayar}
                    onChange={(e) => setData("jumlah_terbayar", e.target.value)}
                />
                {errors.jumlah_terbayar && (
                    <div className="text-red-500 text-sm">
                        {errors.jumlah_terbayar}
                    </div>
                )}
            </div>

            <div>
                <Label>Bukti Transfer (opsional)</Label>
                <Input
                    type="file"
                    onChange={(e) =>
                        setData("bukti_transfer", e.target.files?.[0] || null)
                    }
                />
                {errors.bukti_transfer && (
                    <div className="text-red-500 text-sm">
                        {errors.bukti_transfer}
                    </div>
                )}
            </div>

            <Button type="submit" disabled={progress !== null}>
                {progress ? "Menyimpan..." : "Konfirmasi Pembayaran"}
            </Button>
        </form>
    );
};

export default ConfirmPembayaran;
