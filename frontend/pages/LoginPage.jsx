import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const serviceLinks = [
  {
    id: "service-bookings",
    label: "Bookings",
    blurb: "Book and track appointments",
    path: "/bookings",
  },
  {
    id: "service-marketplace",
    label: "Marketplace",
    blurb: "Buy and sell trusted products",
    path: "/marketplace",
  },
  {
    id: "service-media",
    label: "Media",
    blurb: "Manage photos and videos",
    path: "/media",
  },
  {
    id: "service-chat",
    label: "Chat",
    blurb: "Message in real time",
    path: "/chat",
  },
  {
    id: "service-tickets",
    label: "Help Desk",
    blurb: "Raise and track support tickets",
    path: "/tickets",
  },
  {
    id: "service-tasks",
    label: "Tasks",
    blurb: "Plan and monitor team work",
    path: "/tasks",
  },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <Navigate
        to={
          user.role === "CUSTOMER"
            ? "/customer/dashboard"
            : "/provider/dashboard"
        }
        replace
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const openSignIn = () => {
    setShowSignIn(true);
    setError("");
  };

  const closeSignIn = () => {
    setShowSignIn(false);
    setError("");
    setLoading(false);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="brand">
          Unified <span>Portal</span>
        </div>
        <nav className="home-nav" aria-label="Services">
          {serviceLinks.map((service) => (
            <Link key={service.id} to={service.path} className="home-nav-link">
              {service.label}
            </Link>
          ))}
        </nav>
        <button className="btn btn-primary" type="button" onClick={openSignIn}>
          Sign in
        </button>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <h1>All services in one secure portal</h1>
          <p>
            Manage bookings, marketplace activity, media, chat, tasks, and
            support from one place.
          </p>
          <Link className="btn btn-secondary" to="/register">
            Create account
          </Link>
        </section>

        <section className="home-services" aria-label="Service links">
          {serviceLinks.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className="home-service-card"
            >
              <h2>{service.label}</h2>
              <p>{service.blurb}</p>
              <Link className="home-service-link" to={service.path}>
                Open {service.label}
              </Link>
            </article>
          ))}
        </section>
      </main>

      <footer className="home-footer">
        <p>
          New here? <Link to="/register">Register</Link>
        </p>
      </footer>

      {showSignIn && (
        <div className="auth-modal-backdrop" onClick={closeSignIn}>
          <div
            className="auth-card auth-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Sign in form"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-close-btn"
              onClick={closeSignIn}
              aria-label="Close sign in"
            >
              ×
            </button>
            <h1>Sign in</h1>
            <p>Access your unified portal dashboard.</p>
            <form className="form-stack" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <div style={{ marginTop: "-0.45rem" }}>
                <Link to="/forgot-password" onClick={closeSignIn}>
                  Forgot password?
                </Link>
              </div>
              {error && <p className="error-text">{error}</p>}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
