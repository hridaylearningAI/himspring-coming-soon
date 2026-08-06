/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Journal covers are uploaded to Supabase Storage from /admin, so next/image
     has to be told this host is allowed to serve them — without it every post
     with a cover throws at render. Scoped to the public object path: nothing
     else in that bucket API is an image. */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eugflgkmcujzsswjcaqs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async redirects() {
    return [
      /* /v2 was where the homepage was built and reviewed. It is `/` now, so
         the old URL forwards rather than serving a second copy of the same
         composition — two routes rendering one page is two things to keep in
         step and two URLs for a crawler to weigh against each other.

         Declared here rather than as a page that calls redirect(), because
         there is no longer a route at /v2 to render: app/(home)/v2/ still holds
         the components and deck.css, but its page.tsx is gone. This answers at
         the edge with a 308 and never enters React.

         Permanent, so it is cached and eventually forgotten. The study link was
         shared during review; anyone who kept it lands on the finished page.

         There is deliberately no redirect for /v1. That is a live archive of
         the previous homepage, not a moved URL — see app/(home)/v1/page.tsx. */
      { source: "/v2", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
