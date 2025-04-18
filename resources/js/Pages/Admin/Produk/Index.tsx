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
import { FormEventHandler } from "react";
import { produkColumns } from "./produkColumn";

interface ProdukProps {
    posts: Produk[];
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
        jenis: "",
        harga_jual: "",
    });

    console.log(data);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
        // router.post("/todos", data, {
        //     onSuccess: () => reset(),
        // });
        post(route("admin.produk.store"), {
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
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Jenis</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="jenis"
                                        onChange={(e) =>
                                            setData("jenis", e.target.value)
                                        }
                                        value={data.jenis}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Harga Jual</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="harga_jual"
                                        onChange={(e) =>
                                            setData(
                                                "harga_jual",
                                                e.target.value
                                            )
                                        }
                                        value={data.harga_jual}
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
