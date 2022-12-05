export const limitText = (sentence: string, limit: number) =>
  sentence?.length > limit ? sentence.slice(0, limit) + "..." : sentence;

export const dateLocale = (date: Date) => {
  const conv = new Date(date);
  return conv.toLocaleDateString("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const dateTimeLocale = (date: Date) => {
  const conv = new Date(date);
  return conv.toLocaleString("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
