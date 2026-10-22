import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const e = parsed.data;
  if (e.website) return NextResponse.json({ ok: true }); // honeypot: drop silently

  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  const from = process.env.ENQUIRY_FROM;

  if (!key || !to || !from) {
    // Local demo: log instead of emailing. Never enable ENQUIRY_LOG_ONLY on the live site.
    if (process.env.NODE_ENV !== "production" || process.env.ENQUIRY_LOG_ONLY === "1") {
      console.log("[enquiry] " + JSON.stringify(e));
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ ok: false, error: "Enquiries are not configured yet. Please call us." }, { status: 503 });
  }

  const rows = [
    ["Grade", e.grade],
    ["Quantity", `${e.quantity} ${e.unit}`],
    ["Deliver to", e.deliverTo],
    ["Name", e.name],
    ["Company", e.company],
    ["Phone", e.phone],
    ["Note", e.note],
  ];
  const html = `<h2>Rate request: ${esc(e.grade)}</h2><table>${rows
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v || "-")}</td></tr>`)
    .join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: `Rate request: ${e.grade}, ${e.quantity} ${e.unit}`, html }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: "Could not send. Please call us." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
