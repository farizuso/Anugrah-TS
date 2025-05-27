import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Produk } from "@/types";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

interface EditProduk {
    produkedit: Produk;
}

const Edit = ({ produkedit }: EditProduk) => {
    const [open, setOpen] = useState(false);

    const { put, data, setData, processing, errors } = useForm({
        nama_produk: produkedit.nama_produk,
        simbol: produkedit.simbol,
        kategori: produkedit.kategori,
        harga_jual: produkedit.harga_jual,
    });

    useEffect(() => {
        setData({
            nama_produk: produkedit.nama_produk,
            simbol: produkedit.simbol,
            kategori: produkedit.kategori,
            harga_jual: produkedit.harga_jual,
        });
    }, [produkedit]);

    const submit = (e: any) => {
        e.preventDefault();
        put(route("admin.produk.update", produkedit.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const [formattedHarga, setFormattedHarga] = useState("");

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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline_blue"
                    onClick={() => setOpen(true)}
                >
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Produk</DialogTitle>
                    <DialogDescription>
                        Ubah data produk di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-5 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nama_produk">Nama Produk</Label>
                        <Input
                            id="nama_produk"
                            name="nama_produk"
                            value={data.nama_produk}
                            onChange={(e) =>
                                setData("nama_produk", e.target.value)
                            }
                            placeholder="Masukkan nama produk"
                        />
                        {errors.nama_produk && (
                            <p className="text-sm text-red-500">
                                {errors.nama_produk}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="simbol">Simbol</Label>
                        <Input
                            id="simbol"
                            name="simbol"
                            value={data.simbol}
                            onChange={(e) => setData("simbol", e.target.value)}
                            placeholder="Masukkan simbol produk"
                        />
                        {errors.simbol && (
                            <p className="text-sm text-red-500">
                                {errors.simbol}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="kategori">Kategori</Label>
                        <Input
                            id="kategori"
                            name="kategori"
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                            placeholder="Masukkan kategori produk"
                        />
                        {errors.kategori && (
                            <p className="text-sm text-red-500">
                                {errors.kategori}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="harga_jual">Harga Jual</Label>
                        <Input
                            id="harga_jual"
                            name="harga_jual"
                            type="text"
                            value={formattedHarga}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                    /\D/g,
                                    ""
                                );
                                setData("harga_jual", parseInt(rawValue) || 0);
                                setFormattedHarga(formatRupiah(rawValue));
                            }}
                            placeholder="Contoh: Rp 120.000"
                        />
                        {errors.harga_jual && (
                            <p className="text-sm text-red-500">
                                {errors.harga_jual}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
