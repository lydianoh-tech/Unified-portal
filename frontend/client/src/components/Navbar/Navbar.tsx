import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Logo />

        <NavLinks />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.searchButton}
            aria-label="Search LoveLily"
          >
            Search
          </button>

          <a href="/login" className={styles.loginButton}>
            Login
          </a>

          <a href="/register" className={styles.joinButton}>
            Join LoveLily
          </a>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}