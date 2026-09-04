import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import ProfileEditor from "../components/admin/ProfileEditor.jsx";
import ResourcePanel from "../components/admin/ResourcePanel.jsx";

const TABS = [
  "profile",
  "experience",
  "projects",
  "certifications",
  "education",
];

const RESOURCE_CONFIG = {
  experience: {
    resource: "experience",
    title: "Experience",
    listEndpoint: "/experience",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "startDate", label: "Start date", type: "text" },
      { key: "endDate", label: "End date", type: "text" },
      { key: "bullets", label: "Bullets", type: "lines" },
      { key: "tags", label: "Tags", type: "tags" },
      { key: "order", label: "Order (lower = shown first)", type: "number" },
    ],
  },
  projects: {
    resource: "project",
    title: "Projects",
    listEndpoint: "/projects",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "date", label: "Date", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "bullets", label: "Bullets", type: "lines" },
      { key: "technologies", label: "Technologies", type: "tags" },
      { key: "githubUrl", label: "GitHub URL", type: "text" },
      { key: "liveUrl", label: "Live URL", type: "text" },
      { key: "imageUrls", label: "Project images", type: "images" },
      { key: "featured", label: "Featured", type: "checkbox" },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  certifications: {
    resource: "certification",
    title: "Certifications",
    listEndpoint: "/certifications",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "date", label: "Date", type: "text" },
      { key: "url", label: "URL", type: "text" },
      {
        key: "fileUrl",
        label: "Certificate file (PDF or image)",
        type: "file",
      },
      { key: "order", label: "Order", type: "number" },
    ],
  },
  education: {
    resource: "education",
    title: "Education",
    listEndpoint: "/education",
    titleKey: "institution",
    fields: [
      { key: "institution", label: "Institution", type: "text" },
      { key: "degree", label: "Degree", type: "text" },
      { key: "startDate", label: "Start date", type: "text" },
      { key: "endDate", label: "End date", type: "text" },
      { key: "details", label: "Details", type: "lines" },
      { key: "order", label: "Order", type: "number" },
    ],
  },
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) navigate("/admin/login");
  }, [navigate]);

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-bone">
          Admin dashboard
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-slate hover:text-bone"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-medium capitalize ${
              tab === t
                ? "bg-amber text-ink"
                : "border border-white/10 text-slate"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "profile" ? (
          <ProfileEditor key="profile" />
        ) : (
          <ResourcePanel key={tab} {...RESOURCE_CONFIG[tab]} />
        )}
      </div>
    </div>
  );
}
