import { Link } from "react-router-dom";
import logo from "../../assets/logo/Print.svg";
import styles from "./Navbar.module.css";

export default function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label="LoveLily home">
      <img
        src={logo}
        alt="LoveLily"
        className={styles.logoImage}
      />

      <div className={styles.logoContent}>
        <span className={styles.logoTitle}>LoveLily</span>
        <span className={styles.logoTagline}>
          Luxury Beauty, Naturally.
        </span>
      </div>
    </Link>
  );
}