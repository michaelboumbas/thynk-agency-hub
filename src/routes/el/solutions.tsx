import { createFileRoute, redirect } from "@tanstack/react-router";

// 26/11/2026 (Mike, v16): Solutions are now «Παραδείγματα αυτοματισμών» on the services page. Old links land there.
export const Route = createFileRoute("/el/solutions")({
  staticData: { sitemap: false },
  beforeLoad: () => {
    throw redirect({ to: "/el/services", hash: "examples", statusCode: 301 });
  },
});
