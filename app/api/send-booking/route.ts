import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import ProfessionalBookingEmail from "@/app/emails/booking-request"
import { rateLimit } from "@/app/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artistEmail, summary, name, email, phone, event, date, location, budget, notes } = body

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        
        const limit = await rateLimit({
            key: ip,
            limit: 3, // 10 requests
            window: 60, // per 60 seconds
        });
    
      if (!limit.success) {
        return new Response(
          JSON.stringify({
            error: "Too many requests. Try again in a moment.",
          }),
          { status: 429 }
        );
      }

    const { data, error } = await resend.emails.send({
      from: "hello@kervah.co.uk",
      to: artistEmail,
      subject: `New Booking Request: ${event}`,
      react: ProfessionalBookingEmail({
        summary,
        booking: {
        name,
        email,
        phone,
        event,
        date,
        location,
        budget,
        notes,
        }
      }),
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
