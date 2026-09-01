import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Services", path: "/services" },
  { label: "Beauty Hub", path: "/beauty-hub" },
  { label: "Community", path: "/community" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.mobileMenu}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={
          isOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && (
        <nav
          id="mobile-navigation"
          className={styles.mobileNav}
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }: { isActive: boolean }) =>
                `${styles.mobileNavLink} ${
                  isActive ? styles.mobileActive : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}