import {
  pastEventMidsommarMarket,
  pastEventMidsommarMauveBouquet,
  pastEventMidsommarYellowRoses,
  pastEventRiverdaleHubBoothCollab,
  pastEventRiverdaleHubBoothSign,
  pastEventRiverdaleHubMiniBouquet,
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
    date: "2026-07-11",
    title: "Festival Of South Asia - Artisan Market @ The Riverdale Hub",
    detail: "The Riverdale Hub, Gerrard India Bazaar",
    instagramUrl: "https://www.instagram.com/p/DbMTUSIGmO0/",
    polaroids: [
      {
        src: pastEventRiverdaleHubBoothSign,
        caption: "Our booth · Riverdale Hub",
        alt: "Made You Blush make-your-own bouquet booth at Riverdale Hub",
      },
      {
        src: pastEventRiverdaleHubBoothCollab,
        caption: "Stem stand · July '26",
        alt: "Flower stem stand and gift table at Riverdale Hub pop-up",
      },
      {
        src: pastEventRiverdaleHubMiniBouquet,
        caption: "Hand-tied mini bouquet",
        alt: "Pink rose and carnation mini bouquet from Riverdale Hub",
      },
    ],
  },
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
