import "./globals.js";
import { useEffect } from "react";
import { UserProvider } from "./src/hooks/MyProvider";
import AppNavigator from "./src/base/AppNavigator.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      cacheTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Disable refetch on window focus for React Native
    },
  },
});

export default function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
      </QueryClientProvider>
    </UserProvider>
  );
}
