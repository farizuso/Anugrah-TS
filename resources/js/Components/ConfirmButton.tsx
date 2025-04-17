// resources/js/Components/ConfirmButton.tsx
import React from "react";
import Swal from "sweetalert2";
import { Button } from "./ui/button";
import { router } from "@inertiajs/react";

interface ConfirmButtonProps {
    routeName: string;
    routeParams?: any;
    children?: React.ReactNode;
    title?: string;
    text?: string;
    confirmText?: string;
    onSuccess?: () => void;
    onError?: () => void;
}

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
    routeName,
    routeParams,
    children = "Konfirmasi",
    title = "Konfirmasi Laporan?",
    text = "Apakah Anda yakin ingin mengonfirmasi laporan ini?",
    confirmText = "Ya, Konfirmasi",
    onSuccess,
    onError,
}) => {
    const handleClick = () => {
        Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: "Batal",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(
                    route(routeName, routeParams),
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Sukses!",
                                text: "Laporan berhasil dikonfirmasi.",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                            onSuccess?.();
                        },
                        onError: () => {
                            Swal.fire(
                                "Oops!",
                                "Terjadi kesalahan saat konfirmasi.",
                                "error"
                            );
                            onError?.();
                        },
                    }
                );
            }
        });
    };

    return (
        <Button variant="default" onClick={handleClick}>
            {children}
        </Button>
    );
};
