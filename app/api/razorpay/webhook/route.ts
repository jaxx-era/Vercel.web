import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("x-razorpay-signature")!

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex")

  if (expected !== signature) {
    return NextResponse.json({ status: "Invalid signature" }, { status: 400 })
  }

  return NextResponse.json({ status: "Webhook received" })
}
