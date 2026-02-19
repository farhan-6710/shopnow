"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Exchange the code for a session
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get("code");

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      // Wait a moment for the session to be established
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if this window was opened as a popup
      if (window.opener && !window.opener.closed) {
        // Close the popup window
        window.close();
      } else {
        // If not a popup (or opener was closed), redirect to home
        router.push("/");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  );
}
