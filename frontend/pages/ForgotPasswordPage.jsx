import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLink("");
    setLoading(true);

    try {
      const result = await api.requestPasswordReset(email);
      setMessage(
        "If an account exists for that email, a reset link has been created.",
      );
      if (result.resetLink) {
        setResetLink(result.resetLink);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-wide">
      <div className="auth-card auth-card-wide">
        <p className="auth-kicker">Account recovery</p>
        <h1>Forgot password</h1>
        <p>Enter your email address and we will generate a reset link.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}
          {resetLink && (
            <p className="reset-link-box">
              Dev reset link: <a href={resetLink}>{resetLink}</a>
            </p>
          )}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="auth-footer-note">
          Remembered your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
