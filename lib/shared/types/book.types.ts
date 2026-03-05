import { Types } from "mongoose";

export enum BookStatus {
  WantToRead = 'want',
  Reading = 'reading',
  Completed = 'completed',
}

export const statusLabels: Record<BookStatus, string> = {
  want: 'Want to Read',
  reading: 'Reading',
  completed: 'Completed',
};

export interface IBook {
  _id: Types.ObjectId
  title: string;
  author: string
  status: BookStatus
  tags: string[]
  createdAt: string;
  updatedAt: string;
  createdBy: Types.ObjectId;
}
