import { getPostsBySubcategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Sourdough & Bread | Half Pint Mama",
  description: "Master the art of sourdough bread baking with tested recipes from a Pediatric ER RN turned sourdough mama.",
};

export default async function SourdoughPage() {
  const posts = await getPostsBySubcategory("cooking", ["sourdough", "loaf", "bread", "starter"], ["discard"]);

  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/cooking" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            All Recipes
          </Link>
          <Link href="/cooking/sourdough" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            Sourdough
          </Link>
          <Link href="/cooking/discard" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Discard Recipes
          </Link>
          <Link href="/cooking/desserts" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Desserts
          </Link>
          <Link href="/cooking/snacks" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Snacks
          </Link>
        </div>

        <div className="mb-12">
          <span className="text-5xl mb-4 block">🍞</span>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Sourdough & Bread
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            From your first starter to picture-perfect loaves. These recipes are tested with nurse-level precision
            to help you bake bread your family will love.
          </p>
          <SearchBar placeholder="Search sourdough recipes..." className="max-w-md" />
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
            No sourdough posts yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
