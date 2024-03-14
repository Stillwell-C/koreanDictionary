import { credentialsLogin, handleGitHubLogin } from "@/lib/action";
import React from "react";

const LoginPage = () => {
  return (
    <div>
      <form action={handleGitHubLogin}>
        <button>Log in with GitHub</button>
      </form>
      <form action={credentialsLogin}>
        <input type='text' placeholder='username' name='username' />
        <input type='password' placeholder='password' name='password' />
        <button>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
