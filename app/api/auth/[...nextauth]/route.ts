// app/api/auth/[...nextauth]/route.js (for App Router)
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import GoogleProvider from "next-auth/providers/google"


const authOptions = {
    providers: [
    SpotifyProvider({
        id: "spotify",
        name: "Spotify",
        token: "https://accounts.spotify.com/api/token",
        userinfo: "https://api.spotify.com/v1/me",
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,user-library-read", // Add desired scopes
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.readonly"
        }
      }
    })
    ],
    callbacks: {
    async jwt({ token, account, profile, user }) {
       if (account?.provider === "google" && account.access_token) {
          try {
            const ytRes = await fetch(
              "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
              {
                headers: {
                  Authorization: `Bearer ${account.access_token}`
                }
              }
            );

            const ytData = await ytRes.json();
            const subs = ytData?.items?.[0]?.statistics?.subscriberCount;

            token.youtubeSubscribers = subs ? Number(subs) : 0;
          } catch (err) {
            console.error("YouTube stats fetch failed:", err);
          }
        }

        if (account && profile) {

          // GOOGLE/YOUTUBE DATA
        if (account.provider === "google") {
          token.email = profile.email;
          token.name = profile.name;
          token.image = profile.picture;
          token.youtubeSubscribers = token.youtubeSubscribers ?? null; 
        }

        if (account.provider === 'spotify') {
          token.spotifyId = profile.id;
          token.image = profile.images?.[0]?.url ?? null;
          token.spotifyProfileUrl = profile.external_urls?.spotify;
          token.spotifyFollowers = profile.followers?.total;
          token.accessToken = account.access_token;
        }
        
        }
        return token; 
    },

    async session({ session, token }) {
    session.provider = token.provider;

    session.user.name = token.name ?? session.user.name;
    session.user.email = token.email ?? session.user.email;
    session.user.image = token.image ?? session.user.image;


    session.user.id = token.spotifyId;
    session.user.profileUrl = token.spotifyProfileUrl;
    session.user.image = token.image 
    ? token.image 
    : session.user.image; 
    session.user.followers =
    token.provider === "spotify"
      ? token.spotifyFollowers ?? 0
      : token.youtubeSubscribers ?? 0;

    session.accessToken = token.accessToken;

    return session;
  },
  async redirect({ url, baseUrl }) {
    // Always send user to the profile builder after login
    return `${baseUrl}/create-profile`;
  }
    },
    
    // Add callbacks and other configurations as needed
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }