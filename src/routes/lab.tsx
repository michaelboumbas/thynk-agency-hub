import { createFileRoute } from "@tanstack/react-router";
import { MuseLab } from "@/components/muse-stage/MuseLab";
import labCss from "@/components/muse-stage/muse-lab.css?url";

// Prototype playground for the Muse stage. Not linked from the site and kept out of search engines.
export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [{ title: "Thynk Lab" }, { name: "robots", content: "noindex, nofollow" }],
    links: [{ rel: "stylesheet", href: labCss }],
  }),
  component: MuseLab,
});
