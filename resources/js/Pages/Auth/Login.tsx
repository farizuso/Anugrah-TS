import { FormEventHandler } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm, Link } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import useLocalStorage from "use-local-storage";
import logo from "../../../assets/img/logo.png";
import Checkbox from "@/Components/Checkbox";

// import {Link} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useLocalStorage("email", "");
    const [password, setPassword] = useLocalStorage("password", "");
    const [rememberMe, setRememberMe] = useLocalStorage("rememberMe", false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email || "",
        password: password || "",
        remember: rememberMe,
    });

    // console.log(errors.email);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onError: () => reset("password"),
        });
        const rememberMeCheckbox = document.getElementById(
            "terms"
        ) as HTMLInputElement;
        if (rememberMeCheckbox.checked) {
            setEmail(data.email);
            setPassword(data.password);
            setRememberMe(true);
        } else {
            setEmail("");
            setPassword("");
            setRememberMe(false);
        }
    };

    return (
        // <GuestLayout>
        // <Head title="Log in" />
        <GuestLayout>
            <div className="flex flex-col gap-2 w-full justify-center items-center px-5 max-w-md">
                <img className="w-50" src={logo} />
                <p className="text-xl font-bold">Login User</p>
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-5 lg:mt-1 shadow-sm mt-5 p-5 bg-white border border-gray-300 rounded-lg w-full"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            autoComplete="none"
                            name="email"
                            id="email"
                            type="email"
                            placeholder="JhonDoe@gmail.com"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError message={errors.password} />
                    </div>{" "}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={data.remember}
                            name="remember"
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <Label htmlFor="terms" className="cursor-pointer">
                            Ingat Saya
                        </Label>
                    </div>
                    <Button
                        disabled={processing}
                        type="submit"
                        variant={"blue"}
                    >
                        Sign in
                    </Button>
                    <Link
                        className="text-blue-500 text-center underline"
                        href="/register"
                    >
                        Register
                    </Link>
                </form>
            </div>
        </GuestLayout>
    );
}
