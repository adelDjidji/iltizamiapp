import moment from "moment";

export interface ChallengeState {
  totalStars: number;
  bestStreak: number;
  currentStreak: number;
  totalSuccessDays: number;
  /** Progress days within the current 40-day block (0–40). */
  daysInCurrentCycle: number;
  perfectSet: Set<string>;
  completionDates: Set<string>;
}

/**
 * Determines if a day's data represents a perfect prayer day.
 * All 5 prayers (indices 0-4 in data[0]) must be 10.
 */
export function isPerfectDay(data: number[][]): boolean {
  const p = data?.[0];
  return (
    Array.isArray(p) &&
    p.length >= 5 &&
    p[0] === 10 &&
    p[1] === 10 &&
    p[2] === 10 &&
    p[3] === 10 &&
    p[4] === 10
  );
}

/**
 * Computes the full 40-days challenge state from raw daily results.
 * The streak breaks if any recorded day is not perfect, or if a day is skipped.
 */
export function computeChallengeState(
  results: { date: string; data: number[][] }[]
): ChallengeState {
  const sorted = [...results]
    .filter((r) => r.date && r.data?.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const perfectSet = new Set<string>();
  sorted.forEach((r) => {
    if (isPerfectDay(r.data)) perfectSet.add(r.date);
  });

  type Run = { start: string; end: string; length: number };
  const allRuns: Run[] = [];
  let runStart = "";
  let runEnd = "";
  let runLen = 0;
  let prevDate = "";

  for (const r of sorted) {
    if (isPerfectDay(r.data)) {
      const isConsecutive =
        prevDate !== "" && moment(r.date).diff(moment(prevDate), "days") === 1;

      if (isConsecutive) {
        runLen++;
        runEnd = r.date;
      } else {
        if (runLen > 0) allRuns.push({ start: runStart, end: runEnd, length: runLen });
        runStart = r.date;
        runEnd = r.date;
        runLen = 1;
      }
      prevDate = r.date;
    } else {
      if (runLen > 0) allRuns.push({ start: runStart, end: runEnd, length: runLen });
      runLen = 0;
      prevDate = "";
      runStart = "";
      runEnd = "";
    }
  }
  if (runLen > 0) allRuns.push({ start: runStart, end: runEnd, length: runLen });

  const totalStars = allRuns.reduce((sum, run) => sum + Math.floor(run.length / 40), 0);
  const bestStreak = allRuns.reduce((max, run) => Math.max(max, run.length), 0);
  const totalSuccessDays = perfectSet.size;

  // Current streak is the last run if it ends today or yesterday
  let currentStreak = 0;
  if (allRuns.length > 0) {
    const lastRun = allRuns[allRuns.length - 1];
    const diffDays = moment().startOf("day").diff(moment(lastRun.end).startOf("day"), "days");
    if (diffDays <= 1) currentStreak = lastRun.length;
  }

  const daysInCurrentCycle = currentStreak % 40;

  // Mark the date of each 40th consecutive day as a completion milestone
  const completionDates = new Set<string>();
  for (const run of allRuns) {
    for (let i = 40; i <= run.length; i += 40) {
      completionDates.add(moment(run.start).add(i - 1, "days").locale("en").format("YYYY-MM-DD"));
    }
  }

  return {
    totalStars,
    bestStreak,
    currentStreak,
    totalSuccessDays,
    daysInCurrentCycle,
    perfectSet,
    completionDates,
  };
}
