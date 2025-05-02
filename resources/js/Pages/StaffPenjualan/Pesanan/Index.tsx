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
import CreatableSelect from "react-select/creatable";
import { DataTable } from "@/Components/DataTable";
import { Produk, PageProps, Pesanan, Pelanggan } from "@/types";
import { toast } from "react-toastify";
import { CommandCombobox } from "@/Components/ui/CommandCombobox";

interface PesananProps {
    posts: Pesanan[];
    produks: Produk[];
    pelanggans: Pelanggan[];
}

const TabsDemo = ({ posts, produks, pelanggans }: PesananProps) => {
    const pageProps = usePage<PageProps>();
    const auth = pageProps.props.auth;

    const { data, setData, post, processing, reset } = useForm({
        tgl_pesanan: new Date(),
        pelanggan_id: "",
        jenis_pesanan: "jual", // ✅ jenis_pesanan di level pesanan
        produk: [{ produk_id: "", quantity: "", harga: 0 }],
        total: 0,
    });

    const [selectedPelanggan, setSelectedPelanggan] = useState<any>(null);
    const [selectedProduk, setSelectedProduk] = useState<any[]>([]);

    const pelangganOptions = pelanggans.map((p) => ({
        value: String(p.id),
        label: p.nama_pelanggan,
    }));

    const produkOptions = produks.map((produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const formatRupiah = (number: number): string =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

    const handleProdukChange = (index: number, option: any) => {
        const produk = produks.find((p) => String(p.id) === option?.value);
        const newProduk = [...data.produk];
        newProduk[index].produk_id = option?.value || "";
        newProduk[index].harga =
            data.jenis_pesanan === "sewa" ? 1200000 : produk?.harga_jual || 0;
        setData("produk", newProduk);

        const updatedSelected = [...selectedProduk];
        updatedSelected[index] = option;
        setSelectedProduk(updatedSelected);
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

    const handlePelangganChange = (option: any) => {
        setSelectedPelanggan(option);
        setData("pelanggan_id", option?.value || "");
    };

    const handleCreate = (inputValue: string) => {
        alert(`Tambah pelanggan baru: ${inputValue}`);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        post(route("staffpenjualan.pesanan.store"), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedPelanggan(null);
                setSelectedProduk([null]);
                setData("produk", [{ produk_id: "", quantity: "", harga: 0 }]); // menambahkan 1 baris produk kosong
            },
        });
    };

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
                                                {format(
                                                    data.tgl_pesanan,
                                                    "yyyy-MM-dd"
                                                )}
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
                                    <Label>Jenis Pesanan</Label>
                                    <select
                                        className="border rounded px-2 py-1"
                                        value={data.jenis_pesanan}
                                        onChange={(e) =>
                                            setData(
                                                "jenis_pesanan",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="jual">Penjualan</option>
                                        <option value="sewa">
                                            Sewa Tabung
                                        </option>
                                    </select>
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
                                    {data.produk.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-center mb-2"
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
                                                value={formatRupiah(
                                                    Number(item.harga)
                                                )}
                                                readOnly={
                                                    data.jenis_pesanan ===
                                                    "sewa"
                                                }
                                                onChange={(e) => {
                                                    const raw =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        );
                                                    const newProduk = [
                                                        ...data.produk,
                                                    ];
                                                    newProduk[index].harga =
                                                        parseInt(raw) || 0;
                                                    setData(
                                                        "produk",
                                                        newProduk
                                                    );
                                                }}
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
