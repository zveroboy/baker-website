import { useNavigate } from "@tanstack/react-router";
import LoginForm from "../components/auth/LoginForm";
import { useLogin } from "../hooks/use-auth";
import { setToken } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const data = await login.mutateAsync({ email, password });
      setToken(data.access_token);
      navigate({ to: "/" });
    } catch (error) {
      // Error is handled by TanStack Query and passed to form
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm
        onSubmit={handleSubmit}
        isSubmitting={login.isPending}
        serverError={login.error?.message || null}
      />
    </div>
  );
}
