const getFullImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.12.15:8001/api/v1";
  const origin = baseUrl.replace(/\/api\/v1\/?$/, "");

  if (!path.startsWith("/") && !path.includes("/")) {
    return `${baseUrl.replace(/\/$/, "")}/media/categories/${path}`;
  }

  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default getFullImageUrl;