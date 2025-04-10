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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Rekap, PageProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import CreatableSelect from "react-select/creatable"; // Assuming you use react-select library

interface EditRekap {
    rekapedit: Rekap;
}

const Edit = ({ rekapedit }: EditRekap) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors, reset } = useForm({
        tgl_keluar: rekapedit.tgl_keluar || "",
        tgl_kembali: rekapedit.tgl_kembali || "",
        tgl_masuk_pabrik: rekapedit.tgl_masuk_pabrik || "",
        keterangan: rekapedit.keterangan || "",
        produk_id: rekapedit.produk?.id || "",
        pelanggan_id: rekapedit.pelanggan?.id || "",
    });

    useEffect(() => {
        setData({
            ...data,
            tgl_keluar: rekapedit.tgl_keluar,
            tgl_kembali: rekapedit.tgl_kembali,
            tgl_masuk_pabrik: rekapedit.tgl_masuk_pabrik,
            keterangan: rekapedit.keterangan,
            produk_id: rekapedit.produk?.id,
            pelanggan_id: rekapedit.pelanggan?.id,
        });
    }, [rekapedit]);
    const handleDateSelect = (field: any, date: any) => {
        if (date) {
            // Set the time to noon to avoid timezone issues
            const adjustedDate = new Date(date);
            adjustedDate.setHours(12, 0, 0, 0);
            setData({ ...data, [field]: adjustedDate.toISOString().split('T')[0] });
        } else {
            setData({ ...data, [field]: "" });
        }
    };

    const { pelanggans = [], produks = [] } = usePage<PageProps>().props;

    const pelangganOptions = pelanggans.map((pelanggan) => ({
        value: String(pelanggan.id),
        label: pelanggan.nama_pelanggan,
    }));

    const produkOptions = produks.map((produk) => ({
        value: String(produk.id),
        label: produk.no_botol,
    }));

    const handlePelangganChange = (newValue: any) => {
        setData("pelanggan_id", newValue ? String(newValue.value) : "");
    };

    const handleProdukChange = (newValue: any) => {
        setData("produk_id", newValue ? String(newValue.value) : "");
    };

    const handleCreate = (inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        // Add new pelanggan or produk dynamically (if your system supports it)
        // This assumes you have some mechanism to save it to the backend.
        // Here, it's simply adding the value locally.
    };


    // const handleDateSelect = (field: 'tgl_keluar' | 'tgl_kembali' | 'tgl_masuk_pabrik', date: Date | undefined) => {
    //     if (date) {
    //         // Format the date and update the corresponding field
    //         setData(field, format(date, "yyyy-MM-dd")); // Ensure that the formatted date is passed as a string
    //     }
    // };



    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.rekap.update", rekapedit.id), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
            onError: () => {
                // Handle errors here, or use error props if available.
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline_blue" onClick={() => setOpen(true)}>
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Edit Rekap</DialogTitle>
                <DialogDescription>
                    Edit Rekap. Klik Simpan jika sudah selesai.
                </DialogDescription>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="pelanggan_id">Nama Pelanggan</Label>
                            <CreatableSelect
                                id="pelanggan_id"
                                isClearable
                                options={pelangganOptions}
                                onChange={handlePelangganChange}
                                onCreateOption={handleCreate}
                                value={pelangganOptions.find(
                                    (option) => option.value === data.pelanggan_id
                                )}
                            />
                            {errors.pelanggan_id && (
                                <p className="text-red-500 text-sm">{errors.pelanggan_id}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="produk_id">No Botol</Label>
                            <CreatableSelect
                                id="produk_id"
                                isClearable
                                options={produkOptions}
                                onChange={handleProdukChange}
                                onCreateOption={handleCreate}
                                value={produkOptions.find(
                                    (option) => option.value === data.produk_id
                                )}
                            />
                            {errors.produk_id && (
                                <p className="text-red-500 text-sm">{errors.produk_id}</p>
                            )}
                        </div>

                        {/* Date Inputs */}
                        <div className="space-y-1">
                            <Label htmlFor="tgl_keluar">Tanggal Keluar</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.tgl_keluar &&
                                            "text-muted-foreground"
                                        )}
                                    >
                                        {data.tgl_keluar
                                            ? format(
                                                new Date(data.tgl_keluar),
                                                "yyyy-MM-dd"
                                            )
                                            : "Pilih Tanggal"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.tgl_keluar
                                                ? new Date(data.tgl_keluar)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            handleDateSelect("tgl_keluar", date)
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Tanggal Kembali */}
                        <div className="space-y-1">
                            <Label htmlFor="tgl_kembali">Tanggal Kembali</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.tgl_kembali &&
                                            "text-muted-foreground"
                                        )}
                                    >
                                        {data.tgl_kembali
                                            ? format(
                                                new Date(data.tgl_kembali),
                                                "yyyy-MM-dd"
                                            )
                                            : "Pilih Tanggal"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.tgl_kembali
                                                ? new Date(data.tgl_kembali)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            handleDateSelect("tgl_kembali", date)
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Tanggal Masuk Pabrik */}
                        <div className="space-y-1">
                            <Label htmlFor="tgl_masuk_pabrik">
                                Tanggal Masuk Pabrik
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.tgl_masuk_pabrik &&
                                            "text-muted-foreground"
                                        )}
                                    >
                                        {data.tgl_masuk_pabrik
                                            ? format(
                                                new Date(data.tgl_masuk_pabrik),
                                                "yyyy-MM-dd"
                                            )
                                            : "Pilih Tanggal"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            data.tgl_masuk_pabrik
                                                ? new Date(data.tgl_masuk_pabrik)
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            handleDateSelect(
                                                "tgl_masuk_pabrik",
                                                date
                                            )
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Input
                                id="keterangan"
                                type="text"
                                name="keterangan"
                                onChange={(e) => setData("keterangan", e.target.value)}
                                value={data.keterangan}
                            />
                            {errors.keterangan && (
                                <p className="text-red-500 text-sm">{errors.keterangan}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
