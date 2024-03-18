import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./utils";
import { User } from "./models";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./authConfig";

const credentialsLogin = async (userCredentials: LoginWithCredentialsType) => {
  try {
    connectDB();
    const user = await User.findOne({ username: userCredentials.username });

    if (!user) {
      throw new Error("User not found.");
    }

    const passwordCheck = await bcrypt.compare(
      userCredentials.password,
      user.password
    );

    if (!passwordCheck) {
      throw new Error("Incorrect credentials provided.");
    }

    return user;
  } catch (err) {
    throw new Error("Login failed");
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    Credentials({
      async authorize(userCredentials) {
        try {
          const user = await credentialsLogin(
            userCredentials as LoginWithCredentialsType
          );
          return user;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        connectDB();
        try {
          if (!profile) return false;

          const existingUser = await User.findOne({ email: profile.email });
          if (!existingUser) {
            const newUser = new User({
              username: profile.login,
              email: profile.email,
              image: profile.avatar_url,
            });

            const createdUser = await newUser.save();
          }
        } catch (err) {
          return false;
        }
      }

      //TODO determine whether to update language from server

      return true;
    },
    ...authConfig.callbacks,
  },
});
