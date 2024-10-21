import { FormEventHandler } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import useLocalStorage from "use-local-storage";
// import logo from "../../../assets/img/logo.png";
// import {Link} from "react-router-dom";

export default function backup() {
    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="flex flex-col gap-2 w-full justify-center items-center px-5 max-w-md">
                {/* <img className="w-50" src={logo} /> */}
                <p className="text-xl font-bold">Login Admin</p>
            </div>
        </GuestLayout>
    );
}
