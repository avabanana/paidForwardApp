import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CoursesScreen from "../screens/CoursesScreen";
import GamesScreen from "../screens/GamesScreen";
import DiscussionScreen from "../screens/DiscussionScreen";
import AgeGate from "../screens/AgeGate";

import { UserContext } from "../context/UserContext";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const { age } = useContext(UserContext);

  // If age not set, force onboarding
  if (age === null) {
    return (
      <NavigationContainer>
        <AgeGate />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Courses" component={CoursesScreen} />
        <Tab.Screen name="Games" component={GamesScreen} />

        {/* Only show Discussion for 14+ */}
        {age >= 14 && (
          <Tab.Screen name="Discussion" component={DiscussionScreen} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
