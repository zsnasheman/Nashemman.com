"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/content";

type Props = { name: string; publication: string; nav: NavItem[] };

export default function SiteHeader({ name, publication, nav }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  // The panel sits outside <header>: the header's backdrop-filter would
  // otherwise become the containing block for the fixed-position panel.
  return (
    <>
      <header className="masthead" data-scrolled={scrolled}>
        <div className="shell">
          <Link href="/" className="wordmark" aria-label={`${name}, home`}>
            <span className="wordmark__name">{name}</span>
            <span className="wordmark__pub" aria-hidden="true">
              {publication}
            </span>
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            <ol>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isCurrent(item.href) ? "page" : undefined}>
                    <span className="num" aria-hidden="true">
                      {item.number}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ol>
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
            {open ? "Close" : "Contents"}
          </button>
        </div>
      </header>

      <div id="menu-panel" ref={panelRef} className="menu-panel" data-open={open} aria-hidden={!open} inert={!open}>
        <nav aria-label="Main (mobile)">
          <p className="eyebrow">Contents</p>
          <ol>
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                <span className="num">00</span>Cover
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  <span className="num">{item.number}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <p className="hand" aria-hidden="true">
          still being drawn…
        </p>
      </div>
    </>
  );
}
