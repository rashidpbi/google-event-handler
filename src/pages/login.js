import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/google");
      const { authUrl } = await response.json();
      localStorage.setItem("loggedOutDueToTokenIssue", "false");
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const refresh_token = Cookies.get("refresh_token");
    const wasLoggedOut = localStorage.getItem("loggedOutDueToTokenIssue");
    // console.log(
    //   "refresh_token:",
    //   refresh_token,
    //   "wasLoggedOut:",
    //   !wasLoggedOut
    // );

    if (refresh_token && wasLoggedOut !== "true") {
      window.location.href = "http://localhost:3000";
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? "Redirecting..." : "Login with Google"}
      </Button>
    </div>
  );
}
