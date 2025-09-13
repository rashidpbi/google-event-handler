import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import ThemeComponent from "@/components/custom/ThemeComponent";
import "@etchteam/next-pagination/dist/index.css";
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeComponent />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
