/**
 * Scheduling, shared by everything that talks about a pickup window.
 *
 * The booking flow asks for the day and window BEFORE it asks what the load is,
 * so availability is now the first thing the customer sees and the last thing
 * they change. That means the homepage banner, the date strip on /checkout and
 * the receipt all have to agree about which days exist, and they can only agree
 * if they read one source. That source is this file.
 *
 * Every function here derives from the real clock, so nothing may be called
 * during render on a statically prerendered page: the HTML is baked at build
 * time and would disagree with the client on the first paint. Call them in an
 * effect, or from an event handler.
 */

export interface TimeSlot {
  id: string
  label: string
  time: string
  /** Start of the window, for places too tight for the full range. */
  short: string
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: "morning", label: "Morning", time: "8:00 – 11:00 AM", short: "8AM" },
  { id: "mid-day", label: "Mid-Day", time: "11:00 AM – 2:00 PM", short: "11AM" },
  { id: "afternoon", label: "Afternoon", time: "2:00 – 5:00 PM", short: "2PM" },
  { id: "evening", label: "Late Afternoon", time: "5:00 – 7:00 PM", short: "5PM" },
]

/** Crews run Monday through Saturday. Only Sunday is off. */
function isWorkingDay(d: Date): boolean {
  return d.getDay() !== 0
}

/** The next `count` bookable days, starting tomorrow. */
export function getAvailableDates(count = 18): Date[] {
  const dates: Date[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() + 1)
  while (dates.length < count) {
    if (isWorkingDay(cursor)) dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function formatVisitDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

export interface NextOpening {
  day: string
  /** Full window, e.g. "8:00 – 11:00 AM". */
  window: string
  /** One-line form for a button, e.g. "Tomorrow, 8AM". */
  short: string
}

/**
 * The banner line, e.g. "Tomorrow, 8:00 – 11:00 AM" or "Monday, 8:00 – 11:00 AM".
 *
 * Deliberately the first slot on the first bookable day: it is the soonest thing
 * a customer can actually have, so it is the only claim the booking flow can
 * keep. Naming the weekday when it is not tomorrow avoids the "next available:
 * tomorrow" that quietly means Monday on a Saturday night.
 */
export function nextOpening(): NextOpening {
  const [first] = getAvailableDates(1)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const day = isSameDay(first, tomorrow)
    ? "Tomorrow"
    : first.toLocaleDateString("en-US", { weekday: "long" })
  return { day, window: TIME_SLOTS[0].time, short: `${day}, ${TIME_SLOTS[0].short}` }
}
