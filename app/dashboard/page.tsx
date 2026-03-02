"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Dashboard() {
  const { data: session } = useSession()

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  async function handlePayment() {
    const orderRes = await fetch("/api/razorpay/order", {
      method: "POST",
    })

    const order = await orderRes.json()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      handler: async function (response: any) {
        await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            email: session?.user?.email,
          }),
        })

        alert("Subscription Activated")
      },
      theme: {
        color: "#f97316",
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (!session) return <div>Login Required</div>

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-6">Premium Upgrade</h1>

      <button
        onClick={handlePayment}
        className="bg-orange-500 px-6 py-3 rounded-xl"
      >
        Unlock 30 Days – ₹299
      </button>
    </div>
  )
  }
