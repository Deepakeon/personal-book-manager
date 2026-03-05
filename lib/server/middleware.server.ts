import { NextResponse } from "next/server"
import { JWTPayloadWithUserId, verifyJWT } from "./jwt";
import { cookies } from "next/headers";

export type AuthenticatedHandler = (
    req: Request,
    user: JWTPayloadWithUserId,
    context?: { params: Promise<{ id?: string }> }
) => Promise<Response>

export function withAuth(handler: AuthenticatedHandler) {
  return async function (req: Request, context?: { params: Promise<{ id?: string }>  }) {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get("token")?.value

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }

      const payload = await verifyJWT(token)
      if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      return handler(req, payload, context)

    } catch (err) {
      return NextResponse.json(
        { error: `Invalid token: ${err}` },
        { status: 401 }
      )
    }
  }
}