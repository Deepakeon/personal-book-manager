import { NextRequest, NextResponse } from 'next/server';
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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const userModel = new UserModel();

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const user = await userModel.create(email, password);
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}