import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
export default async function handler(req, res) {
  const token = req.cookies.google_access_token;
  console.log("token: ",token)
  const { id } = req.query;
  if (req.method === "POST") {
      if (!token) {
      return res.status(401).json({ error: "No access token provided" });
    }
    try {
      oauth2Client.setCredentials({ access_token: token });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      await calendar.events.delete({
        calendarId: "primary",
        eventId: id,
      });
      console.log("event deleted");
      res.status(200).json({ message: `event with id:${id} deleted` });
    } catch (error) {
      console.log("error: ",error.message);
      res.status(400).send({ error: error.message});
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
