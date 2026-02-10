import { View, Text } from "react-native";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getAgeGroup } from "../utils/ageUtils";
import { coursesByAgeGroup } from "../data/courses";

export default function CoursesScreen() {
  const { age } = useContext(UserContext);
  const ageGroup = getAgeGroup(age);

  let title;
  let description;

  switch (ageGroup) {
    case "elementary":
      title = "Elementary Courses";
      description =
        "Learn how to earn, save, and spend money through fun activities.";
      break;

    case "middle":
      title = "Middle School Courses";
      description =
        "Practice budgeting, smart spending, and decision-making.";
      break;

    case "advanced":
      title = "Advanced Courses";
      description =
        "Explore investing, credit, taxes, and long-term financial planning.";
      break;
  }

  return (
    <View>
      <Text>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
}


const courses = coursesByAgeGroup[ageGroup];

{courses.map(course => (
  <Text key={course.id}>
    {course.title} – {Math.round(course.progress * 100)}%
  </Text>
))}
