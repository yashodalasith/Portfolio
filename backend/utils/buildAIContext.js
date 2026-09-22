import Profile from "../models/Profile.js";
import Experience from "../models/Experience.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Education from "../models/Education.js";

const visibleProjects = { $or: [{ show: true }, { show: { $exists: false } }] };

// Assembles everything in the database into one compact plain-text block
// that gets dropped into the system prompt. Keeping this as plain text
// (rather than raw JSON) keeps token usage down and reads more naturally
// to the model.
export async function buildAIContext() {
  const [profile, experiences, projects, certifications, education] = await Promise.all([
    Profile.findOne().lean(),
    Experience.find().sort({ order: 1 }).lean(),
    Project.find(visibleProjects).sort({ order: 1 }).lean(),
    Certification.find().sort({ order: 1 }).lean(),
    Education.find().sort({ order: 1 }).lean(),
  ]);

  const lines = [];

  if (profile) {
    lines.push(`NAME: ${profile.name}`);
    lines.push(`TITLE: ${profile.title}`);
    if (profile.tagline) lines.push(`TAGLINE: ${profile.tagline}`);
    if (profile.bio) lines.push(`BIO: ${profile.bio}`);
    if (profile.location) lines.push(`LOCATION: ${profile.location}`);
    const skillGroups = profile.skills || {};
    for (const [group, list] of Object.entries(skillGroups)) {
      if (list?.length) lines.push(`SKILLS (${group}): ${list.join(", ")}`);
    }
  }

  if (experiences?.length) {
    lines.push("\nWORK EXPERIENCE:");
    for (const e of experiences) {
      lines.push(`- ${e.title} at ${e.company} (${e.startDate} – ${e.endDate})`);
      for (const b of e.bullets || []) lines.push(`  * ${b}`);
    }
  }

  if (projects?.length) {
    lines.push("\nPROJECTS:");
    for (const p of projects) {
      lines.push(`- ${p.title} [${p.category}, ${p.date}]: ${p.description}`);
      if (p.technologies?.length) lines.push(`  Technologies: ${p.technologies.join(", ")}`);
      if (p.githubUrl) lines.push(`  GitHub: ${p.githubUrl}`);
      if (p.liveUrl) lines.push(`  Live: ${p.liveUrl}`);
    }
  }

  if (education?.length) {
    lines.push("\nEDUCATION:");
    for (const ed of education) {
      lines.push(`- ${ed.degree}, ${ed.institution} (${ed.startDate} – ${ed.endDate})`);
      for (const d of ed.details || []) lines.push(`  * ${d}`);
    }
  }

  if (certifications?.length) {
    lines.push("\nCERTIFICATIONS:");
    for (const c of certifications) {
      lines.push(`- ${c.title} — ${c.issuer} (${c.date})`);
    }
  }

  return lines.join("\n");
}
