export default function About({ profile }) {
  if (!profile?.bio) return null;
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-24 lg:px-16">
      <h2 className="font-display text-2xl font-semibold text-bone sm:text-3xl">About</h2>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">{profile.bio}</p>
      {profile.location && <p className="mt-4 font-mono text-sm text-slate">{profile.location}</p>}
    </section>
  );
}
