import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN === "true";

export default function Footer({ profile }) {
  return (
    <footer className="border-t border-white/5 px-6 py-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate">
          © {new Date().getFullYear()} {profile?.name || ""}
        </p>
        {/* Hidden admin entry point — this whole block doesn't render at all
            unless the build was made with VITE_ENABLE_ADMIN=true. */}
        {adminEnabled && (
          <Link to="/admin/login" aria-label="Admin" className="text-slate/50 hover:text-slate">
            <Settings size={16} />
          </Link>
        )}
      </div>
    </footer>
  );
}
