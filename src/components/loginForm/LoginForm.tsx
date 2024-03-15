"use client";

import styles from "./loginForm.module.css";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { credentialsLogin } from "@/lib/action";

const LoginForm = () => {
  const errorRef = useRef<HTMLParagraphElement>(null);

  const [state, formAction] = useFormState(credentialsLogin, null);

  useEffect(() => {
    if (state?.error) {
      errorRef?.current?.focus();
    }
  }, [state]);

  return (
    <form className={styles.form} action={formAction}>
      <input type='text' placeholder='username' name='username' />
      <input type='password' placeholder='password' name='password' />
      <button type='submit'>Log In</button>
      <p>
        Don&apos;t have an Account?{" "}
        <Link className={styles.formLink} href='/register'>
          Register here.
        </Link>
      </p>
      {state?.error && (
        <p className={styles.formError} ref={errorRef}>
          {state?.errorMsg}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
