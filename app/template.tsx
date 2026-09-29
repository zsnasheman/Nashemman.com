/** Re-mounts on each navigation, giving every page a short "page turn". */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
