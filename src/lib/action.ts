"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "./auth";
import { connectDB } from "./utils";
import { User } from "./models";
import bcrypt from "bcryptjs";

// export const handleSearch = (formData: FormData) => {
//   console.log(formData);
//   const { searchTerm } = Object.fromEntries(formData);
//   redirect(`/search/${searchTerm}?translation=true&transLang=1`);
// };

export const handleGitHubLogin = async () => {
  await signIn("github");
};

export const handleLogout = async () => {
  await signOut();
};

export const registerUser = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const { username, email, password, passwordConfirmation } =
    Object.fromEntries(formData);

  if (password !== passwordConfirmation) {
    return { error: "Passwords do not match" };
  }

  try {
    connectDB();

    const user = await User.findOne({ username });

    if (user) {
      return { error: "Username already in use." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password as string, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return null;
  } catch (err) {
    return { error: "Something went wrong" };
  }
};

export const credentialsLogin = async (
  prevState: FormStateType | null,
  formData: FormData
) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
    return null;
  } catch (err) {
    return { error: "Something went wrong" };
  }
};
