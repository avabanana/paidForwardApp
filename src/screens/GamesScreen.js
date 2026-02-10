import { View, Text } from "react-native";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function GamesScreen() {
  const { age } = useContext(UserContext);

  let message;

  if (age < 11) {
    message = "Earn coins and save for fun rewards!";
  } else if (age < 14) {
    message = "Make choices and see how they affect your budget.";
  } else {
    message = "Simulate real-life decisions: jobs, credit, investing.";
  }

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
}
