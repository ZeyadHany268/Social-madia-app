


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterSchemaType } from "../schema/auth.schema";
import axios from "axios";
import AuthField from "../Conpunant/Authfield";
import toast from "react-hot-toast";
 
export default function Signup() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRePassword, setShowRePassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
 
  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
 
  function handleRegister(data: RegisterSchemaType) {
    setIsLoading(true);
    console.log("Form Data:", data);
 
    axios
      .post("https://route-posts.routemisr.com/users/signup", data)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
        }
        navigate("/login");
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred during registration.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
 
  const eye = (shown: boolean, toggle: () => void) => (
    <button
      type="button"
      className="field-right"
      aria-label={shown ? "Hide password" : "Show password"}
      onClick={toggle}
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
 
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">
        Create your account
      </h2>
      <p className="mt-1.5 text-sm text-muted">
        It takes less than a minute.
      </p>
 
      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-[var(--like)]/30 bg-[var(--like)]/10 px-4 py-3 text-sm text-[var(--like)]"
        >
          {errorMessage}
        </div>
      )}
 
      <form onSubmit={handleSubmit(handleRegister)} className="mt-6 space-y-4">
        <AuthField
          id="name"
          type="text"
          label="Full name"
          placeholder="John Doe"
          icon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
 
        <AuthField
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
 
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField
            id="dateOfBirth"
            type="date"
            label="Date of birth"
            icon={<Calendar className="h-4 w-4" />}
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />
 
          <div>
            <label
              htmlFor="gender"
              className="mb-1.5 block text-[13px] font-medium text-ink"
            >
              Gender
            </label>
            <div className="field field--plain">
              <select id="gender" {...register("gender")}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>
 
        <AuthField
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Create a strong password"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          right={eye(showPassword, () => setShowPassword(!showPassword))}
          {...register("password")}
        />
 
        <AuthField
          id="rePassword"
          type={showRePassword ? "text" : "password"}
          label="Confirm password"
          placeholder="Repeat your password"
          icon={<Lock className="h-4 w-4" />}
          error={errors.rePassword?.message}
          right={eye(showRePassword, () => setShowRePassword(!showRePassword))}
          {...register("rePassword")}
        />
 
        <label className="flex items-start gap-3 pt-1 text-[13px] leading-5 text-muted">
          <input
            id="terms"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded accent-[var(--brand)]"
          />
          <span>
            I agree to the{" "}
            <button type="button" className="font-medium text-brand hover:underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="font-medium text-brand hover:underline">
              Privacy Policy
            </button>
          </span>
        </label>
 
        <button
          disabled={isLoading}
          type="submit"
          className="btn-primary group w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
 
