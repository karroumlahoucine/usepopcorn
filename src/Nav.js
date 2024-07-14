import { Logo } from "./Logo.js";

export function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
