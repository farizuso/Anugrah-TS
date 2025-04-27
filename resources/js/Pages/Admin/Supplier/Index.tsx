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
import { PageProps, Pelanggan, Produk, Supplier } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler } from "react";
import { SupplierColumns } from "./SupplierColumn";
import CreatableSelect from "react-select/creatable";

interface SupplierProps {
    posts: Supplier[];
}

const Index = ({ posts }: SupplierProps) => {
    const flash = usePage<PageProps>().props.flash;
    console.log(flash.success);

    // Data form sesuai field yang ada di tabel
    const {
        delete: destroy,
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        nama_supplier: "",
        alamat: "",
        no_telp: "",
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.supplier.store"), {
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
                    <TabsTrigger value="password">
                        Tambah Data Supplier
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DataTable data={posts} columns={SupplierColumns} />
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <form onSubmit={submit}>
                            <CardHeader>
                                <CardTitle>Tambah Data Supplier</CardTitle>
                                <CardDescription>
                                    Masukkan data Supplier.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="new">Nama Supplier</Label>
                                    <Input
                                        id="new"
                                        type="text"
                                        name="nama_supplier"
                                        onChange={(e) =>
                                            setData(
                                                "nama_supplier",
                                                e.target.value
                                            )
                                        }
                                        value={data.nama_supplier}
                                        placeholder="Masukkan Nama Supplier"
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
                                        placeholder="Masukkan Alamat"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">No_Telp</Label>
                                    <Input
                                        id="no_telp"
                                        className="col-span-3"
                                        name="no_telp"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={data.no_telp}
                                        onChange={(e) =>
                                            setData(
                                                "no_telp",
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="Masukkan no_telp"
                                    />
                                    {errors.no_telp && (
                                        <p className="text-sm text-red-600">
                                            {errors.no_telp}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Simpan Data Supplier</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
};
export default Index;
