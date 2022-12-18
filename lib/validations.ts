import { object, string, mixed } from "yup";

export const profileVS = object().shape({
  name: string().min(2, "too short").max(30, "too long"),
  userName: string().min(2, "too short").max(20, "too long"),
  about: string().max(100, "slow down"),
  photo: mixed<File>()
    .nullable()
    .test(
      "size",
      "image too large",
      (value) => !(value && value.size > 10000000)
    ),
});

export const pickerVs = object().shape({
  medias: mixed<File[]>().test("size", "media too large", (values) => {
    if (!values) return true;
    for (const file of values) {
      if (file.size > 1000000000) return false;
    }
    return true;
  }),
  documents: mixed<File[]>().test("size", "document too large", (values) => {
    if (!values) return true;
    for (const file of values) {
      if (file.size > 100000000) return false;
    }
    return true;
  }),
});

export const stickerVs = mixed<File>().test(
  "size",
  "sticker too large",
  (file) => {
    if (!file) return true;
    if (file.size > 10000000) return false;
    return true;
  }
);
