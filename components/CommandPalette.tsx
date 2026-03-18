"use client"
import { useMemo, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useKeyboardEvent } from "@/hooks/useKeyboardEvents";
import { useRouter } from "next/navigation";

const items = [
    {
        id: "Add Book",
        label: "Add Book",
        routeName: "/library/add",
    },
    {
        id: "Library",
        label: "Library",
        routeName: "/library",
    }
];

export default function CommandPalette() {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeItemId, setActiveItemId] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const ref = useRef<HTMLDivElement | null>(null);
    const searchBarRef = useRef<HTMLInputElement | null>(null);
    const prevKeyRef = useRef<string | null>(null);

    const handleKeyDown = (e: WindowEventMap["keydown"]) => {
        handleKeyboardNavigation(e)
        if (prevKeyRef.current?.toLowerCase() === "control" && e.key.toLowerCase() === "q") {
            setShowDropdown(true)
            searchBarRef?.current?.focus();
        }
        prevKeyRef.current = e.key;

        if (e.key === "Escape") {
            setShowDropdown(false)
        }
    }

    const handleKeyboardNavigation = (e: WindowEventMap["keydown"]) => {
        if (!showDropdown) return;

        const key = e.key.toLowerCase();

        const currentIndex = items.findIndex(item => item.id === activeItemId);
        if (key === "arrowdown") {
            e.preventDefault()
            const nextIndex = (currentIndex + 1) % items.length;
            setActiveItemId(items[nextIndex].id);
        }

        if (key === "arrowup") {
            e.preventDefault()
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            setActiveItemId(items[prevIndex].id);
        }

        if (e.key === "Enter") {
            e.preventDefault()
            router.push(items[currentIndex].routeName);
            setShowDropdown(false);
        }

    }

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return items.filter(item =>
            !query || item.label.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    useClickOutside(ref, () => setShowDropdown(false));
    useKeyboardEvent(handleKeyDown)

    return <div className="w-full relative" ref={ref}>
        <SearchBar containerClassName="w-full" placeholder="Personal Book Manager ( Ctrl + Q )" className="cursor-pointer hover:bg-status-want" onClick={() => {
            setShowDropdown(true);
        }} onChange={(e) => setSearchQuery(e.target.value)} ref={searchBarRef} />
        {showDropdown && <div className="bg-white absolute top-full w-full rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto">
            {filteredItems?.length ?
                filteredItems.map((item) => (
                    <button
                        key={item.id}
                        className={`rounded-sm block w-full text-left p-2 hover:bg-gray-200 ${activeItemId === item.id ? 'bg-gray-300' : ''}`}
                        onClick={() => {
                            setShowDropdown(false);
                            router.push(item.routeName);
                        }}
                    >
                        {item.label}
                    </button>
                )) : <span className="rounded-sm block w-full text-left p-2">No commands available</span>}
        </div>}
    </div>
}