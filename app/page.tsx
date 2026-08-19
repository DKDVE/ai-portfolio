import { AssistantTrigger } from "@/components/assistant-trigger";
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

export default function Home() {
  const identity = getIdentityRecord();
  const summary = getSummaryRecord();
  const experiences = getExperienceRecords();
  const project = getProjectRecord();
  const skills = getSkillsRecord();
  const education = getEducationRecords();
  const certifications = getCertificationsRecord();
  const extracurricular = getExtracurricularRecord();
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

  return (
    <LineageScope>
      <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
        <header className="editorial-shell border-b border-line pt-8 pb-16 sm:pt-10 sm:pb-24">
          <div className="flex items-start justify-between gap-6 font-mono text-meta tracking-[0.12em] text-ink-2 uppercase">
            <span>Record · {identity.id}</span>
            <span className="max-w-[24ch] text-right">
              {identity.availability}
            </span>
          </div>

          <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-[minmax(0,2fr)_minmax(15rem,1fr)] lg:items-end">
            <div>
              <h1 className="max-w-[12ch] font-display text-display font-medium tracking-[-0.055em] text-ink">
                {identity.shortTitle}
              </h1>
              <p className="mt-8 max-w-[66ch] text-copy text-ink-2">
                {summary.content}
              </p>
            </div>

            <p className="max-w-[34ch] border-l border-line pl-5 font-mono text-meta tracking-[0.08em] text-ink-2 uppercase lg:justify-self-end">
              Location · {identity.location}
              <br />
              Source · knowledge-base
            </p>
          </div>
        </header>

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
              <a
                className="mt-2 inline-block font-mono text-meta tracking-[0.08em] text-ink-2 transition-colors duration-200 hover:text-accent"
                href={`mailto:${identity.contact.email}`}
              >
                {identity.contact.email}
              </a>
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
