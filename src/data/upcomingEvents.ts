import {
  pastEventMidsommarMarket,
  pastEventMidsommarMauveBouquet,
  pastEventMidsommarYellowRoses,
} from "@/assets/images";

/** A single polaroid photo for a past event. */
export type MarketEventPolaroid = {
  src: string;
  caption?: string;
  alt?: string;
};

/** Market & pop-up events for the Pop-ups page calendar and scrapbook. */
export type MarketEvent = {
  /** Local calendar date, e.g. "2026-06-20" */
  date: string;
  title: string;
  detail: string;
  instagramUrl?: string;
  /** @deprecated Prefer `polaroids` */
  imageSrc?: string;
  /** @deprecated Prefer `polaroids` */
  imageCaption?: string;
  polaroids?: MarketEventPolaroid[];
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
    polaroids: [
      {
        src: pastEventMidsommarMarket,
        caption: "Our booth · Fox Theatre",
        alt: "Made You Blush market booth at Fox Theatre",
      },
      {
        src: pastEventMidsommarYellowRoses,
        caption: "Yellow roses · June '26",
        alt: "Yellow rose bouquet at Fox Theatre",
      },
      {
        src: pastEventMidsommarMauveBouquet,
        caption: "Summer blooms · Fox Theatre",
        alt: "Mauve bouquet with ferns at Fox Theatre",
      },
    ],
  },
];
