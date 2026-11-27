"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Password lock. Every visitor lands on a sheet of frosted tracing film (it blurs the site) with
 * "Welcome to my portfolio" and a password field. The right password defrosts the film: the blur
 * and tint melt away and the site shows through.
 *
 * The unlock lasts for the browser session ("?intro" shows the lock again).
 * NOTE: this is a front-end gate. The password is checked in the browser against a salted, slow hash,
 * and the pages are still static files, so it keeps casual visitors out but is not real security;
 * use the host's password protection for that.
 */

const SEEN = "intro-seen";
const PASS_SALT = "d72992c1514d157c04ddab98b4b16ae2";
const PASS_KEY =
  "8d217c17c47f2655452aaf58e954d843fab42af370c959c038d91ec3b864d0cf"; // PBKDF2-SHA256 of the lower-case password
const PASS_ROUNDS = 310000;
const MELT_MS = 1700;

const hex = (b: Uint8Array) =>
  Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (s: string) =>
  new Uint8Array(s.match(/../g)!.map((h) => parseInt(h, 16)));

/** Slow on purpose: each guess costs a fraction of a second, so guessing in bulk is expensive. */
async function derive(pw: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pw),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: unhex(PASS_SALT),
      iterations: PASS_ROUNDS,
    },
    key,
    256,
  );
  return hex(new Uint8Array(bits));
}

export function IntroCard() {
  const [on, setOn] = useState(true);
  const [melting, setMelting] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  const inerted = useRef<Element[]>([]);
  const reduce = useRef(false);

  // Phones scroll the page when the keyboard opens and keep that offset afterwards, so after
  // unlocking start at the very top.
  const toTop = useCallback(() => {
    inputRef.current?.blur();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    document.documentElement.classList.add("intro-seen");
    document.documentElement.style.overflow = "";
    toTop();
    inerted.current.forEach((el) => el.removeAttribute("inert"));
    inerted.current = [];
    setOn(false);
  }, [toTop]);

  // Show the lock on every page, once per session unless "?intro".
  useEffect(() => {
    // The form only exists once the page script is running, so it can never submit natively
    // (which would put the typed password into the address bar). Scrub any such leftover too.
    setReady(true);
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.has("site-access-code")) {
        u.searchParams.delete("site-access-code");
        window.history.replaceState(null, "", u.pathname + u.search + u.hash);
      }
    } catch {}
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
    reduce.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.documentElement.classList.remove("intro-seen");
    document.documentElement.style.overflow = "hidden";
    // Keep the page behind the lock out of reach of the keyboard and screen readers.
    const root = document.querySelector(".intro-root");
    const els = Array.from(document.body.children).filter(
      (el) =>
        el !== root &&
        !["SCRIPT", "STYLE"].includes(el.tagName) &&
        !el.hasAttribute("inert"),
    );
    els.forEach((el) => el.setAttribute("inert", ""));
    inerted.current = els;
    // Never start with anything typed in: wipe it on load, on back/forward restores, and just
    // after load (when browsers apply autofill).
    const wipe = () => {
      if (inputRef.current) inputRef.current.value = "";
    };
    wipe();
    const w1 = window.setTimeout(wipe, 150);
    const w2 = window.setTimeout(wipe, 700);
    window.addEventListener("pageshow", wipe);
    // Masked like a password, but as a text field so browsers don't offer to save or fill it.
    if (!CSS.supports("-webkit-text-security", "disc") && inputRef.current)
      inputRef.current.type = "password";
    const t = window.setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      400,
    );
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(w1);
      window.clearTimeout(w2);
      window.removeEventListener("pageshow", wipe);
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
    <div
      className="intro-root fixed inset-0 z-[2000]"
      role="dialog"
      aria-modal="true"
      aria-label="Enter password"
    >
      <div
        className={`intro-film absolute inset-0${melting ? " intro-melt" : ""}`}
      />
      {ready && (
        <form
          autoComplete="off"
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
              ok = (await derive(v)) === PASS_KEY;
            } catch {}
            if (ok) {
              toTop();
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
            type="text"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            aria-label="Password"
            placeholder="input password"
            className={`intro-input${wrong ? " intro-shake" : ""}`}
          />
          <p className="intro-ink intro-ink--soft" aria-live="polite">
            {wrong ? "try again" : "press enter"}
          </p>
        </form>
      )}
    </div>
  );
}
