import { getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Globe, Plane, Palette } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Travel & DIY | Half Pint Mama",
  description: "Explore family travel guides and creative DIY projects on Half Pint Mama. Tips for adventures with toddlers plus homemade costumes, crafts, and more.",
  alternates: { canonical: "https://halfpintmama.com/lifestyle" },
  openGraph: {
    title: "Travel & DIY | Half Pint Mama",
    description: "Explore family travel guides and creative DIY projects on Half Pint Mama.",
    url: "https://halfpintmama.com/lifestyle",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Travel & DIY | Half Pint Mama",
    description: "Explore family travel guides and creative DIY projects on Half Pint Mama.",
  },
};

export default async function LifestylePage() {
  const travelPosts = await getPostsByCategory("travel");
  const diyPosts = await getPostsByCategory("diy");

  return (
    <div className="bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <ThemedIcon icon={Globe} size="lg" color="sage" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Travel & DIY
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Adventures with toddlers and creative projects. From family-friendly destinations to
            handmade costumes and crafts - making memories together.
          </p>
          <SearchBar placeholder="Search travel & DIY..." className="max-w-md" />
        </div>

        {/* Travel Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ThemedIcon icon={Plane} size="md" color="sage" bare />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-2 border-b-4 border-sage">
              Family Travel
            </h2>
          </div>
          <p className="text-charcoal/70 mb-6 max-w-2xl">
            Tips for keeping little ones happy on the road and guides to family-friendly destinations.
          </p>

          {travelPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {travelPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={formatDate(post.date)}
                  image={post.image}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal/60 py-8 bg-white rounded-xl">
              Travel posts coming soon!
            </p>
          )}
        </section>

        {/* DIY Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <ThemedIcon icon={Palette} size="md" color="pink" bare />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-2 border-b-4 border-terracotta">
              DIY Projects
            </h2>
          </div>
          <p className="text-charcoal/70 mb-6 max-w-2xl">
            Crafts, costumes, and creative projects. From cardboard costumes to party decorations - making memories with our hands.
          </p>

          {diyPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {diyPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={formatDate(post.date)}
                  image={post.image}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal/60 py-8 bg-white rounded-xl">
              DIY posts coming soon!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
