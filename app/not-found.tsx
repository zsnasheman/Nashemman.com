import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell page-intro" style={{ minHeight: "60vh" }}>
      <p className="eyebrow">404</p>
      <h1 className="page-intro__title">
        This page is <em>not drawn</em> yet.
      </h1>
      <p className="page-intro__dek">It may have moved, or it may still be a sketch.</p>
      <p>
        <Link href="/" className="pill pill--solid">
          Back to the cover{" "}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </p>
    </section>
  );
}
