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
import React, { FormEventHandler, useEffect, useState } from "react";
import { PembelianColumns } from "./PembelianColumn";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { LaporanDataTable } from "@/Components/LaporanDataTable";
import { Produk, Supplier, LaporanPembelian, PageProps } from "@/types";
import { DataTable } from "@/Components/DataTable";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { CommandCombobox } from "@/Components/ui/CommandCombobox";

interface LaporanPembelianProps {
    posts: LaporanPembelian[];
    produks: Produk[];
    suppliers: Supplier[];
}

const TabsDemo = ({ posts, produks, suppliers }: LaporanPembelianProps) => {
    const pageProps = usePage<PageProps>();
    const auth = pageProps.props.auth;

    const { data, setData, post, processing, errors, reset } = useForm({
        tgl_pembelian: new Date(),
        supplier_id: "",
        produk: [{ produk_id: "", harga: "", quantity: "" }],
        total: 0,
        keterangan: "",
        ppn: 0,
        grand_total: 0,
        metode_pembayaran: "",
        status: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const localTime = new Date();
        const formattedDate = `${localTime.getFullYear()}-${
            localTime.getMonth() + 1
        }-${localTime.getDate()} ${localTime.getHours()}:${localTime.getMinutes()}:00`;

        post(route("admin.laporanpembelian.store"), {
            data: {
                ...data,
                tgl_pembelian: formattedDate,
            },
            onSuccess: () => {
                reset();
                setData({
                    tgl_pembelian: new Date(),
                    supplier_id: "",
                    produk: [{ produk_id: "", harga: "", quantity: "" }],
                    total: 0,
                    ppn: 0,
                    grand_total: 0,
                    keterangan: "",
                    metode_pembayaran: "",
                    status: "",
                });
                setSelectedSupplier(null);
                setSelectedProduk([null]);
            },
        });
    };

    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
    const [selectedProduk, setSelectedProduk] = useState<any[]>([null]);

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
        setSelectedProduk([...selectedProduk, null]); // ini penting
    };

    const handleRemoveRow = (index: number) => {
        const newProduk = [...data.produk];
        newProduk.splice(index, 1);
        setData("produk", newProduk);
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

    const formatRupiahInput = (value: string): string => {
        const numberString = value.replace(/[^,\d]/g, "");
        const split = numberString.split(",");
        let sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
        return rupiah ? "Rp " + rupiah : "";
    };

    const parseRupiahToNumber = (value: string): string => {
        return value.replace(/[^0-9]/g, "");
    };

    useEffect(() => {
        const totalHarga = data.produk.reduce((acc, curr) => {
            const harga = parseFloat(curr.harga) || 0;
            const qty = parseFloat(curr.quantity) || 0;
            return acc + harga * qty;
        }, 0);
        setData("total", totalHarga);
    }, [data.produk]);

    const ppn = data.total * 0.11;
    const grandTotal = data.total + ppn;

    return (
        <AdminLayout>
            {/* ubah lagi defaultvalue menjadi datatable */}
            <Tabs defaultValue="datatable" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="datatable">Data Table</TabsTrigger>
                    <TabsTrigger value="form">Tambah Data</TabsTrigger>
                </TabsList>

                <TabsContent value="datatable">
                    {auth?.user && (
                        <LaporanDataTable
                            columns={PembelianColumns}
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
                                    <CommandCombobox
                                        options={supplierOptions}
                                        value={data.supplier_id}
                                        onValueChange={(value) =>
                                            setData("supplier_id", value)
                                        }
                                        placeholder="Pilih Supplier"
                                        searchPlaceholder="Cari supplier..."
                                    />
                                </div>

                                {data.produk.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-end"
                                    >
                                        <CommandCombobox
                                            options={produkOptions}
                                            value={item.produk_id}
                                            onValueChange={(value) =>
                                                handleProdukChange(index, {
                                                    value,
                                                })
                                            }
                                            placeholder="Pilih Produk"
                                            searchPlaceholder="Cari produk..."
                                        />

                                        <Input
                                            type="text"
                                            placeholder="Harga"
                                            className="w-32"
                                            value={formatRupiahInput(
                                                item.harga
                                            )}
                                            onChange={(e) =>
                                                handleHargaChange(
                                                    index,
                                                    parseRupiahToNumber(
                                                        e.target.value
                                                    )
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
                                    <Label>Sub Total</Label>
                                    <Input
                                        type="text"
                                        value={formatRupiah(data.total)}
                                        readOnly
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label>PPN 11%</Label>
                                    <Input
                                        type="text"
                                        value={formatRupiah(ppn)}
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Grand Total</Label>
                                    <Input
                                        type="text"
                                        value={formatRupiah(grandTotal)}
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="mb-1 block">
                                        Keterangan Pembayaran
                                    </Label>
                                    <Select
                                        value={data.keterangan}
                                        onValueChange={(value) =>
                                            setData("keterangan", value)
                                        }
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Pilih keterangan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lunas">
                                                Lunas
                                            </SelectItem>
                                            <SelectItem value="Belum Lunas">
                                                Belum Lunas
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.keterangan && (
                                        <p className="text-sm text-red-500">
                                            {errors.keterangan}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label className="mb-1 block">
                                        Metode Pembayaran
                                    </Label>
                                    <Select
                                        value={data.metode_pembayaran}
                                        onValueChange={(value) =>
                                            setData("metode_pembayaran", value)
                                        }
                                    >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Pilih metode pembayaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tunai">
                                                Tunai
                                            </SelectItem>
                                            <SelectItem value="Transfer">
                                                Transfer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.metode_pembayaran && (
                                        <p className="text-sm text-red-500">
                                            {errors.metode_pembayaran}
                                        </p>
                                    )}
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
