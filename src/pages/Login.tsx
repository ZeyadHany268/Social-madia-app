import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "../schema/auth.schema";
import axios from "axios";
import { TokenContext } from "../Context/TokenContext";
import AuthField from "../Conpunant/Authfield";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setToken } = useContext(TokenContext);
  
  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  function handleLogin(data: LoginSchemaType) {
    setIsLoading(true);

    axios
      .post("https://route-posts.routemisr.com/users/signin", data)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
        }
        localStorage.setItem("token", response.data.data.token);
        setToken(response.data.data.token);
        navigate("/home");
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message || "An error occurred during sign in.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">Welcome back</h2>
      <p className="mt-1.5 text-sm text-muted">
        Sign in to see what your people are sharing.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-[var(--like)]/30 bg-[var(--like)]/10 px-4 py-3 text-sm text-[var(--like)]"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(handleLogin)} className="mt-6 space-y-5">
        <AuthField
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthField
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Your password"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          labelRight={
            <button
              type="button"
              className="text-xs font-medium text-brand hover:underline"
            >
              Forgot password?
            </button>
          }
          right={
            <button
              type="button"
              className="field-right"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
          {...register("password")}
        />

        <label className="flex items-center gap-3 text-[13px] text-muted">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded accent-[var(--brand)]"
          />
          Remember me for 30 days
        </label>

        <button
          disabled={isLoading}
          type="submit"
          className="btn-primary group w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs text-muted">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or continue with
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn-ghost">
          <span className="font-bold">G</span>
          Google
        </button>
        <button type="button" className="btn-ghost">
          <ArrowRight className="h-4 w-4" />
          ArrowRight
        </button>
      </div>
    </div>
  );
}
