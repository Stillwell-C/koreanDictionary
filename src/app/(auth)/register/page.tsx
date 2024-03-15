import React from "react";
import styles from "./registerPage.module.css";
import RegisterForm from "@/components/registerForm/RegisterForm";

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Register</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
