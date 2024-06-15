"use client";
import { CredentialResponse } from "google-one-tap";
import { useCallback, useEffect, useState } from "react";

export const useGoogleOneTapLogin = () => {
  const [response, setResponse] = useState<CredentialResponse | null>(null);
  const [history, setHistory] = useState<
    { message: string; timestamp: Date }[]
  >([]);

  const oneTap = useCallback(() => {
    const { google } = window;

    if (google) {
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
        throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not config");

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setResponse(response);
          // Here we should process the credential here
        },
      });

      // google.accounts.id.prompt() // without listening to notification
      google.accounts.id.prompt((notification) => {
        // Here we just console.log some error situations and reason why the google one tap
        // is not displayed. You may want to handle it depending on your application
        console.log("notification", notification);
        if (notification.isNotDisplayed()) {
          console.log(
            "getNotDisplayedReason:",
            notification.getNotDisplayedReason()
          );
          setHistory([
            ...history,
            {
              message:
                "getNotDisplayedReason: " +
                notification.getNotDisplayedReason(),
              timestamp: new Date(),
            },
          ]);
        } else if (notification.isSkippedMoment()) {
          console.log("getSkippedReason :", notification.getSkippedReason());
          setHistory([
            ...history,
            {
              message: "getSkippedReason: " + notification.getSkippedReason(),
              timestamp: new Date(),
            },
          ]);
        } else if (notification.isDismissedMoment()) {
          console.log("getDismissedReason:", notification.getDismissedReason());
          setHistory([
            ...history,
            {
              message:
                "getDismissedReason: " + notification.getDismissedReason(),
              timestamp: new Date(),
            },
          ]);
        }
      });
    }
  }, [history]);

  useEffect(() => {
    // will show popup after two secs
    const timeout = setTimeout(() => oneTap(), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [oneTap]);

  return { response, history };
};
