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
import { PageProps, LaporanPembelian, Produk } from "@/types";
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
import CreatableSelect from "react-select/creatable";

interface EditLaporanPembelian {
    pembelianedit: LaporanPembelian;
}

const Edit = ({ pembelianedit }: EditLaporanPembelian) => {
    const [open, setOpen] = useState(false);
    const { produks = [] } = usePage<PageProps>().props;

    const produkOptions = produks.map((produk: Produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const { data, setData, put, processing, errors, reset } = useForm({
        tgl_pembelian: pembelianedit.tgl_pembelian
            ? new Date(pembelianedit.tgl_pembelian)
            : new Date(),
        nama_supplier: pembelianedit.supplier.nama_supplier || "",
        produk: pembelianedit.details.map((item) => ({
            produk_id: String(item.produk.id),
            harga: String(item.harga),
            quantity: String(item.quantity),
        })),
        keterangan: pembelianedit.keterangan || "",
        total: pembelianedit.total || 0,
    });

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
        newProduk[index].produk_id = selected ? selected.value : "";
        setData("produk", newProduk);
    };

    const handleHargaChange = (index: number, value: string) => {
        const newProduk = [...data.produk];
        newProduk[index].harga = value;
        setData("produk", newProduk);
    };

    const handleQtyChange = (index: number, value: string) => {
        const newProduk = [...data.produk];
        newProduk[index].quantity = value;
        setData("produk", newProduk);
    };

    const handleAddRow = () => {
        setData("produk", [
            ...data.produk,
            { produk_id: "", harga: "", quantity: "" },
        ]);
    };

    const handleRemoveRow = (index: number) => {
        const newProduk = [...data.produk];
        newProduk.splice(index, 1);
        setData("produk", newProduk);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setData("tgl_pembelian", date);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.laporanpembelian.update", pembelianedit.id), {
            data: {
                ...data,
                tgl_pembelian: data.tgl_pembelian.toISOString(),
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
                    <DialogTitle>Edit Laporan Pembelian</DialogTitle>
                    <DialogDescription>
                        Ubah informasi pembelian di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tanggal Pembelian</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.tgl_pembelian &&
                                            "text-muted-foreground"
                                    )}
                                >
                                    {data.tgl_pembelian
                                        ? format(
                                              data.tgl_pembelian,
                                              "yyyy-MM-dd"
                                          )
                                        : "Pilih Tanggal"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.tgl_pembelian}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Nama Supplier</Label>
                        <Input
                            value={data.nama_supplier}
                            onChange={(e) =>
                                setData("nama_supplier", e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Produk</Label>
                        {data.produk.map((item, index) => (
                            <div key={index} className="flex items-end gap-2">
                                <div className="w-full">
                                    <CreatableSelect
                                        isClearable
                                        options={produkOptions}
                                        value={produkOptions.find(
                                            (opt) =>
                                                opt.value === item.produk_id
                                        )}
                                        onChange={(val) =>
                                            handleProdukChange(index, val)
                                        }
                                    />
                                </div>
                                <Input
                                    type="number"
                                    className="w-32"
                                    placeholder="Harga"
                                    value={item.harga}
                                    onChange={(e) =>
                                        handleHargaChange(index, e.target.value)
                                    }
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
                        <Input
                            value={new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(data.total)}
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Keterangan</Label>
                        <Input
                            value={data.keterangan}
                            onChange={(e) =>
                                setData("keterangan", e.target.value)
                            }
                        />
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
