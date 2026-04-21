import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CircleDot, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome aboard.");
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Registration failed";
      toast.error(msg);
    }
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-red-400 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,142,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,142,247,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl mb-4">
            <CircleDot size={22} className="text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-100 font-mono">IssueTrack</h1>
          <p className="text-slate-500 text-sm mt-1">Create your workspace account</p>
        </div>

        <div className="glass-card p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`input-base ${errors.name ? "!border-red-500/50" : ""}`}
              />
              <FieldError field="name" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={`input-base ${errors.email ? "!border-red-500/50" : ""}`}
              />
              <FieldError field="email" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className={`input-base !pr-10 ${errors.password ? "!border-red-500/50" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <FieldError field="password" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                className={`input-base ${errors.confirm ? "!border-red-500/50" : ""}`}
              />
              <FieldError field="confirm" />
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              loading={isLoading}
              icon={<UserPlus size={14} />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent hover:text-accent-hover transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 font-mono">
          IssueTrack · Built for engineers
        </p>
      </div>
    </div>
  );
};
