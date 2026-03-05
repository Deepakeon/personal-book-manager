import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import BookCard from "./BookCard";
import TabGroup from "./TabGroup";
import { BookStatus } from "@/lib/shared/types/book.types";
import { useBooks } from "@/hooks/useBooks";
import { useBookStore } from "@/lib/stores/book.store";

const statusTabItems = [
  { key: "all", label: 'All' },
  { key: BookStatus.WantToRead, label: 'Want to Read' },
  { key: BookStatus.Reading, label: 'Reading' },
  { key: BookStatus.Completed, label: 'Completed' },
];

const Library = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagSearch, setTagSearch] = useState("");
  const { getBookByIds, isLoading } = useBooks();
  const books = useBookStore((state) => state.books);

  useEffect(() => {
    getBookByIds();
  }, [getBookByIds]);

  const filtered = useMemo(() => {
    let result = books;
    if (statusFilter !== 'all') result = result.filter(b => b.status === statusFilter);
    if (tagSearch.trim()) {
      const q = tagSearch.toLowerCase();
      result = result.filter(b =>
        b.tags.some(t => t.toLowerCase().includes(q)) ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }
    return result;
  }, [books, statusFilter, tagSearch]);

  const totalBooks = books.length;
  const readingCount = books?.filter(b => b.status === BookStatus.Reading).length;
  const completedCount = books?.filter(b => b.status === BookStatus.Completed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between mb-16">
              <h1 className="text-5xl md:text-6xl font-serif font-semibold tracking-tight">
                Your Library
              </h1>
            <Link
              href="/library/add"
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-sans font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Book
            </Link>
          </div>

          {totalBooks > 0 && (
            <div className="flex gap-12 mb-16">
              <div>
                <p className="text-4xl md:text-5xl font-serif font-semibold">{totalBooks}</p>
                <p className="text-sm text-muted-foreground font-sans mt-1">Total Books</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif font-semibold">{readingCount}</p>
                <p className="text-sm text-muted-foreground font-sans mt-1">Reading</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif font-semibold">{completedCount}</p>
                <p className="text-sm text-muted-foreground font-sans mt-1">Completed</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <TabGroup activeKey={statusFilter} items={statusTabItems} onChange={setStatusFilter} />
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search books or tags..."
                value={tagSearch}
                onChange={e => setTagSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm font-sans text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground font-sans">Loading your library...</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <h2 className="text-2xl md:text-3xl font-serif font-medium mb-4">
                {totalBooks === 0
                  ? "Your reading journey begins here."
                  : "No books match your filters."}
              </h2>
              {totalBooks === 0 && (
                <Link
                  href="/library/add"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-sans text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add your first book
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filtered.map((book, i) => (
                <BookCard key={book._id.toString()} book={book} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link
        href="/library/add"
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default Library;
