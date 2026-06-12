import { redirect } from "next/navigation";

export default async function MatchesRedirectPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q;
  if (q) {
    redirect(`/calendar?q=${encodeURIComponent(q)}`);
  } else {
    redirect("/calendar");
  }
}
