import { cn } from "@/lib/utils";

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
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-medium text-foreground transition-all duration-300",
        "hover:glow-soft hover:border-accent/30 hover:text-accent"
      )}
    >
      <span className="h-4 w-4">{icon}</span>
      {label}
    </a>
  );
}

export function ComingSoon() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Right column (persona card) comes first on mobile, second on desktop */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="panel grid-texture relative flex aspect-[4/5] w-full max-w-[420px] flex-col items-center justify-center rounded-3xl p-6 sm:p-8">
              {/* TODO: replace src with /avatar/muse-hero.jpg once the asset is uploaded to public/avatar/ */}
              <img
                src="/avatar/muse-hero.jpg"
                alt="Μούσα · Thynk AI"
                className="glow-accent w-[72%] rounded-xl object-cover"
              />
              <span className="mono-label mt-5 text-muted-foreground">Μούσα · Thynk AI</span>
            </div>
          </div>

          {/* Left column (copy) comes second on mobile, first on desktop */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <img
              src="/Logos/logo 1.1 wb.png"
              alt="Thynk"
              className="mb-8 h-8 w-auto object-contain"
            />

            <div className="mono-label mb-6 inline-flex items-center gap-2 text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_oklch(0.735_0.176_52_/_70%)]" />
              Established 2026 · Ιωάννινα
            </div>

            <h1
              className="text-foreground"
              style={{
                fontFamily: "Anton, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Κάτι ωραίο
              <br />
              <span className="text-glow">έρχεται.</span>
            </h1>

            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">
              Χτίζουμε το site μας — με την ίδια σκέψη που βάζουμε σε ό,τι
              φτιάχνουμε για τους πελάτες μας. Άξιζε να περιμένεις λίγο
              παραπάνω για να γίνει σωστά.
            </p>

            <span className="mono-label mt-8 text-muted-foreground">
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

      <footer className="mono-label py-5 text-center text-muted-foreground">
        © 2026 THYNK DIGITAL AGENCY · ΙΩΑΝΝΙΝΑ
      </footer>
    </div>
  );
}
