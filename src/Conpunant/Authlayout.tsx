import { useState, type ReactNode } from "react";
import { Link, useLocation, useOutlet } from "react-router-dom";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import ThemeToggle from "./Themetoggle";

const copy = {
  login: {
    title: "Pick up where you left off.",
    text: "Your feed and your people are right where you left them.",
  },
  signup: {
    title: "Start your own corner.",
    text: "Create an account in under a minute and share your first post.",
  },
};

const tabs = [
  { to: "/login", label: "Sign in" },
  { to: "/signup", label: "Create account" },
];

const slide: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
};

// Keeps the old page rendered while it animates out
function Frozen({ children }: { children: ReactNode }) {
  const [kept] = useState(children);
  return <>{kept}</>;
}

const mini = [
  { name: "Mona", text: "Finally shipped my first side project.", color: "#f59e0b" },
  { name: "Omar", text: "Anyone up for a weekend hike?", color: "#10b981" },
];

function FloatingPosts() {
  return (
    <div className="relative h-40">
      {mini.map((m, i) => (
        <motion.div
          key={m.name}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          className={`absolute w-64 rounded-2xl bg-white p-3 text-slate-800 shadow-xl ${
            i ? "left-16 top-16" : "left-0 top-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white"
              style={{ background: m.color }}
            >
              {m.name[0]}
            </span>
            <span className="text-sm font-semibold">{m.name}</span>
          </div>
          <p className="mt-2 text-[13px] text-slate-600">{m.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function AuthLayout() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const isSignup = pathname.startsWith("/signup");
  const dir = isSignup ? 1 : -1;
  const c = isSignup ? copy.signup : copy.login;

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>

        <div className="surface grid w-full max-w-5xl overflow-hidden rounded-[28px] lg:grid-cols-5">
          {/* Brand panel (stays mounted while switching) */}
          <aside className="auth-panel relative hidden flex-col justify-between gap-10 overflow-hidden p-10 text-white lg:col-span-2 lg:flex">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold">Connect</span>
            </Link>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-4xl font-bold leading-tight">
                  {c.title}
                </h1>
                <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/75">
                  {c.text}
                </p>
              </motion.div>
            </AnimatePresence>

            <FloatingPosts />
          </aside>

          {/* Form panel */}
          <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:col-span-3 lg:px-16">
            <div className="mx-auto w-full max-w-[400px]">
              {/* Sliding tab switch */}
              <div className="mb-8 grid grid-cols-2 rounded-xl bg-soft p-1 text-sm font-semibold">
                {tabs.map((t) => {
                  const active = pathname.startsWith(t.to);
                  return (
                    <Link
                      key={t.to}
                      to={t.to}
                      aria-current={active ? "page" : undefined}
                      className={`relative py-2 text-center transition-colors ${
                        active ? "text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="auth-pill"
                          className="absolute inset-0 rounded-lg bg-[var(--surface)] shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative">{t.label}</span>
                    </Link>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={pathname}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <Frozen>{outlet}</Frozen>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </MotionConfig>
  );
}