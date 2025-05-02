/** @format */
"use client";
import React from "react";
import {
    BarChart as BarGraph,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Bar,
    Tooltip,
} from "recharts";

type Props = {
    data: {
        month: string;
        total: number;
    }[];
};

export default function BarChart({ data }: Props) {
    return (
        <ResponsiveContainer width={"100%"} height={350}>
            <BarGraph data={data}>
                <XAxis
                    dataKey={"month"}
                    tickLine={false}
                    axisLine={false}
                    stroke="#888888"
                    fontSize={12}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) =>
                        `Rp ${value.toLocaleString("id-ID")}`
                    }
                />
                <Tooltip
                    formatter={(value: number) =>
                        `Rp ${value.toLocaleString("id-ID")}`
                    }
                />
                <Bar dataKey={"total"} fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarGraph>
        </ResponsiveContainer>
    );
}
