import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, amount, category, note, date, time } = body;

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"); // Handle potential stringified newlines
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // If no credentials, we just silently succeed or warn so the local app doesn't break
    if (!email || !privateKey || !spreadsheetId) {
      console.warn("Google API credentials missing. Skipping Sheets sync.");
      return NextResponse.json({ warned: "Missing credentials" }, { status: 200 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:F", // Ensure the user has a "Sheet1" or adjust accordingly
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[id, amount, category, note, date, time]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing to Google Sheets:", error);
    return NextResponse.json({ error: "Failed to sync to Sheets" }, { status: 500 });
  }
}
