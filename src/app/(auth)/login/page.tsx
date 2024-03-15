import LoginForm from "@/components/loginForm/LoginForm";
import { handleGitHubLogin } from "@/lib/action";
import styles from "./loginpage.module.css";

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2>Login</h2>
        <form className={styles.oAuthForm} action={handleGitHubLogin}>
          <button className={styles.oAuthBtn}>Log in with GitHub</button>
        </form>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
