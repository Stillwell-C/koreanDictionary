import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./utils";
import { User } from "./models";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
    console.log(err);
    throw new Error("Login failed");
  }
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
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
      console.log(user, account, profile);
      if (account?.provider === "github") {
        connectDB();
        try {
          if (!profile) return false;

          const user = await User.findOne({ email: profile.email });
          if (!user) {
            const newUser = new User({
              username: profile.login,
              email: profile.email,
              image: profile.avatar_url,
            });

            await newUser.save();
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }

      return true;
    },
  },
});