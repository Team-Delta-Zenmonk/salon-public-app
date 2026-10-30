export const GENDER = {
  MALE: "male",
  FEMALE: "female",
  UNISEX: "unisex",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export enum ServiceGender {
  ALL = "all",
  MALE = "male",
  FEMALE = "female",
  UNISEX = "unisex",
}

export const SERVICE_GENDER_OPTIONS = [
  { id: ServiceGender.ALL, label: "All" },
  { id: ServiceGender.UNISEX, label: "Unisex" },
  { id: ServiceGender.FEMALE, label: "Female" },
  { id: ServiceGender.MALE, label: "Male" },
];

export const GenderOptions = [
  { label: "Male", value: GENDER.MALE },
  { label: "Female", value: GENDER.FEMALE },
  { label: "Unisex", value: GENDER.UNISEX },
];
