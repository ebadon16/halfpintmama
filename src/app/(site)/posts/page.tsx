import { getPaginatedPosts, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";

export const revalidate = 3600;

export const metadata = {
  title: "All Posts | Half Pint Mama",
  description: "Browse all blog posts on Half Pint Mama. Find from-scratch recipes, sourdough baking guides, and honest parenting tips from a Pediatric ER RN and mama of two.",
  alternates: { canonical: "https://halfpintmama.com/posts" },
  openGraph: {
    title: "All Posts | Half Pint Mama",
    description: "Browse all blog posts on Half Pint Mama. From-scratch recipes, sourdough baking, and honest parenting tips.",
    type: "website",
    url: "https://halfpintmama.com/posts",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "All Posts | Half Pint Mama",
    description: "Browse all blog posts on Half Pint Mama. From-scratch recipes, sourdough baking, and honest parenting tips.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalCount, totalPages } = await getPaginatedPosts(currentPage);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://halfpintmama.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Posts",
        item: "https://halfpintmama.com/posts",
      },
    ],
  };

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
          All Posts
        </h1>
        <p className="text-charcoal/70 text-lg mb-6">
          {totalCount} recipes, guides, and stories
        </p>
        <SearchBar placeholder="Search all posts..." className="max-w-md mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              date={formatDate(post.date)}
              image={post.image}
              ratingAverage={post.ratingAverage}
              ratingCount={post.ratingCount}
              headingLevel="h2"
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/posts"
        />

        <HomeEmailSignup />
      </div>
    </div>
  );
}
