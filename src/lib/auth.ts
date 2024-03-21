import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./dbUtils";
import { TermCollection, User } from "./models";
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
      // console.log(user, account, profile);
      if (account?.provider === "github") {
        connectDB();
        try {
          if (!profile) return false;

          //Check for user in db
          const existingUser = await User.findOne({ providerId: profile.id });
          //If exists, reassign Oauth ID to DB ID & assign username
          if (existingUser) {
            user.id = existingUser._id;
            user.username = existingUser.username;
          }

          //If no user exists, create new one
          if (!existingUser) {
            const newUser = new User({
              username: profile.login,
              email: profile.email,
              image: profile.avatar_url,
              providerId: profile.id,
            });

            const createdUser = await newUser.save();
            //Reassign Oauth ID to DB ID & assign username
            user.id = createdUser.id;
            user.username = createdUser.username;

            //Create a term list for new user
            const myTermsList = new TermCollection({
              userId: createdUser._id,
              name: "My Terms",
              noDelete: true,
            });

            myTermsList.save();
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
