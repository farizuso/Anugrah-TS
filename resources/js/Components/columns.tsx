// import { ColumnDef } from "@tanstack/react-table";
// import { Member } from "@/types";
// import { Button } from "@/Components/ui/button";
// import { ArrowUpDown, InfoIcon } from "lucide-react";
// import DeleteData from "@/Components/DeleteData";
// import { formatDate } from "@/lib/FormatDate";
// import { Link } from "@inertiajs/react";
// import Edit from "../Edit";
// import DetailData from "@/Components/DetailData";

// export const columns: ColumnDef<Member>[] = [
//     {
//         id: "No",
//         header: "No",
//         cell: (info) => info.row.index + 1,
//         enableSorting: false,
//         enableHiding: false,
//         sortUndefined: false,
//     },

//     {
//         accessorKey: "user.name",
//         header: "Name",
//         cell: (row) => row.row.original.user.name,
//     },
//     {
//         accessorKey: "user.email",
//         header: ({ column }) => {
//             return (
//                 <Button
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Email
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             );
//         },
//         cell: ({ row }) => {
//             return <span>{row.original.user.email}</span>;
//         },
//     },
//     {
//         accessorKey: "phone",
//         header: "Phone",
//         cell: ({ row }) => {
//             return (
//                 <a
//                     target="_blank"
//                     className="hover:underline hover:text-primary"
//                     href={`https://wa.me/${row.original.phone}`}
//                 >
//                     {row.original.user ? row.original.phone : ""}
//                 </a>
//             );
//         },
//     },
//     {
//         accessorKey: "gender",
//         header: ({ column }) => {
//             return (
//                 <Button
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Gender
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             );
//         },
//         cell: ({ row }) => {
//             return (
//                 <div
//                     className={`flex items-center gap-1 ${
//                         row.original.gender === "male"
//                             ? "text-blue-500"
//                             : "text-red-500"
//                     }`}
//                 >
//                     {row.original.gender === "male" ? (
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width={24}
//                             height={24}
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 fill="currentColor"
//                                 d="M20 4v6h-2V7.425l-3.975 3.95q.475.7.725 1.488T15 14.5q0 2.3-1.6 3.9T9.5 20t-3.9-1.6T4 14.5t1.6-3.9T9.5 9q.825 0 1.625.237t1.475.738L16.575 6H14V4zM9.5 11q-1.45 0-2.475 1.025T6 14.5t1.025 2.475T9.5 18t2.475-1.025T13 14.5t-1.025-2.475T9.5 11"
//                             ></path>
//                         </svg>
//                     ) : (
//                         <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width={24}
//                             height={24}
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 fill="currentColor"
//                                 d="M11 21v-2H9v-2h2v-2.1q-1.975-.35-3.238-1.888T6.5 9.45q0-2.275 1.613-3.862T12 4t3.888 1.588T17.5 9.45q0 2.025-1.263 3.563T13 14.9V17h2v2h-2v2zm1-8q1.45 0 2.475-1.025T15.5 9.5t-1.025-2.475T12 6T9.525 7.025T8.5 9.5t1.025 2.475T12 13"
//                             ></path>
//                         </svg>
//                     )}
//                     {row.original.gender}
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "birthday",
//         header: ({ column }) => {
//             return (
//                 <Button
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Birthday
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             );
//         },
//         cell: ({ row }) => {
//             return <span>{formatDate(row.original.birthday)}</span>;
//         },
//         sortingFn: "datetime",
//     },
//     {
//         accessorKey: "created_at",
//         header: ({ column }) => {
//             return (
//                 <Button
//                     onClick={() =>
//                         column.toggleSorting(column.getIsSorted() === "asc")
//                     }
//                 >
//                     Create
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             );
//         },
//         cell: ({ row }) => {
//             return <span>{formatDate(row.original.created_at)}</span>;
//         },
//     },

//     {
//         id: "actions",
//         enableHiding: false,
//         header: "Actions",
//         cell: ({ row }) => {
//             const member = row.original;

//             return (
//                 <div className="flex items-center gap-2">
//                     <DetailData id={member.id} />
//                     <Edit member={member} />
//                     <DeleteData paramId={`/admin/member/${member.user.id}`} />
//                 </div>
//             );
//         },
//     },
// ];
