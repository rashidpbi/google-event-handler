//api/eventList.js
import { google } from "googleapis";
import oauth2Client from "@/utils/google-auth";
import getBackendErrorResponseObject from "@/utils/getBackendErrorResponseObject";

export default async function handler(req, res) {
  function getFirstDayOfLastMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 30).toISOString();
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
        // timeMin:new Date().toISOString(),
        // timeMin: "2025-07-01T00:00:00.000Z",
      });
      // console.log('calendar events:', data.items);
      // console.log("req.query: ", req.query.page);
      const currentPage = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 2;
      // console.log("page:", currentPage, "pageSize:", pageSize);
      const allEvents = data.items || [];
      // Filter for pending events (future events only)
      const now = new Date();
      const pendingEvents = allEvents.filter((event) => {
        if (!event.start) return false;
        const eventDateStr = event.start.dateTime || event.start.date;
        if (!eventDateStr) return false;
        const eventDate = new Date(eventDateStr);
        return eventDate > now;
      });
      pendingEvents.sort((a, b) => {
        const dateA = new Date(a.start?.dateTime || a.start?.date || 0);
        const dateB = new Date(b.start?.dateTime || b.start?.date || 0);
        return dateB - dateA;
      });
      const completedEvents = allEvents.filter((event) => {
        if (!event.start) return false;
        const eventDateStr = event.start.dateTime || event.start.date;
        if (!eventDateStr) return false;
        const eventDate = new Date(eventDateStr);
        return eventDate <= now;
      });

      const totalEvents = pendingEvents.length;
      const totalPages = Math.ceil(totalEvents / pageSize);
      // console.log("totalpages: ", totalPages);
      const start = (currentPage - 1) * pageSize;
      const paginatedEvents = pendingEvents.slice(start, start + pageSize);
      // console.log("totalEvents:", totalEvents);
      const pagination = { totalEvents, pageSize, currentPage, totalPages };
      const counts = {
        pending: pendingEvents.length,
        completed: completedEvents.length,
        total: allEvents.length,
      };
      res.status(200).json({
        events: paginatedEvents,
        pagination,
        allEvents,
        counts,
      });
    } catch (error) {
      const { responseObject } = getBackendErrorResponseObject(error);

      res.status(400).json(responseObject);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
