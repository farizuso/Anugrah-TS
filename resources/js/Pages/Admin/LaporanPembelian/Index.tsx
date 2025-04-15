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

import { LaporanPembelian, PageProps, Produk, Supplier } from "@/types";
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
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface LaporanPembelianProps {
    posts: LaporanPembelian[];
}

const TabsDemo = ({ posts }: LaporanPembelianProps) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        tgl_pembelian: "",
        supplier_id: "",
        produk: [{ produk_id: "", harga: "", quantity: "" }],
        quantity: "",
        total: 0,
        keterangan: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.laporanpembelian.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleProdukChange = (index: number, value: any) => {
        const newProduk = [...data.produk];
        newProduk[index].produk_id = value ? String(value.value) : "";
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
        setData("supplier_id", option ? option.value : "");
    };

    const handleCreate = (inputValue: string) => {
        // Contoh: bisa ganti dengan open modal input supplier baru
        alert(`Tambah supplier baru: ${inputValue}`);
    };

    interface PageProps {
        produks: Produk[];
        suppliers: Supplier[];
    }

    const { produks = [], suppliers = [] } = usePage<PageProps>().props;

    const produkOptions = produks.map((produk: Produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const supplierOptions = suppliers.map((supplier: Supplier) => ({
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
                    <LaporanDataTable data={posts} columns={PembelianColumns} />
                </TabsContent>

                <TabsContent value="form">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>
                                    Tambah Data Laporan Pembelian
                                </CardTitle>
                                <CardDescription>
                                    Masukkan data laporan pembelian.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Tanggal Pembelian */}
                                <div className="space-y-1">
                                    <Label htmlFor="tgl_pembelian">
                                        Tanggal Pembelian
                                    </Label>
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
                                                          new Date(
                                                              data.tgl_pembelian
                                                          ),
                                                          "yyyy-MM-dd"
                                                      )
                                                    : "Pilih Tanggal"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    data.tgl_pembelian
                                                        ? new Date(
                                                              data.tgl_pembelian
                                                          )
                                                        : undefined
                                                }
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const local = new Date(
                                                            date
                                                        );
                                                        local.setHours(12); // Hindari offset
                                                        setData(
                                                            "tgl_pembelian",
                                                            local
                                                                .toISOString()
                                                                .split("T")[0]
                                                        );
                                                    }
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Supplier */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="supplier_id">
                                        Nama Supplier
                                    </Label>
                                    <CreatableSelect
                                        id="supplier_id"
                                        isClearable
                                        options={supplierOptions}
                                        onChange={handleSupplierChange}
                                        onCreateOption={handleCreate}
                                        value={supplierOptions.find(
                                            (option) =>
                                                option.value ===
                                                data.supplier_id
                                        )}
                                    />
                                </div>

                                {/* Produk Repeater */}
                                {data.produk.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-end"
                                    >
                                        <div className="w-full">
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
                                                    (opt) =>
                                                        opt.value ===
                                                        item.produk_id
                                                )}
                                            />
                                        </div>
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
                                        disabled
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="keterangan">
                                        Keterangan
                                    </Label>
                                    <Input
                                        id="keterangan"
                                        type="text"
                                        name="keterangan"
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
