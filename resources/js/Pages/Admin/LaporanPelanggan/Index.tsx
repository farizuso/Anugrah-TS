// File: resources/js/Pages/Admin/LaporanBarangPelanggan.tsx

import React from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { DataTable } from "@/Components/DataTable";
import { BarangPelanggan, BarangPelangganColumns } from "./BarangPelangganColumn";
import { LaporanDataTable } from "@/Components/LaporanDataTable";

interface Props {
    laporan: BarangPelanggan[];
    tanggal_awal: string;
    tanggal_akhir: string;
}

const LaporanBarangPelanggan = ({
    laporan,
    tanggal_awal,
    tanggal_akhir,
}: Props) => {
    const { data, setData, get } = useForm({
        tanggal_awal: tanggal_awal || "",
        tanggal_akhir: tanggal_akhir || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route("admin.laporanPelanggan.index"));
    };

    return (
        <AdminLayout>
            <LaporanDataTable columns={BarangPelangganColumns} data={laporan} />
        </AdminLayout>
    );
};

export default LaporanBarangPelanggan;
