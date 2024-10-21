import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs"
import { DataTable } from "@/Components/DataTable"
import { PageProps, Pelanggan, Produk, Stok } from '@/types'
import AdminLayout from "@/Layouts/AdminLayout"
import { useForm, usePage } from "@inertiajs/react"
import React, { FormEventHandler } from "react"
import { stokColumns } from "./stokColumn"
import CreatableSelect from "react-select/creatable";

interface StokProps {
    posts: Stok[];
}

const Index = ({ posts }: StokProps) => {
    const flash = usePage<PageProps>().props.flash;
    console.log(flash.success);

    // Data form sesuai field yang ada di tabel
    const { delete: destroy, data, setData, post, processing, errors, reset } = useForm({
       produk_id: "", // Ubah dari 'nama_produk' ke 'produk_id'
       lokasi_penyimpanan: "",
       jumlah_stok: "",
       minimum_stok: "",
    //    tgl_update_stok: "", // Jika field ini otomatis, bisa dihilangkan
    });

    console.log(data);

    const { produks = [] } = usePage<PageProps>().props;

    // State to store produk options
    const [produkOptions, setProdukOptions] = React.useState(
        produks?.map((produk) => ({
            value: String(produk.id),
            label: produk.nama_produk,
        })) || []
    );

    const handleProdukChange = (newValue: any) => {
        setData("produk_id", newValue ? String(newValue.value) : ""); // Ubah ke 'produk_id'
    };

    const handleCreate = (inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        setProdukOptions([...produkOptions, newOption]);
        setData("produk_id", inputValue); // Ubah ke 'produk_id'
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.stok.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleDateSelect = (field: any, date: any) => {
        if (date) {
            const adjustedDate = new Date(date);
            adjustedDate.setHours(12, 0, 0, 0);
            setData({
                ...data,
                [field]: adjustedDate.toISOString().split("T")[0],
            });
        } else {
            setData({ ...data, [field]: "" });
        }
    };

    return (
        <AdminLayout>
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Data Table</TabsTrigger>
                    <TabsTrigger value="password">Tambah Data Stok</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DataTable data={posts} columns={stokColumns} />
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Stok</CardTitle>
                                <CardDescription>
                                    Masukkan data Stok.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="produk_id">
                                        Nama Produk
                                    </Label>
                                    <CreatableSelect
                                        id="produk_id"
                                        isClearable
                                        options={produkOptions}
                                        onChange={handleProdukChange}
                                        onCreateOption={handleCreate}
                                        value={produkOptions.find(
                                            (option) =>
                                                option.value === data.produk_id // Sesuaikan dengan 'produk_id'
                                        )}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="lokasi_penyimpanan">Lokasi Penyimpanan</Label>
                                    <Input
                                        id="lokasi_penyimpanan"
                                        type="text"
                                        name="lokasi_penyimpanan"
                                        onChange={(e) => setData("lokasi_penyimpanan", e.target.value)}
                                        value={data.lokasi_penyimpanan}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="jumlah_stok">Jumlah Stok</Label>
                                    <Input
                                        id="jumlah_stok"
                                        type="number" // Ubah ke number
                                        name="jumlah_stok"
                                        onChange={(e) => setData("jumlah_stok", e.target.value)}
                                        value={data.jumlah_stok}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="minimum_stok">Minimum Stok</Label>
                                    <Input
                                        id="minimum_stok"
                                        type="number" // Ubah ke number
                                        name="minimum_stok"
                                        onChange={(e) => setData("minimum_stok", e.target.value)}
                                        value={data.minimum_stok}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Save Produk</Button> {/* Pastikan ada tipe submit */}
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}

export default Index;
