import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
export default async function handler(req, res) {
  const {
    google_access_token,
    expiry_date,
    refresh_token_expires_in,
    refresh_token,
  } = req.cookies;
  const { id } = req.query;
  if (req.method === "POST") {
    if (!google_access_token) {
      return res.status(401).json({ error: "No access token provided" });
    }
    try {
      oauth2Client.setCredentials({
        access_token: google_access_token,
        expiry_date,
        refresh_token_expires_in,
        refresh_token,
      });
      oauth2Client.on("tokens", (newTokens) => {
        console.log("🔄 Refreshed tokens:", newTokens);
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      await calendar.events.delete({
        calendarId: "primary",
        eventId: id,
      });
      // console.log("event deleted");
      res.status(200).json({ message: `event with id:${id} deleted` });
    } catch (error) {
     console.error("Google API error:", error);

  // Normalize error
  let normalizedError = "Unknown error";

  if (error?.response?.data?.error) {
    normalizedError = error.response.data.error;
  } else if (error?.errors?.length) {
    normalizedError = error.errors[0].message;
  } else if (error?.message) {
    normalizedError = error.message;
  }

  res.status(400).json({ error: normalizedError,  code: error?.code || null });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
