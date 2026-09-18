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
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import Reveal from "../components/Reveal.jsx";
import Preloader from "../components/Preloader.jsx";
import Particles from "../components/Particles.jsx";
import SmoothScroll from "../components/SmoothScroll.jsx";

export default function Home() {
  const { data, loading, error } = useFetch("/all");

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-sm text-slate">
          Couldn't reach the backend. Make sure it's running and VITE_API_URL is
          set correctly.
        </p>
      </div>
    );
  }

  const { profile, experiences, projects, certifications, education } =
    data || {};

  return (
    <>
      {/* Real inertia scroll for the whole page — see SmoothScroll.jsx. */}
      <SmoothScroll />
      {/* Ambient particle backdrop — see Particles.jsx. */}
      <Particles />
      {/* Kept mounted across the whole loading→loaded transition so its own
          exit-fade can play against the real content once it's ready,
          instead of being yanked out by a branch switch. */}
      <Preloader isLoading={loading} name={profile?.name} />
      {!loading && (
        <div className="relative z-10">
          <Navbar name={profile?.name} socials={profile?.socials} />
          <Hero profile={profile} />
          <Reveal>
            <About profile={profile} />
          </Reveal>
          <Reveal>
            <Experience experiences={experiences} />
          </Reveal>
          <Projects projects={projects} />
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
            <Contact profile={profile} />
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
