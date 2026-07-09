import type { MarketEvent, MarketEventPolaroid } from "@/data/upcomingEvents";
import { cn } from "@/lib/utils";

const parseEventDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const getEventPolaroids = (event: MarketEvent): MarketEventPolaroid[] => {
  if (event.polaroids?.length) return event.polaroids;
  if (event.imageSrc) {
    return [{ src: event.imageSrc, caption: event.imageCaption }];
  }
  return [];
};

const POLAROID_ROTATIONS = [-3, 2, -2, 1];

const PolaroidVineBorder = ({ className }: { className?: string }) => (
  <svg
    className={cn("pointer-events-none absolute inset-0 h-full w-full text-primary/40", className)}
    viewBox="0 0 160 200"
    preserveAspectRatio="none"
    aria-hidden
  >
    {/* Top-left vine */}
    <path
      d="M6 22 C4 10 14 6 24 10 C18 14 12 18 10 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <ellipse cx="20" cy="11" rx="2.5" ry="4" fill="currentColor" opacity="0.55" transform="rotate(-35 20 11)" />
    <ellipse cx="11" cy="22" rx="2" ry="3.5" fill="currentColor" opacity="0.45" transform="rotate(20 11 22)" />

    {/* Top-right vine */}
    <path
      d="M154 22 C156 10 146 6 136 10 C142 14 148 18 150 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <ellipse cx="140" cy="11" rx="2.5" ry="4" fill="currentColor" opacity="0.55" transform="rotate(35 140 11)" />
    <ellipse cx="149" cy="22" rx="2" ry="3.5" fill="currentColor" opacity="0.45" transform="rotate(-20 149 22)" />

    {/* Bottom-left curl */}
    <path
      d="M8 168 C6 180 16 186 26 180 C20 174 14 170 12 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <ellipse cx="18" cy="182" rx="2" ry="3" fill="currentColor" opacity="0.5" transform="rotate(40 18 182)" />

    {/* Bottom-right curl */}
    <path
      d="M152 168 C154 180 144 186 134 180 C140 174 146 170 148 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <ellipse cx="142" cy="182" rx="2" ry="3" fill="currentColor" opacity="0.5" transform="rotate(-40 142 182)" />

    {/* Soft top edge tendril */}
    <path
      d="M40 8 C70 4 90 4 120 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.35"
    />
    <ellipse cx="72" cy="6" rx="1.8" ry="3" fill="currentColor" opacity="0.4" />
    <ellipse cx="98" cy="6" rx="1.8" ry="3" fill="currentColor" opacity="0.4" />
  </svg>
);

type PolaroidFrameProps = {
  polaroid: MarketEventPolaroid;
  event: MarketEvent;
  rotation: number;
};

const PolaroidFrame = ({ polaroid, event, rotation }: PolaroidFrameProps) => {
  const caption = polaroid.caption ?? event.detail;
  const alt = polaroid.alt ?? `${event.title} at ${event.detail}`;

  return (
    <figure
      className="shrink-0 transition-transform duration-300 ease-out hover:rotate-0"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative bg-secondary p-2.5 pb-9 shadow-[0_6px_24px_hsl(var(--primary)/0.12)] ring-1 ring-primary/10">
        <PolaroidVineBorder />
        <img
          src={polaroid.src}
          alt={alt}
          className="relative z-[1] w-28 sm:w-32 aspect-[4/5] object-cover"
          loading="lazy"
          decoding="async"
        />
        <figcaption className="relative z-[1] font-heading text-[11px] text-center text-foreground mt-3 px-1 leading-snug">
          {caption}
        </figcaption>
      </div>
    </figure>
  );
};

type PastEventPolaroidsProps = {
  event: MarketEvent;
  dateLabel: string;
};

const PastEventPolaroids = ({ event, dateLabel }: PastEventPolaroidsProps) => {
  const polaroids = getEventPolaroids(event);

  if (polaroids.length === 0) {
    const d = parseEventDate(event.date);
    return (
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-muted text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {d.toLocaleDateString("en-CA", { month: "short" })}
        </span>
        <span className="text-xl font-bold text-foreground/80 leading-none">{d.getDate()}</span>
      </div>
    );
  }

  return (
    <div className="shrink-0 w-full sm:w-auto">
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 py-1">
        {polaroids.map((polaroid, index) => (
          <PolaroidFrame
            key={`${polaroid.src}-${index}`}
            polaroid={polaroid}
            event={event}
            rotation={POLAROID_ROTATIONS[index % POLAROID_ROTATIONS.length]}
          />
        ))}
      </div>
      <span className="sr-only">{dateLabel}</span>
    </div>
  );
};

type PastEventsListProps = {
  events: MarketEvent[];
};

const PastEventsList = ({ events }: PastEventsListProps) => {
  if (events.length === 0) return null;

  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-[2rem] border-2 border-primary/15 bg-card/80 shadow-soft overflow-hidden">
      <div className="px-5 py-4 sm:px-8 border-b border-primary/10 bg-muted/30 text-center">
        <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
          Past events
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Where we&apos;ve popped up lately</p>
      </div>
      <ul className="divide-y divide-border">
        {sorted.map((ev) => {
          const d = parseEventDate(ev.date);
          const dateLabel = d.toLocaleDateString("en-CA", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          return (
            <li
              key={`${ev.date}-${ev.title}`}
              className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6 p-5 sm:p-6 text-left"
            >
              <PastEventPolaroids event={ev} dateLabel={dateLabel} />
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="font-heading text-lg font-semibold text-foreground">{ev.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{ev.detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{dateLabel}</p>
                {ev.instagramUrl ? (
                  <a
                    href={ev.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-primary underline-offset-4 hover:underline mt-2"
                  >
                    View on Instagram
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PastEventsList;
