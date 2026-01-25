import { getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export const metadata = {
  title: "Family Travel | Half Pint Mama",
  description: "Family travel guides, tips for traveling with toddlers and babies, and adventure stories.",
};

export default function TravelPage() {
  const posts = getPostsByCategory("travel");

  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <span className="text-5xl mb-4 block">✈️</span>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Family Travel
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl">
            Adventures with toddlers and a baby! Tips for keeping little ones happy on the road and guides to family-friendly destinations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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

        {posts.length === 0 && (
          <p className="text-center text-charcoal/60 py-12">
            No posts yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
