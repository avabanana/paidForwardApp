import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CoursesScreen from "../screens/CoursesScreen";
import GamesScreen from "../screens/GamesScreen";
import DiscussionScreen from "../screens/DiscussionScreen";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Courses" component={CoursesScreen} />
        <Tab.Screen name="Games" component={GamesScreen} />
        <Tab.Screen name="Discussion" component={DiscussionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
