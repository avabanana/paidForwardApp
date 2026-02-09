import { useState, useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { UserContext } from "../context/UserContext";

export default function AgeGate() {
  const [inputAge, setInputAge] = useState("");
  const { setAge } = useContext(UserContext);

  return (
    <View>
      <Text>How old are you?</Text>

      <TextInput
        keyboardType="number-pad"
        value={inputAge}
        onChangeText={setInputAge}
        placeholder="Enter your age"
      />

      <Button
        title="Continue"
        onPress={() => setAge(Number(inputAge))}
      />
    </View>
  );
}
