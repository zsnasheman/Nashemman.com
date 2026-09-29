"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/content";

export default function SiteHeader({ name, nav }: { name: string; nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = [buttonRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(
          Boolean,
        ) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The mobile panel sits outside <header>: a backdrop-filter on the header
  // would otherwise become the containing block for the fixed panel.
  return (
    <>
      <header className="masthead" data-scrolled={scrolled} data-open={open}>
        <div className="shell masthead__row">
          <Link href="/" className="wordmark" aria-label={`${name}, home`}>
            {name}
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isCurrent(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="menu-panel"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-button__lines" aria-hidden="true" />
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div id="menu-panel" ref={panelRef} className="menu-panel" data-open={open} inert={!open}>
        <nav aria-label="Main (mobile)">
          <ul>
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
