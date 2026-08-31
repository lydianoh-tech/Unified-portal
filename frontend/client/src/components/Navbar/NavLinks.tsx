import { NavLink, type NavLinkProps } from "react-router-dom";
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

export default function NavLinks() {
  return (
    <nav className={styles.navLinks} aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }: NavLinkProps) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}