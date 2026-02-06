"use client";

import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "./FavoriteButton";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
  tags?: string[];
  ratingAverage?: number;
  ratingCount?: number;
}

const categoryColors: Record<string, string> = {
  cooking: "bg-terracotta",
  travel: "bg-sage",
  diy: "bg-soft-pink",
  "mama-life": "bg-deep-sage",
  default: "bg-sage",
};

export function PostCard({ slug, title, excerpt, category, date, image, tags, ratingAverage, ratingCount }: PostCardProps) {
  const badgeColor = categoryColors[category] || categoryColors.default;

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative">
      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton
          slug={slug}
          title={title}
          className="p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
        />
      </div>

      <Link href={`/posts/${slug}`}>
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-light-sage to-warm-beige">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-block px-3 py-1 ${badgeColor} text-white text-xs font-semibold rounded-full uppercase tracking-wide`}>
              {category.replace("-", " ")}
            </span>
            {tags && tags.length > 0 && tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 bg-warm-beige text-charcoal/70 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2 leading-tight group-hover:text-deep-sage transition-colors">
            {title}
          </h3>

          <p className="text-charcoal/70 text-sm leading-relaxed mb-4 line-clamp-2">
            {excerpt}
          </p>

          <div className="flex items-center gap-3">
            <p className="text-sage text-sm font-medium">
              {date}
            </p>
            {ratingCount && ratingCount > 0 && (
              <>
                <span className="text-charcoal/30">|</span>
                <div className="flex items-center gap-1 text-sm text-charcoal/70">
                  <span className="text-yellow-500">★</span>
                  <span>{ratingAverage?.toFixed(1)}</span>
                  <span className="text-charcoal/50">({ratingCount})</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
