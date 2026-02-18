import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/client";

const sizeStyles: Record<string, string> = {
  small: "max-w-[220px]",
  medium: "max-w-[380px]",
  large: "max-w-[600px] w-full",
};

const sizesAttr: Record<string, string> = {
  small: "220px",
  medium: "380px",
  large: "(max-width: 600px) 100vw, 600px",
};

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        className="font-[family-name:var(--font-crimson)] font-bold text-charcoal mt-12 mb-4"
        style={{ fontSize: "28px" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-[family-name:var(--font-crimson)] font-bold text-charcoal mt-8 mb-3"
        style={{ fontSize: "22px" }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className="font-[family-name:var(--font-crimson)] font-bold text-charcoal mt-6 mb-2"
        style={{ fontSize: "18px" }}
      >
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-charcoal/80 leading-relaxed mb-4" style={{ fontSize: "16px" }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sage pl-4 italic text-charcoal/70 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-1 my-4 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="space-y-1 my-4 pl-5 list-decimal">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-charcoal/80 leading-relaxed" style={{ fontSize: "16px" }}>
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-charcoal/80 leading-relaxed" style={{ fontSize: "16px" }}>
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-charcoal font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isInternal = href.startsWith("/") || href.startsWith("#") || href.startsWith("https://halfpintmama.com");
      if (isInternal) {
        const path = href.startsWith("https://halfpintmama.com") ? href.replace("https://halfpintmama.com", "") : href;
        return (
          <Link
            href={path}
            className="inline-flex items-center gap-1 text-terracotta font-medium hover:underline"
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-terracotta font-medium hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const size = value.size || "medium";
      const layout = value.layout || "center";
      const imgSize = sizeStyles[size] || sizeStyles.medium;

      const imgEl = (
        <Image
          src={urlFor(value).width(600).auto("format").url()}
          alt={value.alt || "Image from post"}
          width={600}
          height={400}
          sizes={sizesAttr[size] || sizesAttr.medium}
          loading="lazy"
          className={`rounded-lg shadow-sm object-cover ${imgSize}`}
        />
      );

      if (layout === "float-right") {
        return <figure className={`float-right ml-6 mb-4 mt-2 ${imgSize}`}>{imgEl}</figure>;
      }
      if (layout === "float-left") {
        return <figure className={`float-left mr-6 mb-4 mt-2 ${imgSize}`}>{imgEl}</figure>;
      }
      return <figure className="my-6 flex justify-center">{imgEl}</figure>;
    },
    externalImage: ({ value }) => {
      if (!value?.url) return null;
      const size = value.size || "medium";
      const layout = value.layout || "center";
      const imgSize = sizeStyles[size] || sizeStyles.medium;

      const imgEl = (
        <Image
          src={value.url}
          alt={value.alt || "Image from post"}
          width={600}
          height={400}
          sizes={sizesAttr[size] || sizesAttr.medium}
          loading="lazy"
          className={`rounded-lg shadow-sm object-cover ${imgSize}`}
        />
      );

      if (layout === "float-right") {
        return <figure className={`float-right ml-6 mb-4 mt-2 ${imgSize}`}>{imgEl}</figure>;
      }
      if (layout === "float-left") {
        return <figure className={`float-left mr-6 mb-4 mt-2 ${imgSize}`}>{imgEl}</figure>;
      }
      return <figure className="my-6 flex justify-center">{imgEl}</figure>;
    },
    imageGrid: ({ value }) => {
      if (!value?.images?.length) return null;
      const cols = value.columns === "3" ? "md:grid-cols-3" : "md:grid-cols-2";
      const gridSizes = value.columns === "3"
        ? "(max-width: 768px) 100vw, 33vw"
        : "(max-width: 768px) 100vw, 50vw";
      return (
        <div className={`my-6 grid grid-cols-1 ${cols} gap-4`}>
          {value.images.map((img: { asset?: { _ref?: string }; alt?: string; _key?: string }, i: number) => {
            if (!img?.asset) return null;
            return (
              <Image
                key={img._key || i}
                src={urlFor(img).width(600).auto("format").url()}
                alt={img.alt || "Image from post"}
                width={600}
                height={400}
                sizes={gridSizes}
                loading="lazy"
                className="rounded-lg shadow-sm object-cover w-full"
              />
            );
          })}
        </div>
      );
    },
    youtube: ({ value }) => {
      if (!value?.url) return null;
      const videoId = getYouTubeId(value.url);
      if (!videoId) return null;
      return (
        <figure className="my-6">
          <div className="aspect-video rounded-lg overflow-hidden shadow-sm">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={value.caption || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-charcoal/60 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
