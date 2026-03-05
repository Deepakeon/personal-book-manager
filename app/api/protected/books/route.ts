import { withAuth } from "@/lib/server/middleware.server"
import { BookModel } from "@/lib/server/models/book.model"
import { getMongoDbInstance } from "@/lib/server/mongodb"
import { NextResponse } from "next/server"

export const GET = withAuth(async (_, user) => {
      await getMongoDbInstance()
    
    const bookModel = BookModel.getInstance()
    const books = await bookModel.getBookByIdsByCreatorId(user.userId)
    return NextResponse.json(books)
})

export const POST = withAuth(async (req, user) => {
      await getMongoDbInstance()

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