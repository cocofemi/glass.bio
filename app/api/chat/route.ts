import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { rateLimit } from "@/app/lib/rate-limit";
import { supabase } from "@/app/lib/supabase";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function verifyTurnstile(token: string, ip: string | null) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
      remoteip: ip ?? "",
    }),
  });

  const data = await res.json();
  console.log("Data success", data.success)
  return data.success === true;
}


export async function POST(req: Request) {
    const { messages, slug, token, verified } = await req.json();
    console.log("Token", token)
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!verified) {
        const valid = await verifyTurnstile(token, ip);
        if (!valid) {
            return new Response(JSON.stringify({ error: "Failed human verification." }), {
            status: 403,
            });
        }
    }
    const limit = await rateLimit({
        key: ip,
        limit: 10, // 10 requests
        window: 60, // per 60 seconds
    });

console.log("Verified", verified)

  if (!limit.success) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Try again in a moment.",
      }),
      { status: 429 }
    );
  }

  // 1. Fetch profile from Supabase
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "No profile found" }, { status: 404 });
  }

  // 2. Build system prompt with Supabase data
const systemPrompt = `
You are the official virtual assistant for the artist.

=========================================================
ARTIST PROFILE DATA (always use this information):
{{PROFILE_JSON_HERE}}
=========================================================

Your responsibilities are TWO MODES:
1) Normal enquiry assistant  
2) Booking assistant (step-by-step flow)

---------------------------------------------------------
MODE 1 — NORMAL ENQUIRY
---------------------------------------------------------
If the user asks ANYTHING that is NOT related to booking the artist 
(examples: questions about music, releases, socials, shows, bio, merch, tour tickets),
you MUST:

Return ONLY:
{
  "type": "chat",
  "response": "<your helpful answer using the artist profile data>"
}

No booking questions.  
No JSON except the above format.  
Always use the profile JSON for context.

---------------------------------------------------------
MODE 2 — BOOKING INTENT DETECTED
---------------------------------------------------------
Booking intent examples:
- “I want to book the artist”
- “Can she perform at my event?”
- “How much is a show?”
- “Are they available on [date]?”
- “We want to hire him”

When booking intent is detected:

BEGIN A STEP-BY-STEP BOOKING JOURNEY.

You MUST collect the following fields IN ORDER, ONE AT A TIME:

1. name  
2. email  
3. phone  
4. event type  
5. event date  
6. location  
7. budget  
8. notes  

RULES:
- NEVER list all questions at once.  
- ALWAYS ask only the next missing field.  
- ALWAYS acknowledge received information.  
- ALWAYS show progress like: “Step 3 of 8”.  
- Do not forget to ask for the notes and all other required data.
- CONTINUE asking until ALL fields are collected.

While collecting info and flow is NOT complete, return:

{
  "type": "chat",
  "response": "<your next question or acknowledgement>"
}

---------------------------------------------------------
WHEN ALL BOOKING FIELDS ARE COLLECTED
---------------------------------------------------------
Return EXACTLY:

BOOKING_READY
SUMMARY:
<Human-friendly summary for the user>
<A short human-readable summary>

JSON:
<hidden JSON block for the backend only>
   {
     "type": "booking_ready",
     "summary": "<Short human summary of the booking>",
     "details": {
       "name": "...",
       "email": "...",
       "phone": "...",
       "event": "...",
       "date": "...",
       "location": "...",
       "budget": "...",
       "notes": "..."
     }
   }



- JSON MUST be valid.
- DO NOT add extra text outside the format.
- DO NOT return booking JSON unless the booking is complete.

---------------------------------------------------------
MODE SWITCHING
---------------------------------------------------------
- If user switches topics, you return to enquiry mode.
- If user returns to booking, resume from their progress.

`;

  // 3. Call Groq
  const groqRes = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    temperature: 0.3,
  });

  const text = groqRes.choices[0].message.content;

// --- Extract JSON block from model output ---
let parsed;

const jsonMatch = text.match(/\{[\s\S]*\}/); // extracts the last {...} block

if (jsonMatch) {
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (err) {
    parsed = { type: "chat", response: text };
  }
} else {
  parsed = { type: "chat", response: text };
}

  // 4. If booking summary, send email via Resend
if (parsed.type === "chat") {
  return NextResponse.json(parsed);
}


if (parsed.type === "booking_ready") {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

    console.log("BASE URL:", baseUrl);
    console.log("POSTING TO:", `${baseUrl}/api/send-booking`);


  try {
    await fetch(`${baseUrl}/api/send-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artistEmail: profile.email,
        summary: parsed.summary,
        ...parsed.details,
      }),
    });
    console.log("Sending booking email →", parsed.details);
    // Return only human-readable message to user
    return NextResponse.json({
        type: "chat",
        response:
        parsed.summary +
        "\n\nSomeone from the team will reach out to you shortly.",
    });
  } catch (err) {
    console.error("Error sending Email:", err);
  }
}
return NextResponse.json({
  type: "chat",
  response: parsed.response || "How can I help you?",
});

}

//collect location 
//turnstile
//apple music