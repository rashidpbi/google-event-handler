import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";

export default async function handler(req, res) {
  const token = req.cookies.google_access_token;
  if (req.method === "GET") {
    try {
      if(!token){
        res.status(401).json({error:'Unauthorised - Missing token'})
      }

      oauth2Client.setCredentials({ access_token: token });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  
      const {data} = await calendar.events.list(
        {
          auth: oauth2Client,
          calendarId: "primary",
          // maxResults:13,
          timeMin: new Date().toISOString(),
          // timeMin: "2025-07-01T00:00:00.000Z",
        }
  
        )
        // const result = await eventList.json()
        // console.log("rslt:",result)
        res.status(200).json({ events: data.items });
    } catch (error) {
        res.status(400).send({error:error})
    }
    
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
