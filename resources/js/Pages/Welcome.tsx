import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout"
import UserLayout from "@/Layouts/UserLayout"
import "../../css/welcome.css";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel"
import { Button } from "@/Components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import mobil from "../../assets/img/mobil.jpg";
import ngeng from "../../assets/img/TTop.jpg";
import gtr from "../../assets/img/GTR.jpeg"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { IconDashboard, IconGrid4, IconMoonStar, IconNotepad, IconNotes, IconPerson, IconSettings, IconStar, IconStarFill } from '@irsyadadl/paranoid';

export default function Welcome() {
    return (
        <>
            <UserLayout>
                <Head title="Welcome" />
                <div className="flex flex-col gap-7">
                    <div className="bg-image flex items-center justify-center w-full h-screen md:h-[80vh]">
                        <div className="text-white font-black text-4xl">
                            SUPPLIER GAS
                        </div>
                    </div>
                    <div className="flex container items-center justify-center">
                        <Carousel className=" max-w-full items-center justify-center">
                            <CarouselContent className="-ml-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                                        <div className="p-1">
                                            <Card className="w-[300px]">
                                                <CardHeader>
                                                    <CardTitle>Produk</CardTitle>
                                                    <CardDescription>Ekspresikan Produkmu Disini!!</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid w-full items-center gap-4">
                                                        <div className="flex flex-col space-y-1.5">
                                                            <img src={mobil} alt="" />
                                                        </div>
                                                        <div className="flex flex-col space-y-1.5">
                                                            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, eos?</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="w-full">
                                                    <Button>learn more....</Button>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                    <div className=" h-auto lg:mx-5 mx-2 flex flex-col lg:flex-row mb-7">
                        <div className=" flex flex-grow w-full lg:w-1/2 w-100 justify-center lg:justify-end lg:pr-10 items-center">
                            <div className="lg:w-3/4 bg-slate-200 w-full h-auto lg:h-full flex justify-center p-3 rounded-3xl shadow-inner">
                                <div className="bg-konten flex justify-center items-center w-full shadow-md rounded-3xl h-96 lg:h-full">
                                    {/* <img src={gtr} /> */}
                                </div>
                            </div>
                        </div>
                        <div className=" flex flex-grow w-full lg:w-1/2 justify-center lg:justify-start lg:pl-10">
                            <div className="w-full lg:w-3/4">
                                <div className="lg:mt-0 mt-7 why-choose-us ">
                                    <div className="container mx-auto px-4">
                                        <h1 className="text-sm text-amber-500 font-bold text-start">Why Choose Us</h1>
                                        <div className="flex flex-col items-start">
                                            <p className="text-3xl lg:mt-1 font-black text-gray-700">Experience That We Promise To You</p>
                                            <p className="text-sm lg:mt-5 text-gray-500">
                                                We are always ready to serve by providing the best service for you. We make good choices to travel around the world.
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:grid-cols-4 gap-7 mt-8">
                                            <div className="why-choose-us-item border-2 bg-white p-4 rounded shadow-md flex items-center space-x-2">
                                                <IconNotepad className="text-sky-600" />
                                                <h3 className="text-xl font-bold text-gray-700">Best Place In The World</h3>
                                                {/* <p className="text-gray-500">Explore the most beautiful destinations on earth.</p> */}
                                                {/* <IconStarFill className="justify-end"/> */}
                                            </div>
                                            <div className="why-choose-us-item border-2 bg-white p-4 rounded shadow-md flex items-center space-x-2">
                                                <IconNotepad className="text-sky-600" />
                                                <h3 className="text-xl font-bold text-gray-700">Affordable price for you</h3>
                                                {/* <p className="text-gray-500">Get the best travel deals without breaking the bank.</p> */}
                                            </div>
                                            <div className="why-choose-us-item border-2 bg-white p-4 rounded shadow-md flex items-center space-x-2">
                                                <IconNotepad className="text-sky-600" />
                                                <h3 className="text-xl font-bold text-gray-700">Best plan for your time</h3>
                                                {/* <p className="text-gray-500">We create itineraries that maximize your experience.</p> */}
                                            </div>
                                            <div className="why-choose-us-item border-2 bg-white p-4 rounded shadow-md flex items-center space-x-2">
                                                <IconNotepad className="text-sky-600" />
                                                <h3 className="text-xl font-bold text-gray-700">Security guarantee</h3>
                                                {/* <p className="text-gray-500">Travel with peace of mind knowing you're protected.</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex h-screen items-center flex-col justify-center">
                        <p className="text-3xl font-bold">HALAMAN BERANDA USER BIASA</p>
                        <p className="text-3xl font-bold">(ONGOING !)</p>
                        <Link href="/login">login admin</Link>
                    </div> */}
                </div>
            </UserLayout >
        </>
    );
}
