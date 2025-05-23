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
import { Pelanggan, Produk } from "@/types";
// import { Todo, TodoWithMethod } from "@/types"
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

interface EditPelanggan {
    pelangganedit: Pelanggan;
}
const Edit = ({ pelangganedit }: EditPelanggan) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, post, processing, errors, reset } = useForm({
        nama_pelanggan: pelangganedit.nama_pelanggan,
        alamat: pelangganedit.alamat,
        no_hp: pelangganedit.no_hp,
    });

    useEffect(() => {
        setData({
            ...data,
            nama_pelanggan: pelangganedit.nama_pelanggan,
            alamat: pelangganedit.alamat,
            no_hp: pelangganedit.no_hp,
        });
    }, [pelangganedit]);
    console.log(pelangganedit);
    const submit = (e: any) => {
        e.preventDefault();
        put(route("staffpenjualan.pelanggan.update", [pelangganedit]));
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline_blue"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Edit Data Pelanggan</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi data pelanggan dibawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="nama_pelanggan"
                                className="text-right"
                            >
                                Nama Pelanggan
                            </Label>
                            <Input
                                id="nama_pelanggan"
                                className="col-span-3"
                                name="nama_pelanggan"
                                value={data.nama_pelanggan}
                                onChange={(e) =>
                                    setData("nama_pelanggan", e.target.value)
                                }
                                placeholder="Masukkan nama pelanggan"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alamat" className="text-right">
                                Alamat
                            </Label>
                            <Input
                                id="alamat"
                                className="col-span-3"
                                name="alamat"
                                value={data.alamat}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                placeholder="Masukkan alamat"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="no_hp" className="text-right">
                                No. HP
                            </Label>
                            <Input
                                id="no_hp"
                                className="col-span-3"
                                name="no_hp"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={data.no_hp}
                                onChange={(e) =>
                                    setData(
                                        "no_hp",
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                placeholder="Masukkan no_hp"
                            />
                            {errors.no_hp && (
                                <p className="text-sm text-red-600">
                                    {errors.no_hp}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default Edit;
