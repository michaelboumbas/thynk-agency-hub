import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const C = {
  bg: "linear-gradient(160deg, #FFFFFF 0%, #F3F8FE 45%, #E6F1FC 100%)",
  text: "#141821",
  muted: "#667085",
  accent: "#FF6B29",
  pillBorder: "rgba(20,24,33,0.12)",
  pillBg: "#FFFFFF",
  bloom: "radial-gradient(circle at 50% 40%, rgba(140,190,255,0.35), transparent 65%)",
  floorGlow: "radial-gradient(ellipse 50% 60% at center, rgba(20,24,33,0.12), transparent 70%)",
};

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialPill({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cs-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
    >
      <span className="h-4 w-4">{icon}</span>
      {label}
    </a>
  );
}

export function ComingSoon() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{ background: C.bg }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cs-pill {
              background-color: ${C.pillBg};
              color: ${C.text};
              border: 1px solid ${C.pillBorder};
            }
            .cs-pill:hover {
              border-color: ${C.accent};
              color: ${C.accent};
              box-shadow: 0 0 18px rgba(255, 107, 41, 0.25);
            }
            @keyframes cs-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
            .cs-float {
              animation: cs-float 5.5s ease-in-out infinite;
            }
          `,
        }}
      />

      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Right column (Musa visual) comes first on mobile, second on desktop */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative flex aspect-[4/5] w-full max-w-[420px] flex-col items-center justify-center">
              {/* Atmospheric bloom behind Musa */}
              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: C.bloom }}
                aria-hidden="true"
              />

              {/* Musa image with soft edge mask and gentle float */}
              <div
                className={cn(
                  "relative flex w-[78%] items-center justify-center",
                  !reducedMotion && "cs-float"
                )}
              >
                <img
                  src="/avatar/muse-hero.jpg"
                  alt="Μούσα · Thynk AI"
                  className="w-full object-contain"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 62% 68% at 50% 42%, black 60%, transparent 100%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 62% 68% at 50% 42%, black 60%, transparent 100%)",
                  }}
                />
              </div>

              {/* Floor glow / shadow under Musa */}
              <div
                className="pointer-events-none absolute bottom-[12%] left-1/2 h-16 w-[55%] -translate-x-1/2 blur-md"
                style={{ background: C.floorGlow }}
                aria-hidden="true"
              />

              <span
                className="mt-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: C.muted, fontFamily: "'Open Sans', sans-serif" }}
              >
                Μούσα · Thynk AI
              </span>
            </div>
          </div>

          {/* Left column (copy) comes second on mobile, first on desktop */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <span
              className="mb-8 text-2xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Anton', sans-serif", color: C.text }}
            >
              THYNK<span style={{ color: C.accent }}>.</span>
            </span>

            <div
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: C.muted, fontFamily: "'Open Sans', sans-serif" }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: C.accent,
                  boxShadow: "0 0 10px rgba(255,107,41,0.55)",
                }}
              />
              Established 2026 · Ιωάννινα
            </div>

            <h1
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: C.text,
              }}
            >
              Κάτι ωραίο
              <br />
              <span style={{ color: C.accent }}>έρχεται.</span>
            </h1>

            <p
              className="mt-5 max-w-md text-[1.05rem] leading-relaxed"
              style={{ color: C.muted, fontFamily: "'Open Sans', sans-serif" }}
            >
              Χτίζουμε το site μας — με την ίδια σκέψη που βάζουμε σε ό,τι
              φτιάχνουμε για τους πελάτες μας. Άξιζε να περιμένεις λίγο
              παραπάνω για να γίνει σωστά.
            </p>

            <span
              className="mt-8 text-xs font-semibold uppercase tracking-widest"
              style={{ color: C.muted, fontFamily: "'Open Sans', sans-serif" }}
            >
              Ακολούθησέ μας στο μεταξύ
            </span>

            <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">
              <SocialPill
                href="https://www.facebook.com/thynkagency.gr/"
                icon={<FacebookIcon />}
                label="Facebook"
              />
              <SocialPill
                href="https://www.instagram.com/thynkagency.gr/"
                icon={<InstagramIcon />}
                label="Instagram"
              />
            </div>
          </div>
        </div>
      </main>

      <footer
        className="py-5 text-center text-xs font-semibold uppercase tracking-widest"
        style={{ color: C.muted, fontFamily: "'Open Sans', sans-serif" }}
      >
        © 2026 THYNK DIGITAL AGENCY · ΙΩΑΝΝΙΝΑ
      </footer>
    </div>
  );
}
