import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { inputCls, labelCls, eyebrowCls, btnPrimary } from "./Adminstyles";

const friendlyError = (err: unknown) => {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Could not sign in. Please try again.";
  }
};

export const AdminLogin: React.FC = () => {
  const { login, isAdminOpen, setIsAdminOpen } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Escape closes the dialog
  useEffect(() => {
    if (!isAdminOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsAdminOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAdminOpen, setIsAdminOpen]);

  if (!isAdminOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      setPassword("");
      setIsAdminOpen(false); // close the modal so the dashboard is visible straight away
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Administrator sign in"
        className="relative w-full max-w-md bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 p-8 sm:p-10 text-slate-100 light:text-navy-950"
      >
        <button
          onClick={() => setIsAdminOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white light:hover:text-navy-950 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <p className={eyebrowCls}>Administrator</p>
        <h2 className="font-serif text-3xl mt-2">Sign in</h2>
        <p className="text-sm text-slate-400 mt-2">
          Manage products, prices and stock.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className={labelCls}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className={labelCls}>
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className={`${inputCls} !pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white light:hover:text-navy-950 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <p
            className="text-xs font-mono text-rose-400 min-h-[1rem]"
            role="alert"
          >
            {error}
          </p>

          <button
            type="submit"
            disabled={busy}
            className={`${btnPrimary} w-full`}
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
