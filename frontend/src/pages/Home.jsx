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
import Reveal from "../components/Reveal.jsx";
import Preloader from "../components/Preloader.jsx";
import Scene3D from "../components/Scene3D.jsx";

export default function Home() {
  const { data, loading, error } = useFetch("/all");

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
    <>
      {/* One persistent 3D backdrop for the whole page — see Scene3D.jsx for
          how it morphs between "worlds" as the visitor scrolls through
          sections below. */}
      <Scene3D />
      {/* Kept mounted across the whole loading→loaded transition so its own
          exit-fade can play against the real content once it's ready,
          instead of being yanked out by a branch switch. */}
      <Preloader isLoading={loading} name={profile?.name} />
      {!loading && (
        <div className="relative z-10">
          <Navbar name={profile?.name} />
          <Hero profile={profile} />
          <Reveal>
            <About profile={profile} />
          </Reveal>
          <Reveal>
            <Experience experiences={experiences} />
          </Reveal>
          <Reveal>
            <Projects projects={projects} />
          </Reveal>
          <Reveal>
            <Skills skills={profile?.skills} />
          </Reveal>
          <Reveal>
            <Education education={education} />
          </Reveal>
          <Reveal>
            <Certifications certifications={certifications} />
          </Reveal>
          <Reveal>
            <AIChatWidget name={profile?.name} />
          </Reveal>
          <Footer profile={profile} />
        </div>
      )}
    </>
  );
}
