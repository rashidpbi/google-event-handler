import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
import getBackendErrorResponseObject from "@/utils/getBackendErrorResponseObject";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    const {
      google_access_token,
      expiry_date,
      refresh_token_expires_in,
      refresh_token,
    } = req.cookies;
    const { values } = req.body;
    // console.log("values.: ", values);
    if (!google_access_token) {
      res.status(403).send({ error: "missing access token" });
      return;
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
      const result = await calendar.events.patch({
        // auth: oauth2Client,
        calendarId: "primary",
        eventId: id,
        requestBody: {
          summary: values.summary,
          location: values.location,
          description: values.description,
          end: {
            dateTime: values.end,
            timeZone: "Asia/Kolkata",
          },
          start: {
            dateTime: values.start,
            timeZone: "Asia/Kolkata",
          },
        },
      });
      // console.log("result.data:", result.data);
      res.status(200).json({ updatedEventData: result.data });
    } catch (error) {
      const { responseObject } = getBackendErrorResponseObject(error);

      res.status(400).json(responseObject);
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
