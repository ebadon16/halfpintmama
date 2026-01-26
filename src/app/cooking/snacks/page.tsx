import { getPostsBySubcategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";

export const metadata = {
  title: "Snacks & Finger Foods | Half Pint Mama",
  description: "Healthy homemade snacks for the whole family including crackers, granola, and more from a Pediatric ER RN.",
};

export default function SnacksPage() {
  const posts = getPostsBySubcategory("cooking", ["cracker", "snack", "roll-up", "granola", "popsicle", "bite"]);

  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/cooking" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            All Recipes
          </Link>
          <Link href="/cooking/sourdough" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Sourdough
          </Link>
          <Link href="/cooking/discard" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Discard Recipes
          </Link>
          <Link href="/cooking/desserts" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Desserts
          </Link>
          <Link href="/cooking/snacks" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            Snacks
          </Link>
        </div>

        <div className="mb-12">
          <span className="text-5xl mb-4 block">🥨</span>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Snacks & Finger Foods
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Healthy, homemade snacks that even the pickiest eaters will love. Perfect for lunchboxes, road trips,
            or afternoon munchies.
          </p>
          <SearchBar placeholder="Search snack recipes..." className="max-w-md" />
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
            No snack recipes yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
