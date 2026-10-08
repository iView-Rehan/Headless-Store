export function PageHeader({
  title,
  intro,
  testId,
}: {
  title: string;
  intro?: string;
  testId?: string;
}) {
  return (
    <div className="bg-[#2e4a40] text-[#f5f6f1]" data-testid={testId}>
      <div className="container-x py-14 sm:py-20">
        <h1 className="text-4xl sm:text-6xl">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-xl text-base sm:text-lg opacity-80">
            {intro}
          </p>
        ) : null}
      </div>
    </div>
  );
}
