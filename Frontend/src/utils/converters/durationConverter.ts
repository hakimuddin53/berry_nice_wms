export const durationConverter = {
  minutesToHourAndMinutes: (minutes: number) =>
    (minutes > 60 ? Math.floor(minutes / 60) + "h " : "") +
    (minutes % 60) +
    "min",
};
