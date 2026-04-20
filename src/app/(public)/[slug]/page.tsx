import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PortfolioPage({ params }: Props) {
  const { slug } = await params;

  // TODO: fetch portfolio by slug from DB
  if (!slug) notFound();

  return (
    <main>
      <h1>Portfolio: {slug}</h1>
    </main>
  );
}
