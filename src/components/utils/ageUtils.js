// src/utils/ageUtils.js

export function getAgeGroup(age) {
  if (age < 11) return "elementary";
  if (age < 14) return "middle";
  return "advanced";
}
