import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="hidden border-t border-line md:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-sm text-muted">
        <Link to="/" className="font-display font-bold text-ink">
          Connect
        </Link>
        <p>© {new Date().getFullYear()} Connect</p>
      </div>
    </footer>
  );
}
