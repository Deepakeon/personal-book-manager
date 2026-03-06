"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookStatus, statusLabels } from "@/lib/shared/types/book.types"
import { useBooks } from "@/hooks/useBooks"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { bookValidationConfig, validateBook } from "@/lib/shared/validators/book.validator"

const statuses: BookStatus[] = [
  BookStatus.WantToRead,
  BookStatus.Reading,
  BookStatus.Completed
]

const statusTileStyles: Record<BookStatus, string> = {
  want: "border-status-want bg-status-want/30 text-status-want-fg",
  reading: "border-status-reading bg-status-reading/30 text-status-reading-fg",
  completed: "border-status-completed bg-status-completed/30 text-status-completed-fg",
};

const statusTileActive: Record<BookStatus, string> = {
  want: "border-status-want-fg bg-status-want text-status-want-fg ring-2 ring-status-want-fg/30",
  reading: "border-status-reading-fg bg-status-reading text-status-reading-fg ring-2 ring-status-reading-fg/30",
  completed: "border-status-completed-fg bg-status-completed text-status-completed-fg ring-2 ring-status-completed-fg/30",
};


const AddBook = () => {
  const { addBook, isLoading } = useBooks()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<BookStatus>(BookStatus.WantToRead)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const errors = validateBook(title, author, tagInput, tags)

  const addTag = () => {
    const trimmed = tagInput.trim()
    setTags([...tags, trimmed])
    setTagInput("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await addBook({
      title: title.trim(),
      author: author.trim(),
      status,
      tags
    })

    router.push("/library")
  }

  return (
    <div className="h-dvh bg-background">
      <div className="max-w-lg mx-auto px-6 py-12 md:py-20 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/library" className="text-sm text-muted-foreground font-sans hover:text-foreground transition-colors">
            ← Back to Library
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold my-12">Add a Book</h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground font-sans">Title</label>
                <div className="flex gap-2">
                  <span className={`text-xs font-sans text-muted-foreground`}>
                    {title.length}/{bookValidationConfig.titleMaxChars} chars
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full bg-transparent border-b py-3 text-xl font-serif text-foreground outline-none transition-colors border-border focus:border-foreground`}
                placeholder="Book title..."
                required
              />
              {!!title.length && !!errors.title && (
                <div className="space-y-1">
                    <p className="text-red-500 text-xs font-sans">{errors.title}</p>
                </div>
              )}
            </div>

            <div className="space-y-4 relative">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground font-sans">Author</label>
                <div className="flex gap-2">
                  <span className={`text-xs font-sans text-muted-foreground`}>
                    {author.length}/{bookValidationConfig.authorMaxChars} chars
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={author}
                onChange={e => { setAuthor(e.target.value); }}
                className={`w-full bg-transparent border-b py-3 text-lg font-sans text-foreground outline-none transition-colors border-border focus:border-foreground`}
                placeholder="Author name..."
                required
              />
              {!!author.length && !!errors.author && (
                <div className="space-y-1">
                  <p className="text-red-500 text-xs font-sans">{errors.author}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm text-muted-foreground font-sans">Status</label>
              <div className="grid grid-cols-3 gap-3">
                {statuses.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-sans font-medium transition-all ${status === s ? statusTileActive[s] : statusTileStyles[s]
                      }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm text-muted-foreground font-sans">Tags</label>
                <span className="text-xs text-muted-foreground font-sans">
                  {tags.length}/{bookValidationConfig.maxTags} tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans bg-secondary text-secondary-foreground"
                  >
                    {t}
                    <button type="button" onClick={() => setTags(tags.filter(tag => tag !== t))} className="ml-1 hover:text-foreground">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className={`w-full bg-transparent border-b py-3 text-sm font-sans text-foreground outline-none transition-colors ${tags.length >= 5 ? 'border-red-500' : 'border-border focus:border-foreground'
                  }`}
                placeholder={tags.length >= bookValidationConfig.maxTags ? `Maximum ${bookValidationConfig.maxTags} tags allowed` : "Add a tag and press Enter..."}
                disabled={tags.length >= bookValidationConfig.maxTags}
              />
              {tagInput.length > bookValidationConfig.tagMaxChars && (
                <p className="text-red-500 text-xs font-sans">Tag cannot exceed {bookValidationConfig.tagMaxChars} characters</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || Object.values(errors).some(Boolean)}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-sans font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Saving...
                </motion.span>
              ) : (
                "Add to Library"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddBook