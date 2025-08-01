import { google } from "googleapis";
import crypto from "crypto";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const state = crypto.randomBytes(32).toString("hex");

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: state,
  });

  //might want to store the state in session or database for verification in future
  // req.session.oauthState = state;

  res.json({ authUrl: authorizationUrl });
}
