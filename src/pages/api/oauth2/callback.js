import oauth2Client from "@/utils/google-auth";

export default async function GET(req, res) {
  const fullUrl = `${req.headers.host}${req.url}`;
  const url = new URL(`http://${fullUrl}`);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return res.json({ error: "Google OAuth Error: " + error });
  }

  if (!code) {
    return res.json({ error: "Authorization code not found" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.setHeader("Set-Cookie", [
      `google_access_token=${tokens.access_token};  Path=/; Max-Age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`,
      `expiry_date=${tokens.expiry_date};  Path=/; Max-Age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`,
      `refresh_token=${tokens.refresh_token};  Path=/; Max-Age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`,
      `refresh_token_expires_in=${
        tokens.refresh_token_expires_in
      };  Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`,
    ]);

    res.writeHead(302, { Location: "/" });
    res.end();
  } catch (error) {
    return res.json({
      error: "Failed to exchange code for access token" + error,
    });
  }
}
