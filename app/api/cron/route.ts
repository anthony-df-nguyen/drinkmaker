import { NextResponse } from "next/server";
import { queryDrinks } from "@/app/drinks/actions";

// Cron job handler
export async function GET() {
  try {
    // Call the queryDrinks function
    await queryDrinks(1, 1, "");
    console.log("Queried drinks successfully");
    return NextResponse.json({ ok: true, message: "Cron job executed successfully" });
  } catch (error) {
    console.error("Error executing cron job:", error);
    return NextResponse.json({ ok: false, error: "Cron job failed" }, { status: 500 });
  }
}