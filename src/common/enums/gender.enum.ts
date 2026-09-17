export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  UNISEX: "unisex",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export const GenderOptions = [
  { label: "Male", value: GENDER.MALE },
  { label: "Female", value: GENDER.FEMALE },
  { label: "Unisex", value: GENDER.UNISEX },
];
