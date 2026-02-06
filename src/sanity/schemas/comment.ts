import { defineField, defineType } from "sanity";

export const comment = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "postSlug",
      title: "Post Slug",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: "parentId",
      title: "Parent Comment ID",
      type: "string",
      description: "If this is a reply, the ID of the parent comment",
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      author: "author",
      content: "content",
      postSlug: "postSlug",
    },
    prepare({ author, content, postSlug }) {
      return {
        title: `${author} on ${postSlug}`,
        subtitle: content?.substring(0, 50) + (content?.length > 50 ? "..." : ""),
      };
    },
  },
});
