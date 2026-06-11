import LandingPage from "../components/LandingPage";
import SiteHeader from "../components/SiteHeader";

export default function Page() {
  return (
    <div className="app">
      <SiteHeader />
      <LandingPage githubUrl={getGithubUrl()} />
    </div>
  );
}

function getGithubUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  if (explicitUrl) return explicitUrl;

  const repoOwner = process.env.VERCEL_GIT_REPO_OWNER;
  const repoSlug = process.env.VERCEL_GIT_REPO_SLUG;
  if (repoOwner && repoSlug) return `https://github.com/${repoOwner}/${repoSlug}`;

  return "https://github.com/LineZero-Studio/thinking-hats";
}
