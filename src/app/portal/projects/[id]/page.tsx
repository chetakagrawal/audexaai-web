import ProjectDetailClient from './ProjectDetailClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // For static export, we must return at least one param.
  // Since we can't fetch projects at build time (requires authentication),
  // we return a placeholder. The actual project pages will be handled dynamically.
  // This satisfies the static export requirement while allowing runtime generation.
  return [{ id: 'placeholder' }];
}

// Allow dynamic params for runtime generation
export const dynamicParams = true;

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
