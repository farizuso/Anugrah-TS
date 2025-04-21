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
import React, { useEffect } from "react";
import { PesananColumns } from "./PesananColumn";
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
import {
    Produk,
    Supplier,
    PageProps,
    Pesanan,
    Pelanggan,
    Pembayaran,
} from "@/types";
import { DataTable } from "@/Components/DataTable";
import { toast } from "react-toastify";

interface PesananProps {
    posts: Pesanan[];
    produks: Produk[];
    pelanggans: Pelanggan[];
}

const TabsDemo = ({ posts, produks, pelanggans }: PesananProps) => {
    const pageProps = usePage<PageProps>();
    const auth = pageProps.props.auth;

    const { data, setData, post, processing, errors, reset } = useForm({
        tgl_pesanan: new Date(),
        pelanggan_id: "",
        produk: [{ produk_id: "", quantity: "", harga: 0 }],
        total: 0,
    });

    const metodeOptions = [
        { value: "Tunai", label: "Tunai" },
        { value: "Transfer", label: "Transfer" },
        { value: "Cicilan", label: "Cicilan" },
    ];

    const validateForm = () => {
        if (!data.pelanggan_id) {
            toast.error("Pelanggan harus dipilih.");
            return false;
        }

        for (const [index, item] of data.produk.entries()) {
            if (!item.produk_id) {
                toast.error(`Produk baris ${index + 1} belum dipilih.`);
                return false;
            }
            if (!item.quantity || parseInt(item.quantity) <= 0) {
                toast.error(
                    `Jumlah pada baris ${index + 1} harus lebih dari 0.`
                );
                return false;
            }
        }

        return true;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("tgl_pesanan", format(data.tgl_pesanan, "yyyy-MM-dd"));
        formData.append("pelanggan_id", data.pelanggan_id);
        formData.append("total", String(data.total));
        formData.append("produk", JSON.stringify(data.produk));

        post(route("staffpenjualan.pesanan.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                if (!Object.keys(errors).length) {
                    toast.success("Pesanan berhasil disimpan.");
                    reset();
                }
            },
            onError: (err) => {
                if (err.message) {
                    toast.error(err.message);
                }
            },
        });
    };

    const handleProdukChange = (index: number, value: any) => {
        const produkTerpilih = produks.find(
            (produk) => String(produk.id) === value?.value
        );

        const newProduk = [...data.produk];
        newProduk[index].produk_id = value?.value || "";
        newProduk[index].harga = Number(produkTerpilih?.harga_jual) || 0;
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
            { produk_id: "", quantity: "", harga: 0 },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        const newProduk = [...data.produk];
        newProduk.splice(index, 1);
        setData("produk", newProduk);
    };

    const handlePelangganChange = (option: any) => {
        setData("pelanggan_id", option?.value || "");
    };

    const handleCreate = (inputValue: string) => {
        alert(`Tambah pelanggan baru: ${inputValue}`);
    };

    const produkOptions = produks.map((produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const pelangganOptions = pelanggans.map((pelanggan) => ({
        value: String(pelanggan.id),
        label: pelanggan.nama_pelanggan,
    }));

    const formatRupiah = (number: number): string =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

    useEffect(() => {
        const totalHarga = data.produk.reduce((acc, curr) => {
            const qty = parseFloat(curr.quantity) || 0;
            const harga = parseFloat(curr.harga?.toString() || "0");
            return acc + harga * qty;
        }, 0);
        setData("total", totalHarga);
    }, [data.produk]);

    return (
        <AdminLayout>
            <Tabs defaultValue="datatable" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="datatable">Data Table</TabsTrigger>
                    <TabsTrigger value="form">Tambah Data</TabsTrigger>
                </TabsList>

                <TabsContent value="datatable">
                    {auth?.user && (
                        <DataTable columns={PesananColumns} data={posts} />
                    )}
                </TabsContent>

                <TabsContent value="form">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Pesanan</CardTitle>
                                <CardDescription>
                                    Masukkan data Pesanan.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label>Tanggal Pesanan</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !data.tgl_pesanan &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {data.tgl_pesanan
                                                    ? format(
                                                          data.tgl_pesanan,
                                                          "yyyy-MM-dd"
                                                      )
                                                    : "Pilih Tanggal"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.tgl_pesanan}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setData(
                                                            "tgl_pesanan",
                                                            date
                                                        );
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Nama Pelanggan</Label>
                                    <CreatableSelect
                                        isClearable
                                        options={pelangganOptions}
                                        onChange={handlePelangganChange}
                                        onCreateOption={handleCreate}
                                        value={pelangganOptions.find(
                                            (opt) =>
                                                opt.value === data.pelanggan_id
                                        )}
                                    />
                                </div>
                                <div>
                                    <Label>Produk</Label>
                                    {data.produk.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-center mb-2"
                                        >
                                            <CreatableSelect
                                                isClearable
                                                options={produkOptions}
                                                onChange={(val) =>
                                                    handleProdukChange(
                                                        index,
                                                        val
                                                    )
                                                }
                                                value={produkOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        item.produk_id
                                                )}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Harga"
                                                className="w-32"
                                                value={item.harga}
                                                readOnly
                                            />

                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                className="w-24"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Button
                                                variant="destructive"
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveRow(index)
                                                }
                                                disabled={
                                                    data.produk.length === 1
                                                }
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAddRow}
                                    >
                                        + Tambah Produk
                                    </Button>

                                    <div className="space-y-1">
                                        <Label>Total</Label>
                                        <Input
                                            type="text"
                                            value={formatRupiah(data.total)}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Pesanan"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
};

export default TabsDemo;
