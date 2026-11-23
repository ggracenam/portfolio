"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Password lock. Every visitor lands on a sheet of frosted tracing film (it blurs the site) with
 * "Welcome to my portfolio" and a password field. The right password defrosts the film: the blur
 * and tint melt away and the site shows through.
 *
 * The unlock lasts for the browser session ("?intro" shows the lock again).
 * NOTE: this is a front-end gate. The password is checked in the browser against a SHA-256 hash,
 * and the pages are still static files, so it keeps casual visitors out but is not real security;
 * use the host's password protection for that.
 */

const SEEN = "intro-seen";
const PASS_HASH = "3b5b1e672af92ae2d9fbfb9cf00eae796152ce9824fe43eb930a9102e161ab2e"; // sha256 of the lower-case password
const MELT_MS = 1700;

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function IntroCard() {
  const [on, setOn] = useState(true);
  const [melting, setMelting] = useState(false);
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  const inerted = useRef<Element[]>([]);
  const reduce = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    document.documentElement.classList.add("intro-seen");
    document.documentElement.style.overflow = "";
    inerted.current.forEach((el) => el.removeAttribute("inert"));
    inerted.current = [];
    setOn(false);
  }, []);

  // Show the lock on every page, once per session unless "?intro".
  useEffect(() => {
    let force = false;
    try {
      force = /[?&]intro\b/.test(window.location.search);
    } catch {}
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN);
    } catch {}
    if (seen && !force) {
      done.current = true;
      setOn(false);
      return;
    }
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.remove("intro-seen");
    document.documentElement.style.overflow = "hidden";
    // Keep the page behind the lock out of reach of the keyboard and screen readers.
    const root = document.querySelector(".intro-root");
    const els = Array.from(document.body.children).filter(
      (el) => el !== root && !["SCRIPT", "STYLE"].includes(el.tagName) && !el.hasAttribute("inert"),
    );
    els.forEach((el) => el.setAttribute("inert", ""));
    inerted.current = els;
    const t = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400);
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
      els.forEach((el) => el.removeAttribute("inert"));
    };
  }, []);

  // After the film has melted, hand the page back.
  useEffect(() => {
    if (!melting) return;
    const t = window.setTimeout(finish, MELT_MS + 100);
    return () => window.clearTimeout(t);
  }, [melting, finish]);

  if (!on) return null;

  return (
    <div className="intro-root fixed inset-0 z-[2000]" role="dialog" aria-modal="true" aria-label="Enter password">
      <div className={`intro-film absolute inset-0${melting ? " intro-melt" : ""}`} />
      <form
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
        style={{
          opacity: melting ? 0 : 1,
          transition: "opacity 0.5s",
          pointerEvents: melting ? "none" : "auto",
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (melting) return;
          const v = (inputRef.current?.value ?? "").trim().toLowerCase();
          let ok = false;
          try {
            ok = (await sha256(v)) === PASS_HASH;
          } catch {}
          if (ok) {
            if (reduce.current) finish();
            else setMelting(true);
          } else {
            setWrong(true);
            if (inputRef.current) inputRef.current.value = "";
            window.setTimeout(() => setWrong(false), 1600);
          }
        }}
      >
        <p className="intro-ink">Welcome to my portfolio</p>
        <input
          ref={inputRef}
          type="password"
          name="intro-pass"
          autoComplete="off"
          aria-label="Password"
          placeholder="input password"
          className={`intro-input${wrong ? " intro-shake" : ""}`}
        />
        <p className="intro-ink intro-ink--soft" aria-live="polite">
          {wrong ? "try again" : "press enter"}
        </p>
      </form>
    </div>
  );
}
