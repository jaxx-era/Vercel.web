import { NextResponse } from "next/server"
import { razorpay } from "@/lib/razorpay"

export async function POST() {
  const options = {
    amount: 29900, // ₹299 in paise
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  }

  const order = await razorpay.orders.create(options)

  return NextResponse.json(order)
}
