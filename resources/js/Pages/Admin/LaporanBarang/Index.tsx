// File: resources/js/Pages/Admin/LaporanBarangTerjual.tsx

import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { LaporanDataTable } from "@/Components/LaporanDataTable";
import { BarangTerjualColumns } from "./BarangTerjualColumn";
import { BarangTerjual } from "./BarangTerjualColumn";

interface Props {
    laporan: BarangTerjual[];
    tanggal_awal: string;
    tanggal_akhir: string;
}

const LaporanBarangTerjual = ({
    laporan,
    tanggal_awal,
    tanggal_akhir,
}: Props) => {
    return (
        <AdminLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Laporan Barang Terjual</CardTitle>
                </CardHeader>
                <CardContent>
                    <LaporanDataTable
                        data={laporan}
                        columns={BarangTerjualColumns}
                        excelName="laporan_barang_terjual.xlsx"
                        excelMap={(item) => ({
                            "Nama Produk": item.produk.nama_produk,
                            "Total Terjual": item.total_qty,
                            Pendapatan: item.total_pendapatan,
                        })}
                        getTotal={(data) =>
                            data.reduce(
                                (total, item) => total + item.total_pendapatan,
                                0
                            )
                        }
                    />
                </CardContent>
            </Card>
        </AdminLayout>
    );
};

export default LaporanBarangTerjual;
