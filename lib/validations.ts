import { object, string, mixed, ref, boolean } from "yup";

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

export const authVs = {
  login: object().shape({
    email: string().email("enter a valid").required(" enter your email"),
    password: string()
      .min(6, "enter a correct password")
      .max(100)
      .required("enter your password"),
    rp: boolean(),
  }),
  register: object().shape({
    email: string().email("enter a valid").required(" enter your email"),
    password: string()
      .min(6, "too short")
      .max(100)
      .required("enter your password"),
    confirmPassword: string().oneOf(
      [ref("password"), null],
      "Passwords don't match"
    ),
    atc: boolean().oneOf([true], "You must accept the terms and conditions"),
  }),
};
