import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { TsjLogo } from "../../components/common/TsjLogo";
import { FormField } from "../../components/common/FormField";
import { DemoAccess, safeAdminDestination } from "../../services/demoAccess";

export function AdminLoginPage() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [shown, setShown] = useState(false),
    [busy, setBusy] = useState(false),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 250));
    setMessage(
      "Sign-in is unavailable in this demo. Use a clearly labelled preview below. No credentials were sent or stored.",
    );
    setPassword("");
    setBusy(false);
  };
  const preview = (role: "owner" | "staff") => {
    try {
      DemoAccess.enter(role);
      navigate(
        role === "owner" ? safeAdminDestination(params.get("next")) : "/admin",
        { replace: true },
      );
    } catch {
      setMessage(
        "Demo access could not be started. Allow session storage and try again.",
      );
    }
  };
  return (
    <main className="admin-login">
      <aside className="admin-login__brand">
        <TsjLogo size={52} showTextLabel lightText />
        <div>
          <p>THE OWNER’S WORKSPACE</p>
          <h2>
            Every detail.
            <br />
            Considered.
          </h2>
        </div>
        <p className="login-brand-foot">Tayyab Shahzad Jewellers</p>
      </aside>
      <section className="admin-login__form">
        <div className="login-form-content">
          <Link to="/" className="quiet-link">
            ← Back to the storefront
          </Link>
          <h1>Welcome back.</h1>
          <p>Sign in to manage Tayyab Shahzad Jewellers.</p>
          <form onSubmit={signIn} noValidate>
            <FormField label="Email" error={errors.email}>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <div className="password-field">
                <input
                  id="admin-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "admin-password-error" : undefined
                  }
                  type={shown ? "text" : "password"}
                  aria-label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={shown ? "Hide password" : "Show password"}
                  aria-pressed={shown}
                  onClick={() => setShown(!shown)}
                >
                  {shown ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.password && (
                <small id="admin-password-error" className="field-error">
                  {errors.password}
                </small>
              )}
            </div>
            <button className="button-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign In"}
              <ArrowRight size={17} />
            </button>
            {message && (
              <p className="notice" role="alert">
                {message}
              </p>
            )}
          </form>
          <div className="login-demo">
            <h2>Explore the demo</h2>
            <p>
              No backend authentication is connected. These previews are
              browser-only and expire after one hour. Use sample information
              only.
            </p>
            <div className="button-row">
              <button
                className="button-primary"
                onClick={() => preview("owner")}
              >
                Owner demo
              </button>
              <button
                className="button-secondary"
                onClick={() => preview("staff")}
              >
                Staff demo
              </button>
            </div>
            <small>
              Owner: all demo modules. Staff: overview only; no record changes.
              Real owner accounts require backend setup.
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}
