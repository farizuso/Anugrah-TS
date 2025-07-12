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
import { DataTable } from "@/Components/DataTable";
import { Produk, PageProps, Pesanan, Pelanggan } from "@/types";
import { CommandCombobox } from "@/Components/ui/CommandCombobox";
import { formatRupiah } from "@/lib/utils";

interface PesananProps {
    posts: Pesanan[];
    produks: Produk[];
    pelanggans: Pelanggan[];
}

const TabsDemo = ({ posts, produks, pelanggans }: PesananProps) => {
    const pageProps = usePage<PageProps>();
    const auth = pageProps.props.auth;

    const { data, setData, post, processing, reset } = useForm({
        tgl_pesanan: format(new Date(), "yyyy-MM-dd"),
        pelanggan_id: "",
        produk: [
            {
                produk_id: "",
                quantity: 0,
                harga: 0,
                tipe_item: "jual",
                durasi: 0,
            },
        ],
        total: 0,
    });

    const [selectedProduk, setSelectedProduk] = useState<any[]>([]);

    const pelangganOptions = pelanggans.map((p) => ({
        value: String(p.id),
        label: p.nama_pelanggan,
    }));

    const produkOptions = produks.map((produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    // const formatRupiah = (number: number): string =>
    //     new Intl.NumberFormat("id-ID", {
    //         style: "currency",
    //         currency: "IDR",
    //     }).format(number);

    const handleProdukChange = (index: number, option: any) => {
        const produk = produks.find((p) => String(p.id) === option?.value);
        const newProduk = [...data.produk];
        newProduk[index].produk_id = option?.value || "";

        if (
            newProduk[index].tipe_item === "sewa" &&
            produk?.kategori === "gas"
        ) {
            const hargaGas = produk?.harga_jual || 0;
            const hargaSewa = 100000 * (newProduk[index].durasi || 1);
            newProduk[index].harga = hargaGas + hargaSewa;
            newProduk[index].durasi = 1;
        } else {
            newProduk[index].harga = produk?.harga_jual || 0;
            newProduk[index].durasi = 0;
        }

        setData("produk", newProduk);

        const updatedSelected = [...selectedProduk];
        updatedSelected[index] = option;
        setSelectedProduk(updatedSelected);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const qty = parseInt(value, 10);
        const newProduk = [...data.produk];
        newProduk[index].quantity = Number.isFinite(qty) ? qty : 0;
        setData("produk", newProduk);
    };

    const handleAddRow = () => {
        setData("produk", [
            ...data.produk,
            {
                produk_id: "",
                quantity: 0,
                harga: 0,
                tipe_item: "jual",
                durasi: 0,
            },
        ]);
        setSelectedProduk([...selectedProduk, null]);
    };

    const handleRemoveRow = (index: number) => {
        const newProduk = [...data.produk];
        newProduk.splice(index, 1);
        setData("produk", newProduk);

        const newSelected = [...selectedProduk];
        newSelected.splice(index, 1);
        setSelectedProduk(newSelected);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("staffpenjualan.pesanan.store"), {
            data,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedProduk([null]);
                setData("produk", [
                    {
                        produk_id: "",
                        quantity: 0,
                        harga: 0,
                        tipe_item: "jual",
                        durasi: 0,
                    },
                ]);
            },
        });
    };

    useEffect(() => {
        const totalHarga = data.produk.reduce((acc, curr) => {
            const qty = curr.quantity;
            const harga = Number(curr.harga);
            const validQty = Number.isFinite(qty) ? qty : 0;
            const validHarga = Number.isFinite(harga) ? harga : 0;
            return acc + validHarga * validQty;
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
                                    <Label>Tanggal Pemesanan</Label>
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
                                                {data.tgl_pesanan ??
                                                    "Pilih Tanggal"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    data.tgl_pesanan
                                                        ? new Date(
                                                            data.tgl_pesanan
                                                        )
                                                        : undefined
                                                }
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const formatted =
                                                            format(
                                                                date,
                                                                "yyyy-MM-dd"
                                                            );
                                                        setData(
                                                            "tgl_pesanan",
                                                            formatted
                                                        );
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Nama Pelanggan</Label>
                                    <CommandCombobox
                                        options={pelangganOptions}
                                        value={data.pelanggan_id}
                                        onValueChange={(value) =>
                                            setData("pelanggan_id", value)
                                        }
                                        placeholder="Pilih Pelanggan"
                                        searchPlaceholder="Cari Pelanggan..."
                                    />
                                </div>

                                <div>
                                    <Label>Produk</Label>
                                    {data.produk.map((item, index) => {
                                        const produk = produks.find(
                                            (p) =>
                                                String(p.id) === item.produk_id
                                        );
                                        return (
                                            <div
                                                key={index}
                                                className="flex gap-2 items-center mb-2"
                                            >
                                                <CommandCombobox
                                                    options={produkOptions}
                                                    value={item.produk_id}
                                                    onValueChange={(value) =>
                                                        handleProdukChange(
                                                            index,
                                                            {
                                                                value,
                                                            }
                                                        )
                                                    }
                                                    placeholder="Pilih Produk"
                                                    searchPlaceholder="Cari produk..."
                                                />

                                                <select
                                                    className="border rounded px-2 py-1"
                                                    value={item.tipe_item}
                                                    onChange={(e) => {
                                                        const tipe =
                                                            e.target.value;
                                                        const newProduk = [
                                                            ...data.produk,
                                                        ];
                                                        newProduk[
                                                            index
                                                        ].tipe_item = tipe;
                                                        if (
                                                            tipe === "sewa" &&
                                                            produk?.kategori ===
                                                            "gas"
                                                        ) {
                                                            const hargaGas =
                                                                produk?.harga_jual ||
                                                                0;
                                                            const hargaSewa =
                                                                100000 *
                                                                (newProduk[
                                                                    index
                                                                ].durasi || 1);
                                                            newProduk[
                                                                index
                                                            ].harga =
                                                                hargaGas +
                                                                hargaSewa;
                                                            newProduk[
                                                                index
                                                            ].durasi = 1;
                                                        } else {
                                                            newProduk[
                                                                index
                                                            ].harga =
                                                                produk?.harga_jual ||
                                                                0;
                                                            newProduk[
                                                                index
                                                            ].durasi = 0;
                                                        }
                                                        setData(
                                                            "produk",
                                                            newProduk
                                                        );
                                                    }}
                                                >
                                                    <option value="jual">
                                                        Jual
                                                    </option>
                                                    <option value="sewa">
                                                        Sewa
                                                    </option>
                                                </select>

                                                {item.tipe_item === "sewa" && (
                                                    <Input
                                                        type="number"
                                                        placeholder="Durasi (bln)"
                                                        className="w-28"
                                                        value={item.durasi}
                                                        onChange={(e) => {
                                                            const durasi = parseInt(e.target.value) || 1;

                                                            // Copy array state
                                                            const newProduk = [...data.produk];

                                                            // Update durasi
                                                            newProduk[index].durasi = durasi;

                                                            // Pastikan hargaGas number polos
                                                            const hargaGas = produk?.harga_jual
                                                                ? Number(produk.harga_jual)
                                                                : 0;

                                                            // Hitung hargaSewa number polos
                                                            const hargaSewa = 100000 * durasi;

                                                            // Assign harga = hargaGas + hargaSewa
                                                            newProduk[index].harga = hargaGas + hargaSewa;

                                                            // Simpan state
                                                            setData("produk", newProduk);
                                                        }}
                                                    />
                                                )}

                                                <Input
                                                    type="text"
                                                    placeholder="Harga"
                                                    className="w-32"
                                                    value={formatRupiah(item.harga)}
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
                                        );
                                    })}

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAddRow}
                                    >
                                        + Tambah Produk
                                    </Button>

                                    <div className="space-y-1 mt-4">
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
