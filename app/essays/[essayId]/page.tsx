import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { EssayDetail } from "@/components/essays/essay-detail";
import { getEssayById } from "@/lib/data/essays";
import { getDemoEssays } from "@/lib/mock-data/essays";

interface EssayDetailPageProps {
  params: Promise<{ essayId: string }>;
}

export async function generateStaticParams() {
  return getDemoEssays().map((essay) => ({ essayId: essay.id }));
}

export async function generateMetadata({
  params,
}: EssayDetailPageProps): Promise<Metadata> {
  const { essayId } = await params;
  const essay = await getEssayById(essayId);
  if (!essay) return { title: "Essay not found" };
  return {
    title: `${essay.title} — Essay Coach`,
    description: essay.prompt_text?.slice(0, 160),
  };
}

export default async function EssayDetailPage({ params }: EssayDetailPageProps) {
  const { essayId } = await params;
  const essay = await getEssayById(essayId);

  if (!essay) notFound();

  return (
    <AppShell>
      <EssayDetail initialEssay={essay} />
    </AppShell>
  );
}
