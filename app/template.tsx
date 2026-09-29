/** Re-mounts on each navigation: a brisk settle-in, never a blank pause. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
