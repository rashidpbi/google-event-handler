import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
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
    if (refresh_token && wasLoggedOut !== "true") {
      window.location.href = "http://localhost:3000";
    }
  }, []);

  return (
    <div className="grid size-120  mx-auto  ">
      <div className="grid gap-2  w-80  px-auto mx-auto content-center items-center  ">
        <div className="flex bg-blue-500 size-12 justify-center items-center rounded-md mx-auto">
          <div>
            <Calendar className="text-white" />
          </div>
        </div>
        <div className="flex justify-center w-full  font-bold text-2xl">
          Event Manager
        </div>
        <div className="flex justify-center w-full ">
          Sign in to manage your calendar events
        </div>
      </div>

      
        <div className="grid gap-3   h-30 content-center justify-center shadow-lg">
          <div className="flex justify-center my-2 ">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className=" bg-white text-black border w-80 text-sm border-gray-400  hover:bg-gray-800  hover:text-white "
            >
              <FcGoogle /> {isLoading ? "Redirecting..." : "Login with Google"}
            </Button>
          </div>
          
        <div className="flex justify-center  text-gray-500  my-2">
          By signing in, you agree to sync your Google Calendar events
        </div>
        </div>
     
    </div>
  );
}
