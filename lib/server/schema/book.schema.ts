import { BookStatus, IBook } from '@/lib/shared/types/book.types';
import { Schema, models, model } from 'mongoose';

const bookSchema = new Schema<IBook>({
    title: { 
        type: String, 
        required: true,
        maxlength: [500, 'Title cannot exceed 500 characters']
    },
    author: { 
        type: String, 
        required: true,
        maxlength: [200, 'Author name cannot exceed 200 characters']
    },
    status: { type: String, enum: Object.values(BookStatus), default: BookStatus.WantToRead },
    tags: [{ 
        type: String,
        maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  }
}, {
    timestamps: true
});

export const Book = models.Book || model('Book', bookSchema);