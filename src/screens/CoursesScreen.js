import { View, Text } from "react-native";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function CoursesScreen() {
  const { age } = useContext(UserContext);

  let title = "Courses";

  if (age < 11) title = "Elementary Courses";
  else if (age < 14) title = "Middle School Courses";
  else title = "Advanced Courses";

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
