// src/data/mockProgress.js
export const userProgress = {
  1: 1.0,
  2: 0.8,
  3: 0.0,
  4: 0.0,
  // additional slots are available for new courses
};

function isCourseUnlocked(index, courses, progressMap) {
  if (index === 0) return true;

  const prevCourse = courses[index - 1];
  return (progressMap[prevCourse.id] ?? 0) >= 0.7;
}
