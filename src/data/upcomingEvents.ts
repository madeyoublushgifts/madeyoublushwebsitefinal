/** Add confirmed pop-ups here (YYYY-MM-DD). Shown on the Contact page calendar. */
export type UpcomingEvent = {
  /** Local calendar date, e.g. "2026-06-07" */
  date: string;
  title: string;
  detail: string;
};

export const upcomingEvents: UpcomingEvent[] = [];
