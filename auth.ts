// // auth.ts
// import NextAuth from "next-auth";
// import Spotify from "next-auth/providers/spotify";
// import type { JWT } from "next-auth/jwt";
// import type { Session } from "next-auth";

// // ---- Refresh helper ----
// async function refreshSpotifyAccessToken(token: JWT): Promise<JWT> {
//   try {
//     const params = new URLSearchParams();
//     params.append("grant_type", "refresh_token");
//     params.append("refresh_token", token.refreshToken as string);

//     const res = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: {
//         Authorization:
//           "Basic " +
//           Buffer.from(
//             `${process.env.SPOTIFY_CLIENT_ID!}:${process.env.SPOTIFY_CLIENT_SECRET!}`
//           ).toString("base64"),
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: params.toString(),
//     });

//     const refreshed = await res.json();

//     if (!res.ok) throw refreshed;

//     return {
//       ...token,
//       accessToken: refreshed.access_token,
//       accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
//       refreshToken: refreshed.refresh_token ?? token.refreshToken,
//       error: undefined,
//     };
//   } catch (err) {
//     console.error("Error refreshing Spotify token:", err);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// // ---- NextAuth config ----
// export const {
//   // we destructure GET/POST here so they are real functions, not wrapped objects
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   // built-in provider; we override clientId/secret so you can keep your existing env vars
//   providers: [
//     Spotify({
//       authorization:
//         "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private",
//       clientId: process.env.SPOTIFY_CLIENT_ID!,
//       clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, account, user }) {
//       // Initial sign-in
//       if (account) {
//         return {
//           ...token,
//           user: user ?? token.user,
//           accessToken: account.access_token,
//           refreshToken: account.refresh_token,
//           accessTokenExpires: Date.now() + Number(account.expires_in) * 1000,
//         };
//       }

//       // If we still have a valid access token, just return it
//       if (
//         token.accessToken &&
//         typeof token.accessTokenExpires === "number" &&
//         Date.now() < token.accessTokenExpires
//       ) {
//         return token;
//       }

//       // Otherwise refresh
//       return await refreshSpotifyAccessToken(token);
//     },

//     async session({ session, token }) {
//       // Attach our custom fields to the session
//       (session as Session & {
//         accessToken?: string;
//         error?: string;
//       }).accessToken = token.accessToken as string | undefined;

//       (session as Session & { error?: string }).error = token.error as
//         | string
//         | undefined;

//       // You also stored user on the token:
//       if (token.user) {
//         session.user = token.user as any;
//       }

//       return session;
//     },
//   },
// });

