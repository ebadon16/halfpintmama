import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
}

const categoryColors: Record<string, string> = {
  cooking: "bg-terracotta",
  travel: "bg-sage",
  diy: "bg-soft-pink",
  "mama-life": "bg-deep-sage",
  default: "bg-sage",
};

export function PostCard({ slug, title, excerpt, category, date, image }: PostCardProps) {
  const badgeColor = categoryColors[category] || categoryColors.default;

  return (
    <Link href={`/posts/${slug}`} className="group">
      <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-light-sage to-warm-beige">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <span className={`inline-block px-3 py-1 ${badgeColor} text-white text-xs font-semibold rounded-full uppercase tracking-wide mb-3`}>
            {category.replace("-", " ")}
          </span>

          <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2 leading-tight group-hover:text-deep-sage transition-colors">
            {title}
          </h3>

          <p className="text-charcoal/70 text-sm leading-relaxed mb-4 line-clamp-2">
            {excerpt}
          </p>

          <p className="text-sage text-sm font-medium">
            {date}
          </p>
        </div>
      </article>
    </Link>
  );
}
