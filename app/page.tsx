import AppShell from "../components/AppShell";

export default function Page() {
  const aiEnabled =
    process.env.EXAMPLE_ONLY_DEMO === "true"
      ? false
      : Boolean(process.env.OPENAI_API_KEY && process.env.MVP_ACCESS_CODE);
  return <AppShell aiEnabled={aiEnabled} githubUrl={getGithubUrl()} />;
}

function getGithubUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  if (explicitUrl) return explicitUrl;

  const repoOwner = process.env.VERCEL_GIT_REPO_OWNER;
  const repoSlug = process.env.VERCEL_GIT_REPO_SLUG;
  if (repoOwner && repoSlug) return `https://github.com/${repoOwner}/${repoSlug}`;

  return "https://github.com/LineZero-Studio/thinking-hats";
}
