const DEFAULT_PROJECT_IMAGE =
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';

export function slugifyProjectTitle(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => `${item}`.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function mapProjectRow(project) {
  return {
    ...project,
    tags: normalizeList(project?.tags),
    gallery: normalizeList(project?.gallery),
    deliverables: normalizeList(project?.deliverables),
    image_url: project?.image_url || '',
    live_url: project?.live_url || '',
    status: project?.status || 'draft',
    slug: project?.slug || slugifyProjectTitle(project?.title || 'project'),
    featured: Boolean(project?.featured),
    sort_order: Number(project?.sort_order || 0),
  };
}

export function normalizeProjectPayload(formData, existingProject) {
  const title = formData.title.trim();
  const status = formData.status || 'draft';
  const nextPublishedAt =
    status === 'published'
      ? existingProject?.published_at || new Date().toISOString()
      : null;

  return {
    title,
    slug: slugifyProjectTitle(formData.slug || title),
    category: formData.category.trim(),
    description: formData.description.trim(),
    tags: normalizeList(formData.tags),
    image_url: formData.image_url.trim(),
    gallery: normalizeList(formData.gallery),
    deliverables: normalizeList(formData.deliverables),
    project_type: formData.project_type || 'web',
    live_url: formData.live_url.trim(),
    status,
    featured: Boolean(formData.featured),
    sort_order: Number(formData.sort_order || 0),
    published_at: nextPublishedAt,
  };
}

export function extractStoragePath(projectUrl, supabaseUrl) {
  if (!projectUrl || !supabaseUrl) return null;

  const marker = `${supabaseUrl}/storage/v1/object/public/project-images/`;
  if (!projectUrl.startsWith(marker)) return null;

  return projectUrl.slice(marker.length);
}

export function buildProjectSearchText(project) {
  return [
    project.title,
    project.category,
    project.description,
    ...(project.tags || []),
    ...(project.deliverables || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function getProjectStatusLabel(status) {
  switch (status) {
    case 'published':
      return 'Published';
    case 'archived':
      return 'Archived';
    default:
      return 'Draft';
  }
}

export { DEFAULT_PROJECT_IMAGE };
