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
import { Pesanan, Rekap } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import * as React from "react";
import { DataTable } from "@/Components/DataTable";
import { rekapColumns } from "./rekapColumn";
import { CommandCombobox } from "@/Components/ui/CommandCombobox";

interface RekapProps {
    rekaps: Rekap[];
    pesanans: Pesanan[];
}

const Index = ({ rekaps, pesanans }: RekapProps) => {
    // console.log(rekaps);
    const { data, setData, post, processing, reset, errors } = useForm<{
        pesanan_id: number | null; // Correct way to define pesanan_id as a number or null
        status: string;
        tabung_per_produk: {
            produk_id: number;
            produk_nama: string;
            tabung: string[];
        }[];
    }>({
        pesanan_id: null, // Initialize with null
        status: "keluar",
        tabung_per_produk: [],
    });

    const handlePesananChange = (val: string) => {
        const id = parseInt(val);
        if (isNaN(id)) return;

        const selected = pesanans.find((p) => p.id === id);
        if (!selected) return;

        setData("pesanan_id", selected.id as any);

        // console.log(selected);

        const produkList = selected.details.map((d) => ({
            produk_id: d.produk.id, // yang benar
            produk_nama: d.produk.nama_produk,
            tabung: Array(d.quantity).fill(""),
        }));
            console.log(produkList);
            console.log(selected.details),


        setData("tabung_per_produk", produkList);
    };

    const handleTabungChange = (
        indexProduk: number,
        indexTabung: number,
        value: string
    ) => {
        const updated = [...data.tabung_per_produk];
        updated[indexProduk].tabung[indexTabung] = value;
        setData("tabung_per_produk", updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        post(route("staffgudang.rekap.store"), {
            data,
            onSuccess: () => {
                reset("pesanan_id", "status", "tabung_per_produk");
                setData("pesanan_id", null); // pastikan kembali ke null, bukan undefined
            },
        });
    };

    const selectedPesanan = pesanans?.find((p) => p.id === data.pesanan_id);

    return (
        <AdminLayout>
            {/* ubah defultValue menjadi account */}
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Data Table</TabsTrigger>
                    <TabsTrigger value="form">Tambah Data</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <DataTable data={rekaps} columns={rekapColumns} />
                </TabsContent>

                <TabsContent value="form">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Rekap</CardTitle>
                                <CardDescription>
                                    Masukkan data rekap tabung berdasarkan
                                    pesanan dan produk.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Pesanan</Label>
                                    <CommandCombobox
                                        options={pesanans.map((p) => ({
                                            label: `${
                                                p.nomor_invoice ?? `#${p.id}`
                                            } - ${
                                                p.pelanggan?.nama_pelanggan ??
                                                "-"
                                            }`,
                                            value: p.id.toString(),
                                        }))}
                                        value={
                                            data.pesanan_id?.toString() ?? ""
                                        }
                                        onValueChange={handlePesananChange}
                                        placeholder="Pilih pesanan"
                                    />
                                </div>

                                {data.pesanan_id && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Pelanggan</Label>
                                                <Input
                                                    value={
                                                        selectedPesanan
                                                            ?.pelanggan
                                                            .nama_pelanggan ??
                                                        ""
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <Label>Produk</Label>
                                                <Input
                                                    value={
                                                        Array.isArray(
                                                            selectedPesanan?.details
                                                        )
                                                            ? selectedPesanan.details
                                                                  .map(
                                                                      (d) =>
                                                                          d
                                                                              .produk
                                                                              .nama_produk
                                                                  )
                                                                  .join(", ")
                                                            : ""
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Status</Label>
                                            <select
                                                className="w-full border px-3 py-2 rounded-md"
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="keluar">
                                                    Keluar
                                                </option>
                                            </select>
                                        </div>

                                        {data.tabung_per_produk.map(
                                            (produk, i) => (
                                                <div
                                                    key={produk.produk_id}
                                                    className="mb-4 p-4 border rounded"
                                                >
                                                    <h2 className="font-bold mb-2">
                                                        {produk.produk_nama}
                                                    </h2>
                                                    {produk.tabung.map(
                                                        (val, j) => (
                                                            <div
                                                                key={`pesanan-${data.pesanan_id}-produk-${produk.produk_id}-tabung-${j}`}
                                                                className="mb-2"
                                                            >
                                                                
                                                                <Label>
                                                                    Tabung #
                                                                    {j + 1}
                                                                </Label>
                                                                <Input
                                                                    value={val}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleTabungChange(
                                                                            i,
                                                                            j,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={processing}>
                                    Simpan Rekap
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
};

export default Index;
