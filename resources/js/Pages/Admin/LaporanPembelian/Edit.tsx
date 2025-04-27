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
import { PageProps, LaporanPembelian, Produk, Supplier } from "@/types";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface EditLaporanPembelian {
    pembelianedit: LaporanPembelian;
}

const Edit = ({ pembelianedit }: EditLaporanPembelian) => {
    const [open, setOpen] = useState(false);
    const { produks = [], suppliers = [] } = usePage<PageProps>().props;

    const produkOptions = produks.map((produk: Produk) => ({
        value: String(produk.id),
        label: produk.nama_produk,
    }));

    const supplierOptions = suppliers.map((supplier: Supplier) => ({
        value: String(supplier.id),
        label: supplier.nama_supplier,
    }));

    const { data, setData, put, processing, errors, reset } = useForm({
        tgl_pembelian: pembelianedit.tgl_pembelian
            ? new Date(pembelianedit.tgl_pembelian)
            : new Date(),
        supplier_id: pembelianedit.supplier.id
            ? String(pembelianedit.supplier.id)
            : "",
        produk: pembelianedit.details.map((item) => ({
            produk_id: String(item.produk.id),
            harga: String(item.harga),
            quantity: String(item.quantity),
        })),
        keterangan: pembelianedit.keterangan || "",
        total: pembelianedit.total || 0,
    });

    const [selectedSupplier, setSelectedSupplier] = useState<any>(
        supplierOptions.find((opt) => opt.value === data.supplier_id) || null
    );

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

    const formatRupiah = (number: number): string =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

    const formatRupiahInput = (value: string): string => {
        const numberString = value.replace(/[^,\d]/g, "");
        const split = numberString.split(",");
        let sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
        return rupiah ? "Rp " + rupiah : "";
    };

    const parseRupiahToNumber = (value: string): string => {
        return value.replace(/[^0-9]/g, "");
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
                        <CreatableSelect
                            isClearable
                            options={supplierOptions}
                            onChange={(option) => {
                                setSelectedSupplier(option);
                                setData("supplier_id", option?.value || "");
                            }}
                            value={selectedSupplier}
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
                                    type="text"
                                    placeholder="Harga"
                                    className="w-32"
                                    value={formatRupiahInput(item.harga)}
                                    onChange={(e) =>
                                        handleHargaChange(
                                            index,
                                            parseRupiahToNumber(e.target.value)
                                        )
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
                        <Input value={formatRupiah(data.total)} disabled />
                    </div>

                    <div>
                        <Label className="mb-1 block">
                            Keterangan Pembayaran
                        </Label>
                        <Select
                            defaultValue={data.keterangan || ""}
                            onValueChange={(value) =>
                                setData("keterangan", value)
                            }
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Lunas">Lunas</SelectItem>
                                <SelectItem value="Belum Lunas">
                                    Belum Lunas
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.keterangan && (
                            <p className="text-sm text-red-500">
                                {errors.keterangan}
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
