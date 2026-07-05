import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import Nav from "./Nav";
import Footer from "./Footer";

/**
 * Renders a legal markdown doc (content/*.md, source of truth shared with
 * the iOS app's legal/ package) as a themed page.
 */
export default function LegalPage({ file }: { file: string }) {
  const md = fs.readFileSync(
    path.join(process.cwd(), "content", file),
    "utf-8"
  );
  const html = marked.parse(md, { async: false });

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-8">
        <article
          className="legal-doc"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
    </>
  );
}
