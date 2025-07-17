import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { values, token } = req.body;
    oauth2Client.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventCreationContent = {
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
    };

    calendar.events.insert(
      {
        auth: oauth2Client,
        calendarId: "primary",
        resource: eventCreationContent,
      },
      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          res.status(400).send({error:err})
        }
        console.log("Event created: %s", event.htmlLink);
        res.status(200).json({ message: "successful event insertion" });
      }
    );
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
