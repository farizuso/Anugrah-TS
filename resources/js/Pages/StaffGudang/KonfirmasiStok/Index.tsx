// File: resources/js/Pages/LaporanPembelian/TabsDemo.tsx

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
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler, useEffect } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { LaporanDataTable } from "@/Components/LaporanDataTable";
import { Produk, Supplier, LaporanPembelian, PageProps } from "@/types";
import { DataTable } from "@/Components/DataTable";
import KonfirmasiColumns from "./KonfirmasiColumn";

interface LaporanPembelianProps {
    posts: LaporanPembelian[];
    produks: Produk[];
    suppliers: Supplier[];
}

const TabsDemo = ({ posts, produks, suppliers }: LaporanPembelianProps) => {
    const flash = usePage<PageProps>().props.flash;

    const { data, setData, post, processing, errors, reset } = useForm({
        tgl_pembelian: new Date(),
        supplier_id: "",
        produk: [{ produk_id: "", harga: "", quantity: "" }],
        total: 0,
        keterangan: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formattedDate = format(data.tgl_pembelian, "yyyy-MM-dd");

        post(route("admin.laporanpembelian.store"), {
            data: {
                ...data,
                tgl_pembelian: formattedDate,
            },
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Tabs defaultValue="datatable" className="w-full">
                <TabsContent value="datatable">
                    <DataTable data={posts} columns={KonfirmasiColumns} />
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
};

export default TabsDemo;
