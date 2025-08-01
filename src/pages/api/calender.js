import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { values, token } = req.body;
    oauth2Client.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    try {
      const calendars = await calendar.calendars.get({
        calendarId: values.calendar_id,
      });
      res.status(200).json(calendars);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
