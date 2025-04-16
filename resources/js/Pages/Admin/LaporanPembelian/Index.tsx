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
            <Tabs defaultValue="datatable" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="datatable">Data Table</TabsTrigger>
                    <TabsTrigger value="form">Tambah Data</TabsTrigger>
                </TabsList>

                <TabsContent value="datatable">
                    {auth?.user && (
                        <DataTable
                            columns={PembelianColumns(auth.user)}
                            data={posts}
                        />
                    )}
                </TabsContent>

                <TabsContent value="form">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Laporan Pembelian</CardTitle>
                                <CardDescription>
                                    Masukkan data pembelian produk.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label>Tanggal Pembelian</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !data.tgl_pembelian &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {data.tgl_pembelian
                                                    ? format(
                                                          data.tgl_pembelian,
                                                          "yyyy-MM-dd"
                                                      )
                                                    : "Pilih Tanggal"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.tgl_pembelian}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setData(
                                                            "tgl_pembelian",
                                                            date
                                                        );
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Nama Supplier</Label>
                                    <CreatableSelect
                                        isClearable
                                        options={supplierOptions}
                                        onChange={handleSupplierChange}
                                        onCreateOption={handleCreate}
                                        value={supplierOptions.find(
                                            (opt) =>
                                                opt.value === data.supplier_id
                                        )}
                                    />
                                </div>

                                {data.produk.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-end"
                                    >
                                        <CreatableSelect
                                            isClearable
                                            options={produkOptions}
                                            onChange={(val) =>
                                                handleProdukChange(index, val)
                                            }
                                            value={produkOptions.find(
                                                (opt) =>
                                                    opt.value === item.produk_id
                                            )}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Harga"
                                            className="w-32"
                                            value={item.harga}
                                            onChange={(e) =>
                                                handleHargaChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
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
                                            disabled={data.produk.length === 1}
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

                                <div className="space-y-1">
                                    <Label>Keterangan</Label>
                                    <Input
                                        type="text"
                                        value={data.keterangan}
                                        onChange={(e) =>
                                            setData(
                                                "keterangan",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Laporan"}
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
