import { UserProvider } from "./src/context/UserContext";
import Navigation from "./src/navigation/Navigation";

export default function App() {
  return (
    <UserProvider>
      <Navigation />
    </UserProvider>
  );
}
