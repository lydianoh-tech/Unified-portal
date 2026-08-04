import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../services/api";

function useResetToken() {
  const location = useLocation();
  return useMemo(
    () => new URLSearchParams(location.search).get("token") ?? "",
    [location.search],
  );
}

export default function ResetPasswordPage() {
  const token = useResetToken();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.confirmPasswordReset(token, password);
      setDone(true);
      setMessage(
        "Password updated. You can now sign in with the new password.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-wide">
      <div className="auth-card auth-card-wide">
        <p className="auth-kicker">Account recovery</p>
        <h1>Reset password</h1>
        <p>Choose a new password for your account.</p>
        {!token ? (
          <p className="error-text">
            Missing reset token. Use the link from your reset request.
          </p>
        ) : done ? (
          <>
            <p className="success-text">{message}</p>
            <Link className="btn btn-primary" to="/login">
              Back to sign in
            </Link>
          </>
        ) : (
          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              New password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
        <p className="auth-footer-note">
          Need a new reset link? <Link to="/forgot-password">Request one</Link>
        </p>
      </div>
    </div>
  );
}
