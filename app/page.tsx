import { AssistantTrigger } from "@/components/assistant-trigger";
import { ConversationalHero } from "@/components/conversational-hero";
import { LineageScope } from "@/components/lineage-scope";
import { Record } from "@/components/record";
import { SectionHeading } from "@/components/section-heading";
import { Tag } from "@/components/tag";
import {
  getCertificationsRecord,
  getEducationRecords,
  getExperienceRecords,
  getExtracurricularRecord,
  getIdentityRecord,
  getProjectRecord,
  getSkillsRecord,
  getSummaryRecord,
} from "@/lib/knowledge-base";
import { matchLineageKeys } from "@/lib/lineage";

function getExternalHttpUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export default function Home() {
  const identity = getIdentityRecord();
  const summary = getSummaryRecord();
  const experiences = getExperienceRecords();
  const project = getProjectRecord();
  const skills = getSkillsRecord();
  const education = getEducationRecords();
  const certifications = getCertificationsRecord();
  const extracurricular = getExtracurricularRecord();
  const email = identity.contact?.email?.trim();
  const linkedIn = getExternalHttpUrl(identity.contact?.linkedin);
  const lineageCorpus = [
    identity,
    summary,
    ...experiences,
    project,
    skills,
    ...education,
    certifications,
    extracurricular,
  ].map(({ id, tags }) => ({ id, tags }));
  const lineageTargets = [...experiences, project].map(({ id, tags }) => ({
    id,
    tags,
  }));
  const lineageKeys = [
    ...new Set(
      [
        summary,
        ...experiences,
        project,
        ...education,
        certifications,
        extracurricular,
      ].flatMap((record) => record.tags),
    ),
  ];
  const lowSpecificityLineageKeys = (
    skills.groups["Data & AI Platforms"] ?? []
  ).flatMap((skill) => matchLineageKeys(skill, lineageKeys));

  return (
    <LineageScope
      corpus={lineageCorpus}
      lowSpecificityKeys={lowSpecificityLineageKeys}
      targets={lineageTargets}
    >
      <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
        <ConversationalHero identity={identity} />

        <main className="editorial-shell">
          <section
            aria-labelledby="summary-heading"
            className="py-[var(--section-space)]"
            id="summary"
          >
            <SectionHeading
              eyebrow={summary.type}
              title={summary.shortTitle}
              id="summary-heading"
            />

            <div className="mt-14 lg:mt-20">
              <Record
                id={summary.id}
                headline={summary.shortTitle}
                metadata={[summary.type, "source · knowledge-base"]}
                highlights={[summary.content]}
                tags={summary.tags}
              />
            </div>
          </section>

          <section
            aria-labelledby="experience-heading"
            className="border-t border-line py-[var(--section-space)]"
            id="experience"
          >
            <SectionHeading
              eyebrow="Experience"
              title="Experience"
              id="experience-heading"
            />

            <div className="mt-14 lg:mt-20">
              {experiences.map((experience) => (
                <Record
                  id={experience.id}
                  headline={experience.shortTitle}
                  highlights={[experience.content, ...experience.highlights]}
                  key={experience.id}
                  metadata={[
                    experience.org,
                    experience.role,
                    `${experience.start} — ${experience.end}`,
                    experience.location,
                  ]}
                  tags={experience.tags}
                />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="projects-heading"
            className="border-t border-line py-[var(--section-space)]"
            id="projects"
          >
            <SectionHeading
              eyebrow={project.type}
              title="Projects"
              id="projects-heading"
            />

            <div className="mt-14 lg:mt-20">
              <Record
                id={project.id}
                headline={project.name}
                metadata={[project.context, project.status]}
                highlights={[project.content]}
                tags={project.tags}
              />
            </div>
          </section>

          <section
            aria-labelledby="skills-heading"
            className="border-t border-line py-[var(--section-space)]"
            id="skills"
          >
            <SectionHeading
              eyebrow={skills.type}
              title={skills.shortTitle}
              id="skills-heading"
            />

            <div className="mt-14 border-t border-line lg:mt-20">
              {Object.entries(skills.groups).map(([group, items]) => (
                <div
                  className="grid gap-5 border-b border-line py-7 md:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.7fr)] md:gap-12 md:py-9"
                  key={group}
                >
                  <h3 className="font-mono text-meta tracking-[0.1em] text-ink-2 uppercase">
                    {group}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => {
                      const relatedKeys = matchLineageKeys(skill, lineageKeys);

                      return (
                        <Tag
                          interactive={relatedKeys.length > 0}
                          key={skill}
                          lineageId={`skill:${group}:${skill}`}
                          lineageKeys={relatedKeys}
                        >
                          {skill}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="education-heading"
            className="border-t border-line py-[var(--section-space)]"
            id="education"
          >
            <SectionHeading
              eyebrow="Education + certifications"
              title="Education & Certifications"
              id="education-heading"
            />

            <div className="mt-14 lg:mt-20">
              {education.map((record) => (
                <Record
                  id={record.id}
                  headline={record.shortTitle}
                  highlights={[record.content]}
                  key={record.id}
                  metadata={[record.type, "source · knowledge-base"]}
                  tags={record.tags}
                />
              ))}
              <Record
                id={certifications.id}
                headline={certifications.shortTitle}
                metadata={[certifications.type, "source · knowledge-base"]}
                highlights={certifications.items}
                tags={certifications.tags}
              />
            </div>
          </section>

          <section
            aria-labelledby="extracurricular-heading"
            className="border-t border-line py-[var(--section-space)]"
            id="extracurricular"
          >
            <SectionHeading
              eyebrow={extracurricular.type}
              title={extracurricular.shortTitle}
              id="extracurricular-heading"
            />

            <div className="mt-14 lg:mt-20">
              <Record
                id={extracurricular.id}
                headline={extracurricular.shortTitle}
                metadata={[extracurricular.type, "source · knowledge-base"]}
                highlights={extracurricular.items}
                tags={extracurricular.tags}
              />
            </div>
          </section>
        </main>

        <footer className="editorial-shell border-t border-line py-8 pr-24 sm:py-10 sm:pr-36">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-record font-medium text-ink">
                {identity.shortTitle}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 font-mono text-meta tracking-[0.08em] text-ink-2">
                {email ? (
                  <a
                    className="transition-colors duration-200 hover:text-accent"
                    href={`mailto:${email}`}
                  >
                    {email}
                  </a>
                ) : null}
                {linkedIn ? (
                  <a
                    className="transition-colors duration-200 hover:text-accent"
                    href={linkedIn}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
              {identity.location || identity.availability ? (
                <p className="mt-3 font-mono text-meta tracking-[0.08em] text-ink-3">
                  {[identity.location, identity.availability]
                    .filter((value): value is string => Boolean(value))
                    .join(" · ")}
                </p>
              ) : null}
            </div>
            <p className="font-mono text-meta tracking-[0.1em] text-ink-2 uppercase">
              Source · data/knowledge-base.json
            </p>
          </div>
        </footer>

        <AssistantTrigger />
      </div>
    </LineageScope>
  );
}
