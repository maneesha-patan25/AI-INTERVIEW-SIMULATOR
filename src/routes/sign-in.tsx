// src/routes/sign-in.tsx
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return <SignIn path="/signin" />;
};

export default SignInPage; // ✅ make it default
