"use client";

import { registerUser } from "@/lib/action";
import styles from "./registerForm.module.css";
import { useFormState } from "react-dom";

const RegisterForm = () => {
  const [state, formAction] = useFormState(registerUser, null);

  return (
    <form className={styles.form} action={formAction}>
      <input type='text' placeholder='username' name='username' />
      <input type='email' placeholder='email' name='email' />
      <input type='password' placeholder='password' name='password' />
      <input
        type='password'
        placeholder='confirm password'
        name='passwordConfirmation'
      />
      <button type='submit'>Register</button>
    </form>
  );
};

export default RegisterForm;
