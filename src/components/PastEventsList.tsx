import type { MarketEvent, MarketEventPolaroid } from "@/data/upcomingEvents";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Instagram } from "lucide-react";

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

const InstagramEventLink = ({
  href,
  className,
  align = "center",
}: {
  href: string;
  className?: string;
  align?: "center" | "start";
}) => (
  <div className={cn(align === "center" ? "flex justify-center" : "flex justify-center sm:justify-start", className)}>
    <Button asChild size="lg" className="rounded-full min-h-11 px-6 shadow-soft">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Instagram className="mr-2 h-5 w-5" />
        View on Instagram
      </a>
    </Button>
  </div>
);

const POLAROID_ROTATIONS = [-3.5, 2.5, -2, 1.5, -1];

const PolaroidVineBorder = ({ className }: { className?: string }) => (
  <svg
    className={cn("pointer-events-none absolute inset-0 h-full w-full text-primary/40", className)}
    viewBox="0 0 160 200"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      d="M6 22 C4 10 14 6 24 10 C18 14 12 18 10 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <ellipse cx="20" cy="11" rx="2.5" ry="4" fill="currentColor" opacity="0.55" transform="rotate(-35 20 11)" />
    <ellipse cx="11" cy="22" rx="2" ry="3.5" fill="currentColor" opacity="0.45" transform="rotate(20 11 22)" />
    <path
      d="M154 22 C156 10 146 6 136 10 C142 14 148 18 150 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <ellipse cx="140" cy="11" rx="2.5" ry="4" fill="currentColor" opacity="0.55" transform="rotate(35 140 11)" />
    <ellipse cx="149" cy="22" rx="2" ry="3.5" fill="currentColor" opacity="0.45" transform="rotate(-20 149 22)" />
    <path
      d="M8 168 C6 180 16 186 26 180 C20 174 14 170 12 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <ellipse cx="18" cy="182" rx="2" ry="3" fill="currentColor" opacity="0.5" transform="rotate(40 18 182)" />
    <path
      d="M152 168 C154 180 144 186 134 180 C140 174 146 170 148 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <ellipse cx="142" cy="182" rx="2" ry="3" fill="currentColor" opacity="0.5" transform="rotate(-40 142 182)" />
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
  size?: "sm" | "lg";
};

const PolaroidFrame = ({ polaroid, event, rotation, size = "sm" }: PolaroidFrameProps) => {
  const caption = polaroid.caption ?? event.detail;
  const alt = polaroid.alt ?? `${event.title} at ${event.detail}`;
  const widthClass = size === "lg" ? "w-36 sm:w-44" : "w-28 sm:w-32";

  return (
    <figure
      className="shrink-0 transition-transform duration-300 ease-out hover:rotate-0 hover:-translate-y-1"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="relative bg-[#f4d6de] p-2.5 pb-10 shadow-[0_8px_28px_hsl(var(--primary)/0.14)] ring-1 ring-primary/15">
        <PolaroidVineBorder />
        <img
          src={polaroid.src}
          alt={alt}
          className={cn("relative z-[1] aspect-[4/5] object-cover", widthClass)}
          loading="lazy"
          decoding="async"
        />
        <figcaption className="relative z-[1] font-heading text-[11px] sm:text-xs text-center text-foreground/90 mt-3 px-1 leading-snug">
          {caption}
        </figcaption>
      </div>
    </figure>
  );
};

type PastEventPolaroidsProps = {
  event: MarketEvent;
  dateLabel: string;
  size?: "sm" | "lg";
};

const PastEventPolaroids = ({ event, dateLabel, size = "sm" }: PastEventPolaroidsProps) => {
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
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-5 py-1">
        {polaroids.map((polaroid, index) => (
          <PolaroidFrame
            key={`${polaroid.src}-${index}`}
            polaroid={polaroid}
            event={event}
            rotation={POLAROID_ROTATIONS[index % POLAROID_ROTATIONS.length]}
            size={size}
          />
        ))}
      </div>
      <span className="sr-only">{dateLabel}</span>
    </div>
  );
};

type PastEventsListProps = {
  events: MarketEvent[];
  title?: string;
  subtitle?: string;
  variant?: "list" | "gallery";
};

const PastEventsList = ({
  events,
  title = "Past events",
  subtitle = "Where we've popped up lately",
  variant = "list",
}: PastEventsListProps) => {
  if (events.length === 0) return null;

  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));

  if (variant === "gallery") {
    return (
      <div className="space-y-12">
        {sorted.map((ev) => {
          const d = parseEventDate(ev.date);
          const dateLabel = d.toLocaleDateString("en-CA", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          return (
            <article
              key={`${ev.date}-${ev.title}`}
              className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-b from-secondary/40 via-background to-background px-5 py-8 sm:px-10 sm:py-12 shadow-soft"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
              <div className="text-center space-y-2 mb-8 max-w-xl mx-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  {dateLabel}
                </p>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {ev.title}
                </h3>
                <p className="text-muted-foreground">{ev.detail}</p>
                {ev.instagramUrl ? (
                  <InstagramEventLink href={ev.instagramUrl} className="pt-4" />
                ) : null}
              </div>
              <div className="flex justify-center">
                <PastEventPolaroids event={ev} dateLabel={dateLabel} size="lg" />
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border-2 border-primary/15 bg-card/80 shadow-soft overflow-hidden">
      <div className="px-5 py-4 sm:px-8 border-b border-primary/10 bg-muted/30 text-center">
        <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
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
                  <InstagramEventLink href={ev.instagramUrl} align="start" className="mt-4" />
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
