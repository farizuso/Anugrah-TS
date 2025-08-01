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
import { PageProps, Produk, Pesanan } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CommandCombobox } from "@/Components/ui/CommandCombobox";

interface EditPesanan {
    pesananedit: Pesanan;
}

const Edit = ({ pesananedit }: EditPesanan) => {
    const [open, setOpen] = useState(false);
    const { produks = [], pelanggans = [] } = usePage<PageProps>().props;

    const produkOptions = produks.map((produk: Produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const pelangganOptions = pelanggans.map((pel) => ({
        value: String(pel.id),
        label: pel.nama_pelanggan,
    }));

    const { data, setData, put, processing, errors, reset } = useForm({
        tgl_pesanan: pesananedit.tgl_pesanan
            ? new Date(pesananedit.tgl_pesanan)
            : new Date(),
        pelanggan_id: String(pesananedit.pelanggan.id) || "",
        produk: pesananedit.details.map((item) => ({
            produk_id: String(item.produk.id),
            harga: String(item.harga),
            quantity: String(item.quantity),
            tipe_item: item.tipe_item || "jual",
            durasi: item.durasi || 0,
        })),
        keterangan: pesananedit.keterangan || "",
        total: pesananedit.total || 0,
    });

    const formatRupiah = (number: number): string =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

    useEffect(() => {
        const total = data.produk.reduce((sum, p) => {
            const harga = parseFloat(p.harga) || 0;
            const qty = parseFloat(p.quantity) || 0;
            return sum + harga * qty;
        }, 0);
        setData("total", total);
    }, [data.produk]);

    const handleProdukChange = (index: number, selected: any) => {
        const newProduk = [...data.produk];
        if (selected) {
            newProduk[index].produk_id = selected.value;
            const selectedProduk = produks.find(
                (p) => String(p.id) === selected.value
            );
            if (selectedProduk) {
                const hargaGas = selectedProduk.harga_jual || 0;
                if (newProduk[index].tipe_item === "sewa") {
                    const durasi = newProduk[index].durasi || 1;
                    newProduk[index].harga = String(hargaGas + 100000 * durasi);
                } else {
                    newProduk[index].harga = String(hargaGas);
                }
            }
        } else {
            newProduk[index].produk_id = "";
            newProduk[index].harga = "";
        }
        setData("produk", newProduk);
    };

    const handleQtyChange = (index: number, value: string) => {
        const newProduk = [...data.produk];
        newProduk[index].quantity = value;
        setData("produk", newProduk);
    };

    const handleTipeChange = (index: number, value: string) => {
        const newProduk = [...data.produk];
        newProduk[index].tipe_item = value;
        const produk = produks.find(
            (p) => String(p.id) === newProduk[index].produk_id
        );
        const hargaGas = produk?.harga_jual || 0;
        if (value === "sewa") {
            const durasi = newProduk[index].durasi || 1;
            newProduk[index].harga = String(hargaGas + 100000 * durasi);
            newProduk[index].durasi = durasi;
        } else {
            newProduk[index].harga = String(hargaGas);
            newProduk[index].durasi = 0;
        }
        setData("produk", newProduk);
    };

    const handleDurasiChange = (index: number, value: string) => {
        const durasi = parseInt(value) || 1;
        const newProduk = [...data.produk];
        newProduk[index].durasi = durasi;
        const produk = produks.find(
            (p) => String(p.id) === newProduk[index].produk_id
        );
        const hargaGas = produk?.harga_jual || 0;
        newProduk[index].harga = String(hargaGas + 100000 * durasi);
        setData("produk", newProduk);
    };

    const handleAddRow = () => {
        setData("produk", [
            ...data.produk,
            {
                produk_id: "",
                harga: "",
                quantity: "",
                tipe_item: "jual",
                durasi: 0,
            },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        const newProduk = [...data.produk];
        newProduk.splice(index, 1);
        setData("produk", newProduk);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setData("tgl_pesanan", date);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("staffpenjualan.pesanan.update", pesananedit.id), {
            data: {
                ...data,
                tgl_pesanan: data.tgl_pesanan.toISOString(),
            },
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline_blue" size="sm">
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Pesanan</DialogTitle>
                    <DialogDescription>
                        Perbarui informasi pesanan di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
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
                                    {data.tgl_pesanan
                                        ? format(data.tgl_pesanan, "yyyy-MM-dd")
                                        : "Pilih Tanggal"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.tgl_pesanan}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Nama Pelanggan</Label>
                        <CommandCombobox
                            options={pelangganOptions}
                            value={data.pelanggan_id}
                            onValueChange={(value) =>
                                setData("pelanggan_id", value)
                            }
                            placeholder="Pilih Supplier"
                            searchPlaceholder="Cari Supplier..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Produk</Label>
                        {data.produk.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-end gap-2 flex-wrap"
                            >
                                <div className="w-full sm:w-48">
                                    <CommandCombobox
                                        options={produkOptions}
                                        value={item.produk_id}
                                        onValueChange={(value) =>
                                            handleProdukChange(index, { value })
                                        }
                                        placeholder="Pilih Produk"
                                        searchPlaceholder="Cari produk..."
                                    />
                                </div>

                                <select
                                    className="border rounded px-2 py-1"
                                    value={item.tipe_item}
                                    onChange={(e) =>
                                        handleTipeChange(index, e.target.value)
                                    }
                                >
                                    <option value="jual">Jual</option>
                                    <option value="sewa">Sewa</option>
                                </select>

                                {item.tipe_item === "sewa" && (
                                    <Input
                                        type="number"
                                        placeholder="Durasi (bln)"
                                        className="w-28"
                                        value={item.durasi}
                                        onChange={(e) =>
                                            handleDurasiChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                )}

                                <Input
                                    type="text"
                                    placeholder="Harga"
                                    className="w-32"
                                    value={formatRupiah(Number(item.harga))}
                                    readOnly
                                />

                                <Input
                                    type="number"
                                    className="w-24"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        handleQtyChange(index, e.target.value)
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveRow(index)}
                                    disabled={data.produk.length === 1}
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
                    </div>

                    <div>
                        <Label>Total</Label>
                        <Input value={formatRupiah(data.total)} disabled />
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
