import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Pesanan, Rekap } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import * as React from "react";
import { DataTable } from "@/Components/DataTable";
import { rekapColumns } from "./rekapColumn";
import { CommandCombobox } from "@/Components/ui/CommandCombobox";

interface RekapProps {
    rekaps: Rekap[];
    pesanans: Pesanan[];
}

const Index = ({ rekaps, pesanans }: RekapProps) => {
    console.log(rekaps);
    const { data, setData, post, processing, reset, errors } = useForm<{
        pesanan_id: number | null; // Correct way to define pesanan_id as a number or null
        status: string;
        tabung_per_produk: {
            produk_id: number;
            produk_nama: string;
            tabung: string[];
        }[];
    }>({
        pesanan_id: null, // Initialize with null
        status: "keluar",
        tabung_per_produk: [],
    });

    return (
        <AdminLayout>
            <DataTable data={rekaps} columns={rekapColumns} />
        </AdminLayout>
    );
};

export default Index;
