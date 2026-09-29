import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell page-head" style={{ minHeight: "60vh" }}>
      <p className="label">404</p>
      <h1 className="page-title">This page isn&apos;t here.</h1>
      <p>
        <Link href="/" className="btn btn--ink">
          Back to the start
        </Link>
      </p>
    </section>
  );
}
