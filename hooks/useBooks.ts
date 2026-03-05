import { IBook } from "@/lib/shared/types/book.types"
import { useBookStore } from "@/lib/stores/book.store"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export const useBooks = () => {
    const setBooks = useBookStore((state) => state.setBooks)
    const [isLoading, setIsLoading] = useState(true)

    const getBookByIds = useCallback(async() => {
        try{
            setIsLoading(true)
            const response = await fetch('/api/protected/books',{
                headers: {
                "content-type": "application/json"
            }
            })

            if(response.ok){
                setBooks(await response.json())
            }else{
                toast.error(`Failed to fetch books: ${response.statusText ?? ""}`)
            }

        }catch(err){
            toast.error(`Something went wrong while fetching books: ${err}`)
        }finally{
            setIsLoading(false)
        }
    }, [setBooks])

    const addBook = useCallback(async(book: Omit<IBook, "createdBy"| "createdAt" | "updatedAt" | "_id">) => {
        try{
            setIsLoading(true)
            const response = await fetch('/api/protected/books',{
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(book)
            })

            if(response.ok){
                const createdBook = await response.json()
                setBooks((prev) => [...prev, createdBook])
            }

        }catch(err){
            toast.error(`Something went wrong while adding book: ${err}`)
        }finally{
            setIsLoading(false)
        }
    }, [setBooks])

    const getBookById = useCallback(async(id: string) => {
        try{
            setIsLoading(true)
            const response = await fetch(`/api/protected/books/${id}`, {
                headers: {
                    "content-type": "application/json"
                }
            })

            if(response.ok){
                return await response.json()
            }else{
                toast.error(`Failed to fetch book: ${response.statusText ?? ""}`)
                return null
            }

        }catch(err){
            toast.error(`Something went wrong while fetching book: ${err}`)
            return null
        }finally{
            setIsLoading(false)
        }
    }, [])

    const updateBook = useCallback(async(id: string, updates: Partial<Omit<IBook, "_id" | "createdBy" | "createdAt">>) => {
        try{
            setIsLoading(true)
            const response = await fetch(`/api/protected/books/${id}`, {
                method: 'PUT',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(updates)
            })

            if(response.ok){
                const updatedBook = await response.json()
                setBooks((prev) => prev.map(book => book._id.toString() === id ? updatedBook : book))
                return updatedBook
            }else{
                toast.error(`Failed to update book: ${response.statusText ?? ""}`)
                return null
            }

        }catch(err){
            toast.error(`Something went wrong while updating book: ${err}`)
            return null
        }finally{
            setIsLoading(false)
        }
    }, [setBooks])

    const deleteBook = useCallback(async(id: string) => {
        try{
            setIsLoading(true)
            const response = await fetch(`/api/protected/books/${id}`, {
                method: 'DELETE',
                headers: {
                    "content-type": "application/json"
                }
            })

            if(response.ok){
                setBooks((prev) => prev.filter(book => book._id.toString() !== id))
                toast.success("Book deleted successfully")
                return true
            }else{
                toast.error(`Failed to delete book: ${response.statusText ?? ""}`)
                return false
            }

        }catch(err){
            toast.error(`Something went wrong while deleting book: ${err}`)
            return false
        }finally{
            setIsLoading(false)
        }
    }, [setBooks])

    return {
        getBookByIds,
        isLoading,
        addBook,
        getBookById,
        updateBook,
        deleteBook
    }
}
