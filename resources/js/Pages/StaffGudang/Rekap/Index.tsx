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
import { PageProps, Rekap } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import * as React from "react";
import { DataTable } from "@/Components/DataTable";
import { rekapColumns } from "./rekapColumn";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

interface RekapProps {
    posts: Rekap[];
    pelanggans: any[];
    produks: any[];
    pesanans: any[]; // daftar pesanan yang dikirim dan belum direkap
}

const Index = ({ posts, pesanans }: RekapProps) => {
    const [date, setDate] = React.useState<Date>();

    const { data, setData, post, processing, reset } = useForm({
        pesanan_id: "",
        pelanggan_id: "",
        produk_id: "",
        nomor_tabung: "",
        tanggal_keluar: "",
        tanggal_kembali: "",
        status: "keluar", // default status
    });

    // Tambahan state di atas
    const [nomorTabungList, setNomorTabungList] = React.useState([""]);

    const handleTabungChange = (index: number, value: string) => {
        const updated = [...nomorTabungList];
        updated[index] = value;
        setNomorTabungList(updated);
    };

    const addTabungField = () => {
        setNomorTabungList([...nomorTabungList, ""]);
    };

    const removeTabungField = (index: number) => {
        if (nomorTabungList.length > 1) {
            const updated = [...nomorTabungList];
            updated.splice(index, 1);
            setNomorTabungList(updated);
        }
    };
    const pesananOptions = pesanans.map((p) => ({
        value: p.id,
        label: `${p.kode_pesanan} - ${p.pelanggan.nama_pelanggan}`,
        pelanggan_id: p.pelanggan_id,
        tgl_keluar: p.tanggal_kirim,
        produk_id: p.produk_id, // jika tersedia
    }));

    const handlePesananChange = (selected: any) => {
        setData("pesanan_id", selected?.value || "");
        setData("pelanggan_id", selected?.pelanggan_id || "");
        setData("produk_id", selected?.produk_id || "");
        setData("tgl_keluar", selected?.tgl_keluar || "");
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("staffgudang.rekap.store"), {
            data: {
                nomor_tabung: nomorTabungList, // kirim sebagai array
                tgl_keluar: data.tgl_keluar,
                tgl_kembali: data.tgl_kembali,
            },
            onSuccess: () => {
                reset();
                setNomorTabungList([""]); // reset tabung input
            },
        });
    };

    return (
        <AdminLayout>
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Data Table</TabsTrigger>
                    <TabsTrigger value="password">Tambah Data</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DataTable data={posts} columns={rekapColumns} />
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Rekap</CardTitle>
                                <CardDescription>
                                    Masukkan data rekap. Bisa otomatis dari
                                    pesanan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CardContent className="grid gap-4">
                                    <div>
                                        <Label>Pesanan</Label>
                                        <Select
                                            options={pesananOptions}
                                            onChange={handlePesananChange}
                                            placeholder="Pilih pesanan"
                                        />
                                    </div>
                                    {/* Nomor tabung dinamis */}
                                    <div>
                                        <Label>Nomor Tabung</Label>
                                        {nomorTabungList.map((value, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2 mb-2"
                                            >
                                                <Input
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleTabungChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Tabung ke-${
                                                        index + 1
                                                    }`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        removeTabungField(index)
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            onClick={addTabungField}
                                        >
                                            + Tambah Nomor Tabung
                                        </Button>
                                    </div>
                                    {/* Tanggal keluar (otomatis dari pesanan) */}
                                    <div>
                                        <Label>Tanggal Keluar</Label>
                                        <Input
                                            type="date"
                                            value={data.tgl_keluar}
                                            disabled
                                        />
                                    </div>
                                    {/* Tanggal kembali */}
                                    <div>
                                        <Label>Tanggal Kembali</Label>
                                        <Input
                                            type="date"
                                            value={data.tgl_kembali}
                                            onChange={(e) =>
                                                setData(
                                                    "tgl_kembali",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {/* Status */}
                                    <div>
                                        <Label>Status</Label>
                                        <Select
                                            value={{
                                                value: data.status,
                                                label: data.status,
                                            }}
                                            onChange={(option) =>
                                                setData(
                                                    "status",
                                                    option?.value || ""
                                                )
                                            }
                                            options={[
                                                {
                                                    value: "keluar",
                                                    label: "Keluar",
                                                },
                                                {
                                                    value: "kembali",
                                                    label: "Kembali",
                                                },
                                            ]}
                                        />
                                    </div>
                                </CardContent>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={processing}>
                                    Save Rekap
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
