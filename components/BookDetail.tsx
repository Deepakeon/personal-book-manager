"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BookStatus, IBook } from "@/lib/shared/types/book.types";
import Link from "next/link";
import { useBooks } from "@/hooks/useBooks";

const statusStyles: Record<BookStatus, string> = {
  want: "bg-status-want text-status-want-fg",
  reading: "bg-status-reading text-status-reading-fg",
  completed: "bg-status-completed text-status-completed-fg",
};

const statusLabels: Record<BookStatus, string> = {
  want: 'Want to Read',
  reading: 'Reading',
  completed: 'Completed',
};

const BookDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getBookById, updateBook, deleteBook, isLoading } = useBooks();
  
  const [book, setBook] = useState<IBook | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>(BookStatus.WantToRead);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        const bookData = await getBookById(id as string);
        if (bookData) {
          setBook(bookData);
          setTitle(bookData.title);
          setAuthor(bookData.author);
          setStatus(bookData.status);
          setTags(bookData.tags || []);
        }
      };
      fetchBook();
    }
  }, [id, getBookById]);

  if (!book && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-medium mb-4">Book not found</h1>
          <Link href="/library" className="text-muted-foreground font-sans hover:text-foreground transition-colors">
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      const updatedBook = await updateBook(id as string, { title, author, status, tags });
      if (updatedBook) {
        setBook(updatedBook);
        setEditing(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    const deleted = await deleteBook(id as string);
    if (deleted) {
      router.push("/library");
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5 && trimmed.length <= 50) {
      setTags([...tags, trimmed]);
      setTagInput("");
    } else {
      setTagInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-12">
            <Link href="/library" className="text-sm text-muted-foreground font-sans hover:text-foreground transition-colors">
              ← Back to Library
            </Link>
            <div className="flex gap-2">
              {editing ? (
                <button
                  onClick={handleSave}
                  disabled={isLoading || isSubmitting || !title.trim() || !author.trim() || title.trim().split(/\s+/).length > 100 || author.trim().split(/\s+/).length > 100 || title.length > 500 || author.length > 200}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-sans font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-full text-sm font-sans font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {editing ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground font-sans">Title</label>
                <div className="flex gap-2">
                  <span className={`text-xs font-sans ${title.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {title.length}/500 chars
                  </span>
                </div>
              </div>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full bg-transparent text-4xl md:text-5xl font-serif font-semibold outline-none transition-colors ${
                  title.trim().split(/\s+/).length > 100 || title.length > 500 ? 'border-red-500' : 'border-b border-border pb-2 focus:border-foreground'
                }`}
              />
              {(title.trim().split(/\s+/).length > 100 || title.length > 500) && (
                <div className="space-y-1">
                  {title.length > 500 && (
                    <p className="text-red-500 text-xs font-sans">Title cannot exceed 500 characters</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-3">{book?.title}</h1>
          )}

          {editing ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground font-sans">Author</label>
                <div className="flex gap-2">
                  <span className={`text-xs font-sans ${author.length > 200 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {author.length}/200 chars
                  </span>
                </div>
              </div>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className={`w-full bg-transparent text-xl font-sans text-muted-foreground outline-none transition-colors ${
                  author.trim().split(/\s+/).length > 100 || author.length > 200 ? 'border-red-500' : 'border-b border-border pb-2 focus:border-foreground'
                }`}
              />
              {(author.trim().split(/\s+/).length > 100 || author.length > 200) && (
                <div className="space-y-1">
                  {author.length > 200 && (
                    <p className="text-red-500 text-xs font-sans">Author name cannot exceed 200 characters</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xl font-sans text-muted-foreground mb-8">{book?.author}</p>
          )}

          {editing ? (
            <div className="flex gap-3 mb-8">
              {(['want', 'reading', 'completed'] as BookStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-full text-sm font-sans font-medium border-2 transition-all ${
                    status === s ? `${statusStyles[s]} border-current` : 'border-border text-muted-foreground'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          ) : (
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-sans font-medium mb-8 ${statusStyles[book?.status || BookStatus.WantToRead]}`}>
              {statusLabels[book?.status || BookStatus.WantToRead]}
            </span>
          )}

          {editing && (
            <div className="space-y-3 mt-8">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground font-sans">Tags</label>
                <span className="text-xs text-muted-foreground font-sans">
                  {tags.length}/5 tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans bg-secondary text-secondary-foreground"
                  >
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 hover:text-foreground">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                className={`w-full bg-transparent border-b py-3 text-sm font-sans text-foreground outline-none transition-colors ${tags.length >= 5 ? 'border-red-500' : 'border-border focus:border-foreground'
                  }`}
                placeholder={tags.length >= 5 ? "Maximum 5 tags allowed" : "+ Add tag"}
                disabled={tags.length >= 5}
              />
              {tagInput.length > 50 && (
                <p className="text-red-500 text-xs font-sans">Tag cannot exceed 50 characters</p>
              )}
            </div>
          )}
          {!editing && (
            <div className="flex flex-wrap gap-2">
              {(book?.tags || []).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetail;