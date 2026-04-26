const normalizeBasePath = (basePath: string | undefined) => {
  const trimmedBasePath = basePath?.trim() || '/';

  if (trimmedBasePath === '/') {
    return '/';
  }

  const withLeadingSlash = trimmedBasePath.startsWith('/')
    ? trimmedBasePath
    : `/${trimmedBasePath}`;

  return withLeadingSlash.replace(/\/+$/, '') || '/';
};

export const appBasePath = normalizeBasePath(import.meta.env.BASE_URL);

export const appPath = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (appBasePath === '/') {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `${appBasePath}/`;
  }

  return `${appBasePath}${normalizedPath}`;
};
