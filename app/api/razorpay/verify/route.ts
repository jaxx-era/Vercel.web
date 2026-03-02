import { NextResponse } from "next/server"
import { verifySignature } from "@/lib/verifyPayment"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  const body = await req.json()

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } =
    body

  const isValid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  )

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("rankarea")

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(startDate.getDate() + 30)

  await db.collection("users").updateOne(
    { email },
    {
      $set: {
        subscription: "active",
        subscriptionStart: startDate,
        subscriptionEnd: endDate,
      },
    }
  )

  return NextResponse.json({ success: true })
}
