"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAccessToken, getAccessToken } from "../lib/auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/me", label: "My Page" },
  { href: "/admin/users", label: "Admin" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getAccessToken()));
  }, [pathname]);

  function handleLogout() {
    clearAccessToken();
    setHasToken(false);
    router.push("/login");
  }

  return (
    <header className="site-header">
      <nav className="global-nav" aria-label="Global">
        <Link className="brand-mark" href="/" aria-label="Home" />
        <div className="global-links">
          {links.map((link) => (
            <Link
              key={link.href}
              className={pathname === link.href ? "nav-link active" : "nav-link"}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          {hasToken ? (
            <button className="utility-button" type="button" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="utility-button" href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="sub-nav">
        <span className="sub-nav-title">Authentication</span>
        <Link className="pill-button compact" href="/login">
          Sign in
        </Link>
      </div>
    </header>
  );
}
