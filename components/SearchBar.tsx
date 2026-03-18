"use client"
import { Search } from "lucide-react";
import { InputHTMLAttributes, RefObject } from "react";
import { twMerge } from "tailwind-merge";

export default function SearchBar({ className, ref, containerClassName, ...props }: InputHTMLAttributes<HTMLInputElement> & { containerClassName?: string, ref: RefObject<HTMLInputElement | null> }) {
    return <p className={twMerge("relative", containerClassName)}>
        <input placeholder="Search books or tags..." type="search" ref={ref} className={twMerge("w-full border border-black p-2 pl-12 rounded-lg", className)} {...props} />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
    </p>
}