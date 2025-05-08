import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Button } from "./ui/button";
import { Rekap } from "@/types";

const ConfirmReturn = ({ rekap }: { rekap: Rekap }) => {
    const handleConfirm = () => {
        Swal.fire({
            title: "Konfirmasi Pengembalian",
            text: "Apakah Anda yakin ingin mengonfirmasi pengembalian tabung ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, konfirmasi",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route("staffgudang.rekap.konfirmasi-kembali", {
                        id: rekap.id,
                    }),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil!",
                                text: "Tabung berhasil dikonfirmasi kembali.",
                            });

                            // Pastikan nama props sesuai dengan controller
                            router.reload({ only: ["rekaps"] });
                        },
                        onError: () => {
                            Swal.fire({
                                icon: "error",
                                title: "Gagal!",
                                text: "Terjadi kesalahan saat mengonfirmasi.",
                            });
                        },
                    }
                );
            }
        });
    };

    // Sembunyikan tombol jika sudah kembali
    if (rekap.status === "kembali") return null;

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={handleConfirm}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
            Konfirmasi Kembali
        </Button>
    );
};

export default ConfirmReturn;
