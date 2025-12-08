import NextAuth, { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id?: string;   
      image?:string          
      profileUrl?: string;  
      followers?: number;   
    } & DefaultSession["user"];
  }
  interface Profile {
      id: string;
      external_urls?: { spotify: string };
      followers?: { total: number };
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    spotifyId?: string;
    spotifyProfileUrl?: string;
    spotifyFollowers?: number;
    image?: string;
  }
}


export type UserProfile = {
  id: string;
  name: string;
  profession: string;
  bio: string;
  email: string;
  avatar: string;
  spotifyId:string;
  slug:string;
  socials: {
    instagram: string;
    twitter: string;
    youtube: string;
    spotify: string;
  };
  links: CustomLinks;
  followers:number;
};

type CustomLinks = {
  latestRelease: string;
  merchStore: string;
  tourDates: string;
};