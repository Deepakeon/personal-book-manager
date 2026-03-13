import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateJWT } from '@/lib/server/jwt';
import { UserModel } from '@/lib/server/models/user.model';
import { getMongoDbInstance } from '@/lib/server/mongodb';
import { CookieExpiryInMs } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
  await getMongoDbInstance()

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const userModel = new UserModel();

    const user = await userModel.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await generateJWT(user._id.toString(), user.email);

    return NextResponse.json({
      success: true,
      user: {
        email: user.email
      }
    }, {
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${CookieExpiryInMs}; sameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}