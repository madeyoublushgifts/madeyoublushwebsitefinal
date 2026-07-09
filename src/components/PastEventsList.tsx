import type { MarketEvent } from "@/data/upcomingEvents";

const parseEventDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
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
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 text-left"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-muted text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {d.toLocaleDateString("en-CA", { month: "short" })}
                </span>
                <span className="text-xl font-bold text-foreground/80 leading-none">{d.getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
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
