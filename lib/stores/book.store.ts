import { create } from 'zustand'
import { IBook } from '../shared/types/book.types'


interface BookStore {
  books: IBook[]
  setBooks: (books: IBook[] | ((prevBooks: IBook[]) => IBook[])) => void
}

export const useBookStore = create<BookStore>()(
  (set) => ({
    books: [],
    setBooks: (updater) =>
        set((state) => ({
          books:
            typeof updater === 'function' ? updater(state.books) : updater
        })),
  })
)