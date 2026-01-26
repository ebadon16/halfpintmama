interface RecipeSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  slug: string;
}

export function RecipeSchema({ title, description, image, datePublished, slug }: RecipeSchemaProps) {
  const baseUrl = "https://halfpintmama.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: title,
    description: description,
    image: image ? [image] : [],
    author: {
      "@type": "Person",
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    datePublished: datePublished,
    publisher: {
      "@type": "Organization",
      name: "Half Pint Mama",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpg`,
      },
    },
    url: `${baseUrl}/posts/${slug}`,
    recipeCategory: "Sourdough",
    recipeCuisine: "American",
    keywords: `${title}, sourdough, recipe, homemade`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BlogPostSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  slug: string;
  category: string;
}

export function BlogPostSchema({ title, description, image, datePublished, slug, category }: BlogPostSchemaProps) {
  const baseUrl = "https://halfpintmama.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: image ? [image] : [],
    author: {
      "@type": "Person",
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    datePublished: datePublished,
    dateModified: datePublished,
    publisher: {
      "@type": "Organization",
      name: "Half Pint Mama",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/posts/${slug}`,
    },
    articleSection: category,
    keywords: `${title}, ${category}, half pint mama`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
