// app/api/auth/[...nextauth]/route.js (for App Router)
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

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
    ],
    callbacks: {
    async jwt({ token, account, profile, user }) {
        console.log("SPOTIFY PROFILE IMAGES:", profile);
        if (account && profile) {
        token.spotifyId = profile.id;
        token.image = profile.images?.[0]?.url ?? null;
        token.spotifyProfileUrl = profile.external_urls?.spotify;
        token.spotifyFollowers = profile.followers?.total;
        token.accessToken = account.access_token;
        }
        return token; 
    },

    async session({ session, token }) {

    session.user.id = token.spotifyId;
    session.user.profileUrl = token.spotifyProfileUrl;
    session.user.image = token.image 
    ? token.image 
    : session.user.image; 
    session.user.followers = token.spotifyFollowers;
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