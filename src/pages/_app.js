import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.css";
import ThemeComponent from "@/components/custom/ThemeComponent";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeComponent />
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
