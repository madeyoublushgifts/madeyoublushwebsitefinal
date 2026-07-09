/** Market & pop-up events for the Contact page calendar. */
export type MarketEvent = {
  /** Local calendar date, e.g. "2026-06-20" */
  date: string;
  title: string;
  detail: string;
  instagramUrl?: string;
};

/** @deprecated Use MarketEvent */
export type UpcomingEvent = MarketEvent;

export const upcomingEvents: MarketEvent[] = [];

export const pastEvents: MarketEvent[] = [
  {
    date: "2026-06-20",
    title: "Midsommar Market",
    detail: "Fox Theatre, The Beaches",
    instagramUrl: "https://www.instagram.com/p/DaB1VDuEfP7/?img_index=1",
  },
];
