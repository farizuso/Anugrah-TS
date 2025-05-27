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
import { DataTable } from "@/Components/DataTable";
import { PageProps, Produk } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { produkColumns } from "./produkColumn";
import { toast } from "react-toastify";

interface ProdukProps {
    posts: Produk[];
    defaultTab?: string;
}

const TabsDemo = ({ posts }: ProdukProps) => {
    const flash = usePage<PageProps>().props.flash;
    console.log(flash.success);

    const {
        delete: destroy,
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        nama_produk: "",
        simbol: "",
        kategori: "",
        harga_jual: "",
    });

    console.log(data);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("admin.produk.store"), {
            onSuccess: () => reset(),
        });
    };

    const [formattedHarga, setFormattedHarga] = useState("");

    // Format ke rupiah
    const formatRupiah = (value: string | number) => {
        const number =
            typeof value === "string" ? value.replace(/\D/g, "") : value;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(number));
    };

    useEffect(() => {
        setFormattedHarga(formatRupiah(data.harga_jual));
    }, [data.harga_jual]);

    return (
        <AdminLayout>
            {/* ubah kembali deafultvalue ke account */}
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Data Table</TabsTrigger>
                    <TabsTrigger value="password">Tambah Data</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DataTable data={posts} columns={produkColumns} />
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Produk</CardTitle>
                                <CardDescription>
                                    Masukkan data produk.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="new">Nama Produk</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="nama_produk"
                                        onChange={(e) =>
                                            setData(
                                                "nama_produk",
                                                e.target.value
                                            )
                                        }
                                        value={data.nama_produk}
                                        placeholder="Masukkan nama produk"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Simbol</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="simbol"
                                        onChange={(e) =>
                                            setData("simbol", e.target.value)
                                        }
                                        value={data.simbol}
                                        placeholder="Masukkan simbol"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Kategori</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="kategori"
                                        onChange={(e) =>
                                            setData("kategori", e.target.value)
                                        }
                                        value={data.kategori}
                                        placeholder="Masukkan kategori produk"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="harga_jual">
                                        Harga Jual
                                    </Label>
                                    <Input
                                        id="harga_jual"
                                        type="text"
                                        name="harga_jual"
                                        value={formattedHarga}
                                        onChange={(e) => {
                                            const rawValue =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setData("harga_jual", rawValue);
                                            setFormattedHarga(
                                                formatRupiah(rawValue)
                                            );
                                        }}
                                        placeholder="Contoh: Rp 120.000"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Simpan Data Produk</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
};

export default TabsDemo;
