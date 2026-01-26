import { getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";

export const metadata = {
  title: "Travel & DIY | Half Pint Mama",
  description: "Family travel guides, DIY projects, crafts, and adventures with kids.",
};

export default function LifestylePage() {
  const travelPosts = getPostsByCategory("travel");
  const diyPosts = getPostsByCategory("diy");

  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <span className="text-5xl mb-4 block">🌎</span>
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
            <span className="text-3xl">✈️</span>
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-2 border-b-4 border-sage">
              Family Travel
            </h2>
          </div>
          <p className="text-charcoal/70 mb-6 max-w-2xl">
            Tips for keeping little ones happy on the road and guides to family-friendly destinations.
          </p>

          {travelPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span className="text-3xl">🎨</span>
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-2 border-b-4 border-terracotta">
              DIY Projects
            </h2>
          </div>
          <p className="text-charcoal/70 mb-6 max-w-2xl">
            Crafts, costumes, and creative projects. From cardboard costumes to party decorations - making memories with our hands.
          </p>

          {diyPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
