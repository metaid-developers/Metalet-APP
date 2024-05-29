import "./globals.js";
import { useEffect } from "react";
import AppNavigator from "./src/base/AppNavigator";
import { UserProvider } from "./src/hooks/MyProvider";
import useWalletManager from "@/hooks/useWalletManager";

export default function App() {
  const { initWalletManager } = useWalletManager();

  useEffect(() => {
    initWalletManager();
  }, []);
  
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
