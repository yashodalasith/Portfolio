import useFetch from "../hooks/useFetch.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Experience from "../components/Experience.jsx";
import Projects from "../components/Projects.jsx";
import Skills from "../components/Skills.jsx";
import Education from "../components/Education.jsx";
import Certifications from "../components/Certifications.jsx";
import AIChatWidget from "../components/AIChatWidget.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const { data, loading, error } = useFetch("/all");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-slate">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-sm text-slate">
          Couldn't reach the backend. Make sure it's running and VITE_API_URL is set correctly.
        </p>
      </div>
    );
  }

  const { profile, experiences, projects, certifications, education } = data || {};

  return (
    <div>
      <Navbar name={profile?.name} />
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Skills skills={profile?.skills} />
      <Education education={education} />
      <Certifications certifications={certifications} />
      <AIChatWidget name={profile?.name} />
      <Footer profile={profile} />
    </div>
  );
}
