import { withAuth } from "@/lib/server/middleware.server"
import { BookModel } from "@/lib/server/models/book.model"
import { NextResponse } from "next/server"
import { Types } from "mongoose"
import { getMongoDbInstance } from "@/lib/server/mongodb"

export const GET = withAuth(async (req, user, context) => {
      await getMongoDbInstance()

    const bookId = (await context?.params)?.id
    if (!bookId) {
        return NextResponse.json(
            { error: "Book ID is required" },
            { status: 400 }
        )
    }

    if (!Types.ObjectId.isValid(bookId)) {
        return NextResponse.json(
            { error: "Invalid book ID format" },
            { status: 400 }
        )
    }

    const bookModel = BookModel.getInstance()
    const book = await bookModel.getBookById(bookId)
    if (!book) {
        return NextResponse.json(
            { error: "Book not found" },
            { status: 404 }
        )
    }

    return NextResponse.json(book)
})

export const PUT = withAuth(async (req, user, context) => {
      await getMongoDbInstance()

    const bookId = (await context?.params)?.id
    if (!bookId) {
        return NextResponse.json(
            { error: "Book ID is required" },
            { status: 400 }
        )
    }
    
    if (!Types.ObjectId.isValid(bookId)) {
        return NextResponse.json(
            { error: "Invalid book ID format" },
            { status: 400 }
        )
    }

    const updates = await req.json()
    const bookModel = BookModel.getInstance()
    
    const existingBook = await bookModel.getBookById(bookId)
    
    if (!existingBook) {
        return NextResponse.json(
            { error: "Book not found" },
            { status: 404 }
        )
    }

    if (existingBook.createdBy.toString() !== user.userId) {
        return NextResponse.json(
            { error: "Access denied: You can only update your own books" },
            { status: 403 }
        )
    }

    const { _id, createdBy, createdAt, ...updateData } = updates
    
    const updatedBook = await bookModel.updateBook(bookId, updateData)
    
    if (!updatedBook) {
        return NextResponse.json(
            { error: "Failed to update book" },
            { status: 500 }
        )
    }

    return NextResponse.json(updatedBook)
})

export const DELETE = withAuth(async (_, user, context) => {
      await getMongoDbInstance()

    const bookId = (await context?.params)?.id
    if (!bookId) {
        return NextResponse.json(
            { error: "Book ID is required" },
            { status: 400 }
        )
    }

    if (!Types.ObjectId.isValid(bookId)) {
        return NextResponse.json(
            { error: "Invalid book ID format" },
            { status: 400 }
        )
    }

    const bookModel = BookModel.getInstance()
    
    const existingBook = await bookModel.getBookById(bookId)
    
    if (!existingBook) {
        return NextResponse.json(
            { error: "Book not found" },
            { status: 404 }
        )
    }

    if (existingBook.createdBy.toString() !== user.userId) {
        return NextResponse.json(
            { error: "Access denied: You can only delete your own books" },
            { status: 403 }
        )
    }

    const deletedBook = await bookModel.deleteBook(bookId)
    
    if (!deletedBook) {
        return NextResponse.json(
            { error: "Failed to delete book" },
            { status: 500 }
        )
    }

    return NextResponse.json({ message: "Book deleted successfully" })
})
