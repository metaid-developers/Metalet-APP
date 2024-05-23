import "./globals.js";
import AppNavigator from "./src/base/AppNavigator";
import { UserProvider, useData } from "./src/hooks/MyProvider";

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}


