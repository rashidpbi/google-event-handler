import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
import getBackendErrorResponseObject from "@/utils/getBackendErrorResponseObject";

export default async function handler(req, res) {
  function getFirstDayOfLastMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  }
  const {
    google_access_token,
    expiry_date,
    refresh_token_expires_in,
    refresh_token,
  } = req.cookies;
  if (req.method === "GET") {
    try {
      oauth2Client.setCredentials({
        access_token: google_access_token,
        expiry_date,
        refresh_token_expires_in,
        refresh_token,
      });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const { data } = await calendar.events.list({
        auth: oauth2Client,
        calendarId: "primary",
        // maxResults:13,
        timeMin: getFirstDayOfLastMonth(),
        // timeMin: "2025-07-01T00:00:00.000Z",
      });

      res.status(200).json({ events: data.items });
    } catch (error) {
      const { responseObject } = getBackendErrorResponseObject(error);

      res.status(400).json(responseObject);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
