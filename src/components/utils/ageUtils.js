// src/utils/ageUtils.js
export const getAgeGroup = (age) => {
  if (age < 13) return 'kids';
  if (age >= 13 && age < 18) return 'teens';
  return 'adults';
};