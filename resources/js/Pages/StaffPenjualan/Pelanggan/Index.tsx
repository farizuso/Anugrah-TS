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
import { PageProps, Pelanggan, Produk } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { pelangganColumns } from "./pelangganColumn";

interface PelangganProps {
    posts: Pelanggan[];
}

const TabsDemo = ({ posts }: PelangganProps) => {
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
        nama_pelanggan: "",
        alamat: "",
        no_hp: "",
    });

    console.log(data);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
        // router.post("/todos", data, {
        //     onSuccess: () => reset(),
        // });
        post(route("staffpenjualan.pelanggan.store"), {
            onSuccess: () => reset(),
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
                    <DataTable data={posts} columns={pelangganColumns} />
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Pelanggan</CardTitle>
                                <CardDescription>
                                    Masukkan data Pelanggan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">
                                        Nama Pelanggan
                                    </Label>
                                    <Input
                                        id="current"
                                        type="text"
                                        name="nama_pelanggan"
                                        onChange={(e) =>
                                            setData(
                                                "nama_pelanggan",
                                                e.target.value
                                            )
                                        }
                                        value={data.nama_pelanggan}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Alamat</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="alamat"
                                        onChange={(e) =>
                                            setData("alamat", e.target.value)
                                        }
                                        value={data.alamat}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">No Hp Aktif</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="no_hp"
                                        onChange={(e) =>
                                            setData("no_hp", e.target.value)
                                        }
                                        value={data.no_hp}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Produk</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
};

export default TabsDemo;
