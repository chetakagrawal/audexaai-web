import ProjectDetailClient from './ProjectDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array since we can't fetch projects at build time
  // (requires authentication). The page will be generated dynamically at runtime.
  return [];
}

// Allow dynamic params for runtime generation
export const dynamicParams = true;

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
