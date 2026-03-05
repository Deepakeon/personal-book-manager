"use client"
import { BookStatus, IBook, statusLabels } from "@/lib/shared/types/book.types";
import { motion } from "framer-motion";
import Link from "next/link";

const statusStyles: Record<BookStatus, string> = {
  want: "bg-status-want text-status-want-fg",
  reading: "bg-status-reading text-status-reading-fg",
  completed: "bg-status-completed text-status-completed-fg",
};

interface BookCardProps {
  book: IBook;
  index: number;
}

const BookCard = ({ book, index }: BookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/library/${book._id}`}>
        <div className="group py-8 border-b border-border hover:bg-card/50 transition-colors px-2 -mx-2 rounded-lg cursor-pointer">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl md:text-3xl font-serif font-medium mb-1 group-hover:-translate-y-0.5 transition-transform">
                {book.title}
              </h3>
              <p className="text-muted-foreground font-sans text-base">
                {book.author}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium ${statusStyles[book.status]}`}>
                {statusLabels[book.status]}
              </span>
              {book.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-sans bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
