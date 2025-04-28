import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Option {
    label: string;
    value: string;
}

interface CommandComboboxProps {
    options: Option[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
}

export const CommandCombobox = ({
    options,
    value,
    onValueChange,
    placeholder = "Pilih...",
    searchPlaceholder = "Cari...",
}: CommandComboboxProps) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (newValue: string) => {
        onValueChange(newValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
                        !value && "text-muted-foreground"
                    )}
                    onClick={(e) => {
                        e.stopPropagation(); // CEGAH klik bubbling keluar
                    }}
                >
                    {options.find((opt) => opt.value === value)?.label ||
                        placeholder}
                    <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command shouldFilter>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>Tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.label}
                                    onSelect={() => handleSelect(option.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // CEGAH enter memicu submit
                                            handleSelect(option.value);
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Lagi-lagi cegah bubbling!
                                    }}
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <CheckIcon className="ml-auto h-4 w-4 opacity-50" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
