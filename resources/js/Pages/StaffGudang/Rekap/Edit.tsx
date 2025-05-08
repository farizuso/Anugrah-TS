import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Rekap } from "@/types";
import { useForm } from "@inertiajs/react";
import * as React from "react";
import { BsPencilSquare } from "react-icons/bs";

interface EditProps {
    rekapedit: Rekap;
}

const Edit = ({ rekapedit }: EditProps) => {
    const [open, setOpen] = React.useState(false);

    const { data, setData, put, processing, errors } = useForm({
        nomor_tabung: rekapedit.nomor_tabung ?? "",
        status: rekapedit.status,
        tanggal_kembali: rekapedit.tanggal_kembali ?? "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("staffgudang.rekap.update", rekapedit.id), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline_blue" size="sm">
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Rekap</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label>Nomor Tabung</Label>
                        <Input
                            type="text"
                            value={data.nomor_tabung}
                            onChange={(e) =>
                                setData("nomor_tabung", e.target.value)
                            }
                        />
                        {errors.nomor_tabung && (
                            <p className="text-sm text-red-600">
                                {errors.nomor_tabung}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Tanggal Kembali</Label>
                        <Input
                            type="date"
                            value={data.tanggal_kembali}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("tanggal_kembali", value);
                                if (value) {
                                    setData("status", "kembali");
                                }
                            }}
                        />

                        {errors.tanggal_kembali && (
                            <p className="text-sm text-red-600">
                                {errors.tanggal_kembali}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
