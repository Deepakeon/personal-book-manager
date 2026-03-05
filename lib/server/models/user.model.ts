import { User } from "../schema/user.schema"
import bcrypt from 'bcrypt';

export class UserModel {
async findByEmail(email: string) {
    return User.findOne({ email }, {
      email: true,
      passwordHash: true
    }).lean()
  }

  async findById(id: string) {
    return User.findById(id).lean()
  }

  async create(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10)

    return User.create({
      email,
      passwordHash
    })
  }
}
