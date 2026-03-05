import { BookStatus, IBook } from '@/lib/shared/types/book.types';
import { Book } from './../schema/book.schema';
import { Types } from "mongoose";

export class BookModel {
  static instance: BookModel;
  private constructor(){}
  
  static getInstance(){
    if(!this.instance){
      this.instance = new BookModel()
    }

    return this.instance;
  }

  async getBookByIdsByCreatorId(createdById: string) {
    return Book.find({ createdBy: new Types.ObjectId(createdById) }).lean();
  }

  async getBookById(id: string) {
    return Book.findById(new Types.ObjectId(id)).lean();
  }

  async addBook(book: Omit<IBook, "_id" >) {
    return Book.create(book);
  }

  async updateBook(
    id: string,
    updates: Partial<Omit<IBook, "_id" | "createdAt">>
  ) {
    return Book.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        ...updates,
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();
  }

  async deleteBook(id: string) {
    return Book.findByIdAndDelete(new Types.ObjectId(id));
  }

  async getAllAuthors() {
    const result = await Book.aggregate([
      { $match: { author: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return result.map(r => r._id);
  }

  async getAllTags() {
    const result = await Book.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return result.map(r => r._id);
  }

  async getMostUsedStatus(): Promise<IBook['status']> {
    const result = await Book.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    return result.length ? result[0]._id : BookStatus.WantToRead;
  }
}