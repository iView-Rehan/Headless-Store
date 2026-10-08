import { PageHeader } from './PageHeader';

export type InfoSection = { title: string; body: string[] };

export function InfoPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: string;
  sections: InfoSection[];
}) {
  return (
    <div className="mx-auto">
      <PageHeader title={title} intro={intro} />
      <div className="container-x py-12 sm:py-16">
        <div className="max-w-2xl divide-y divide-[color:var(--line)]">
          {sections.map((section) => (
            <section key={section.title} className="py-8 first:pt-0">
              <h2 className="text-xl sm:text-2xl mb-3">{section.title}</h2>
              {section.body.map((text) => (
                <p key={text} className="opacity-80 mb-3 last:mb-0">
                  {text}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
