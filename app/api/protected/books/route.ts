import { withAuth } from "@/lib/server/middleware.server"
import { BookModel } from "@/lib/server/models/book.model"
import { NextResponse } from "next/server"

export const GET = withAuth(async (_, user) => {
    const bookModel = BookModel.getInstance()
    const books = await bookModel.getBookByIdsByCreatorId(user.userId)
    return NextResponse.json(books)
})

export const POST = withAuth(async (req, user) => {
    const book = await req.json()
    const bookModel = BookModel.getInstance()
    const now = new Date()
    const createdBook = await bookModel.addBook({
        ...book,
        createdBy: user.userId,
        createdAt: now,
        updatedAt: now
    })
    return NextResponse.json(createdBook, { status: 201 })
})