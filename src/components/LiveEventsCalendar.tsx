import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { UpcomingEvent } from "@/data/upcomingEvents";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const sameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const parseEventDate = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const useToday = () => {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setToday(new Date());
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return today;
};

const getCurrentWeek = (today: Date) => {
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const formatWeekRange = (weekDays: Date[]) => {
  const start = weekDays[0];
  const end = weekDays[6];
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-CA", opts);
  const endStr = end.toLocaleDateString("en-CA", {
    ...opts,
    year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined,
  });
  if (start.getMonth() === end.getMonth() && start.getDate() === end.getDate()) {
    return startStr;
  }
  return `${startStr} – ${endStr}`;
};

type LiveEventsCalendarProps = {
  events?: UpcomingEvent[];
  emptyMessage: ReactNode;
};

const LiveEventsCalendar = ({ events = [], emptyMessage }: LiveEventsCalendarProps) => {
  const today = useToday();
  const month = today.getMonth();

  const weekDays = useMemo(() => getCurrentWeek(today), [today]);
  const weekRangeLabel = useMemo(() => formatWeekRange(weekDays), [weekDays]);

  const eventDateKeys = useMemo(() => {
    const set = new Set<string>();
    for (const ev of events) {
      const d = parseEventDate(ev.date);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    }
    return set;
  }, [events]);

  const hasEventOn = (date: Date) =>
    eventDateKeys.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);

  const isDateInWeek = (date: Date) =>
    weekDays.some((d) => sameCalendarDay(d, date));

  const eventsThisWeek = useMemo(
    () =>
      [...events]
        .filter((ev) => isDateInWeek(parseEventDate(ev.date)))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [events, weekDays]
  );

  return (
    <div className="rounded-[2rem] border-2 border-primary/25 bg-gradient-to-b from-primary/8 via-card to-accent/5 shadow-soft overflow-hidden">
      <div className="bg-primary/12 px-5 py-4 sm:px-8 sm:py-5 text-center">
        <p className="font-heading text-lg sm:text-xl font-semibold text-primary tracking-tight">
          This week
        </p>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">{weekRangeLabel}</p>
      </div>

      <div className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 max-w-2xl mx-auto">
          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={`week-h-${i}`}
              className="text-center text-[11px] sm:text-sm font-semibold text-primary/80 pb-1"
            >
              {label}
            </div>
          ))}
          {weekDays.map((date) => {
            const inCurrentMonth = date.getMonth() === month;
            const dayNum = date.getDate();
            const isToday = sameCalendarDay(date, today);
            const hasEvent = hasEventOn(date);

            return (
              <div
                key={date.toISOString()}
                className={[
                  "flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl min-h-[3.25rem] sm:min-h-[4.5rem] transition-all duration-200",
                  isToday
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.04] ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
                    : hasEvent
                      ? "bg-primary/15 text-foreground ring-2 ring-primary/25"
                      : inCurrentMonth
                        ? "bg-background/90 text-foreground border border-primary/10"
                        : "bg-muted/40 text-muted-foreground border border-transparent",
                ].join(" ")}
              >
                <span
                  className={[
                    "font-heading font-bold leading-none",
                    isToday ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                  ].join(" ")}
                >
                  {dayNum}
                </span>
                {isToday && (
                  <span className="text-[10px] sm:text-xs font-medium mt-1 opacity-90">today</span>
                )}
                {hasEvent && !isToday && (
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"
                    aria-label="Event"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-10 sm:px-10 sm:py-12 text-center border-t border-primary/10 bg-card/50">
        {emptyMessage}
      </div>

      {eventsThisWeek.length > 0 && (
        <div className="divide-y divide-border border-t border-primary/10">
          {eventsThisWeek.map((ev) => {
            const d = parseEventDate(ev.date);
            return (
              <div
                key={`${ev.date}-${ev.title}`}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 text-left"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/10 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {d.toLocaleDateString("en-CA", { month: "short" })}
                  </span>
                  <span className="text-xl font-bold text-primary leading-none">{d.getDate()}</span>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-foreground">{ev.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{ev.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveEventsCalendar;
