"use client";
import { useGoogleOneTapLogin } from "@/hooks/useGoogleTabLogin";
import { CopyBlock, dracula } from "react-code-blocks";

export default function Home() {
  const { response, history } = useGoogleOneTapLogin();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full p-10 bg-white text-black">
        <p>
          Hello! This is a demo for{" "}
          <a href="https://viblo.asia/p/one-tap-google-sign-in-aNj4vb3K46r">
            Google One Tap Sign In
          </a>
        </p>
        <p>
          Made by <span className="font-bold">leeminkan</span>. Check the source
          code{" "}
          <a
            href="https://github.com/leeminkan/nextjs-demo-google-one-tap-sign-in"
            className="font-bold"
          >
            here
          </a>
          !
        </p>
        <div className="mt-2">
          <p>
            The One Tap Popup will appear on the top-right of the screen every
            2s!
          </p>
          <p>
            After choosing an google account, we can receive the response after
            sign in successfully
          </p>
          <div className="mt-2 p-2 bg-slate-400">
            <p className="overflow-x-auto">{JSON.stringify(response)}</p>
          </div>
          <p className="mt-2">
            We can use this response.credential to fetch the user account
            information, such as email, picture... in our server
          </p>
          <CopyBlock
            text={`
            import { OAuth2Client } from "google-auth-library";

            const googleAuthClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
            const token = response?.credential;
            const ticket = await googleAuthClient.verifyIdToken({
              idToken: token,
              audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            });
            
            const payload = ticket.getPayload();
            if (!payload) {
              throw new Error("Cannot extract payload from sign-in token");
            }

            const { email, sub, given_name, family_name, email_verified, picture: image } = payload;
            `}
            language="js"
            showLineNumbers={true}
            theme={dracula}
          />
          <p className="mt-2">
            If there are any issues, the popup does not appear. Please check
            this log
          </p>
          <div className="mt-2 bg-slate-400">
            <ul className="overflow-y-auto h-32 p-2">
              {history
                .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
                .map((item, index) => (
                  <li key={index}>{item.timestamp + ": " + item.message}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
