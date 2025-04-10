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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import { DataTable } from "@/Components/DataTable";
import { LaporanPembelian, PageProps, Produk } from '@/types';
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler } from "react";
import { PembelianColumns } from "./PembelianColumn"; // Fix nama ekspor
import { PopoverContent, PopoverTrigger } from "@/Components/ui/popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns"; // FIX: from date-fns
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { Popover } from "@headlessui/react";


interface LaporanPembelianProps {
    posts: LaporanPembelian[];
}

const TabsDemo = ({ posts }: LaporanPembelianProps) => {
    const flash = usePage<PageProps>().props.flash;

    const { delete: destroy, data, setData, post, processing, errors, reset } = useForm({
        tgl_pembelian: "",
        nama_supplier: "",
        produk_id: "",
        quantity: "",
        harga: "",
        total: "",
        keterangan: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.laporan_pembelian.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleDateSelect = (field: string, date: Date | undefined) => {
        if (date) {
            const adjustedDate = new Date(date);
            adjustedDate.setHours(12, 0, 0, 0);
            setData({ ...data, [field]: adjustedDate.toISOString().split('T')[0] });
        } else {
            setData({ ...data, [field]: "" });
        }
    };

    const { produks = [] } = usePage<PageProps>().props;

    const [produkOptions, setProdukOptions] = React.useState(
        produks?.map((produk: Produk) => ({
            value: String(produk.id),
            label: produk.no_botol,
        })) || []
    );

    const handleProdukChange = (newValue: any) => {
        setData("produk_id", newValue ? String(newValue.value) : "");
    };

    const handleCreate = (inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        setProdukOptions([...produkOptions, newOption]);
        setData("produk_id", inputValue);
    };

    return (
        <AdminLayout>
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Data Table</TabsTrigger>
                    <TabsTrigger value="password">Tambah Data</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DataTable data={posts} columns={PembelianColumns} />
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Laporan Pembelian</CardTitle>
                                <CardDescription>
                                    Masukkan data laporan pembelian.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="tgl_pembelian">Tanggal Masuk Pabrik</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !data.tgl_pembelian && "text-muted-foreground"
                                                )}
                                            >
                                                {data.tgl_pembelian
                                                    ? format(new Date(data.tgl_pembelian), "yyyy-MM-dd")
                                                    : "Pilih Tanggal"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.tgl_pembelian ? new Date(data.tgl_pembelian) : undefined}
                                                onSelect={(date) => handleDateSelect('tgl_pembelian', date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="nama_supplier">Nama Supplier</Label>
                                    <Input
                                        id="nama_supplier"
                                        type="text"
                                        name="nama_supplier"
                                        onChange={(e) => setData("nama_supplier", e.target.value)}
                                        value={data.nama_supplier}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="produk_id">Nama Produk</Label>
                                    <CreatableSelect
                                        id="produk_id"
                                        isClearable
                                        options={produkOptions}
                                        onChange={handleProdukChange}
                                        onCreateOption={handleCreate}
                                        value={produkOptions.find(
                                            (option) => option.value === data.produk_id
                                        )}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="harga">Harga</Label>
                                    <Input
                                        id="harga"
                                        type="number"
                                        name="harga"
                                        onChange={(e) => setData("harga", e.target.value)}
                                        value={data.harga}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="total">Total</Label>
                                    <Input
                                        id="total"
                                        type="number"
                                        name="total"
                                        onChange={(e) => setData("total", e.target.value)}
                                        value={data.harga}
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
                                        onChange={(e) =>
                                            setData(
                                                "keterangan",
                                                e.target.value
                                            )
                                        }
                                        value={data.keterangan}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Menyimpan..." : "Save Produk"}
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
