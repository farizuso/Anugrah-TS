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
import { PembelianColumns } from "./PembelianColumn";
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
import { Produk, Supplier, LaporanPembelian, PageProps, User } from "@/types";
import { DataTable } from "@/Components/DataTable";

interface LaporanPembelianProps {
    posts: LaporanPembelian[];
    produks: Produk[];
    suppliers: Supplier[];
}

const TabsDemo = ({ posts, produks, suppliers }: LaporanPembelianProps) => {
    const pageProps = usePage<PageProps>();
    const auth = pageProps.props.auth;
    const flash = usePage<PageProps>().props.flash;

    const { data, setData, post, processing, errors, reset } = useForm({
        tgl_pembelian: new Date(),
        supplier_id: "",
        produk: [{ produk_id: "", harga: "", quantity: "" }],
        total: 0,
        keterangan: "",
        status: "",
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

    const handleProdukChange = (index: number, value: any) => {
        const newProduk = [...data.produk];
        newProduk[index].produk_id = value?.value || "";
        setData("produk", newProduk);
    };

    const handleHargaChange = (index: number, value: string) => {
        const newProduk = [...data.produk];
        newProduk[index].harga = value;
        setData("produk", newProduk);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const newProduk = [...data.produk];
        newProduk[index].quantity = value;
        setData("produk", newProduk);
    };

    const handleAddRow = () => {
        setData("produk", [
            ...data.produk,
            { produk_id: "", harga: "", quantity: "" },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        const newProduk = [...data.produk];
        newProduk.splice(index, 1);
        setData("produk", newProduk);
    };

    const handleSupplierChange = (option: any) => {
        setData("supplier_id", option?.value || "");
    };

    const handleCreate = (inputValue: string) => {
        alert(`Tambah supplier baru: ${inputValue}`);
    };

    const produkOptions = produks.map((produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const supplierOptions = suppliers.map((supplier) => ({
        value: String(supplier.id),
        label: supplier.nama_supplier,
    }));

    const formatRupiah = (number: number): string =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

    useEffect(() => {
        const totalHarga = data.produk.reduce((acc, curr) => {
            const harga = parseFloat(curr.harga) || 0;
            const qty = parseFloat(curr.quantity) || 0;
            return acc + harga * qty;
        }, 0);
        setData("total", totalHarga);
    }, [data.produk]);

    return (
        <AdminLayout>
            <DataTable data={posts} columns={PembelianColumns} />
        </AdminLayout>
    );
};

export default TabsDemo;
