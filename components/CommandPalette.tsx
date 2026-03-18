"use client"
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
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

    return (
        <div className="w-full relative" ref={ref}>
            <div className="relative" aria-haspopup="listbox" aria-expanded={showDropdown} aria-label="Command palette">
                <input
                    ref={searchBarRef}
                    type="search"
                    placeholder="Personal Book Manager (Ctrl + Q)"
                    className="w-full border border-border bg-background text-foreground placeholder-muted-foreground rounded-lg px-12 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setShowDropdown(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search commands"
                    aria-controls="command-palette-listbox"
                    aria-autocomplete="list"
                />
                <Search 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" 
                    size={20} 
                    aria-hidden="true"
                />
            </div>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        id="command-palette-listbox"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 w-full bg-card border border-border rounded-lg shadow-lg mt-2 max-h-64"
                        role="listbox"
                        aria-label="Command palette options"
                    >
                        <div className="max-h-64 overflow-y-auto overflow-x-hidden">
                            {filteredItems?.length ? (
                                filteredItems.map((item, index) => {
                                    const isActive = activeItemId === item.id;
                                    return (
                                        <motion.button
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`w-full text-left px-4 py-3 font-sans text-sm text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors duration-200 ${
                                                isActive ? 'bg-accent text-accent-foreground' : ''
                                            }`}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                router.push(item.routeName);
                                            }}
                                            role="option"
                                            aria-selected={isActive}
                                        >
                                            {item.label}
                                        </motion.button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-sm text-muted-foreground font-sans">
                                    No commands available
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}