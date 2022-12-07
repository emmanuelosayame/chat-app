import FileResizer from "react-image-file-resizer";

export const limitText = (sentence: string, limit: number = 20) =>
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

export const resizeImage = (file: File) => {
  return new Promise<any>((resolve) => {
    FileResizer.imageFileResizer(
      file,
      150,
      150,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
};
