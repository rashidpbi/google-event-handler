import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
export default async function handler(req, res) {
  const {
    google_access_token,
    expiry_date,
    refresh_token_expires_in,
    refresh_token,
  } = req.cookies;
  const { values } = req.body;
  if (req.method === "POST") {
    try {
      if (!google_access_token) {
        res.status(401).json({ error: "Unauthorised - Missing token" });
      }
      oauth2Client.setCredentials({
        access_token: google_access_token,
        expiry_date,
        refresh_token_expires_in,
        refresh_token,
      });
      // oauth2Client.setCredentials({ access_token: google_access_token});
      oauth2Client.on("tokens", (newTokens) => {
        console.log("🔄 Refreshed tokens:", newTokens);
      });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const response = await calendar.events.insert({
        auth: oauth2Client,
        calendarId: "primary",
        resource: {
          summary: values.summary,
          location: values.location,
          description: values.description,
          start: {
            dateTime: values.start,
            timeZone: "UTC",
          },
          end: {
            dateTime: values.end,
            timeZone: "UTC",
          },
        },
      });
      res.status(200).json({ data: response.data });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
