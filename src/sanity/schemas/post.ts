import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Cooking", value: "cooking" },
          { title: "Travel", value: "travel" },
          { title: "DIY", value: "diy" },
          { title: "Mama Life", value: "mama-life" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "ratingAverage",
      title: "Average Rating",
      type: "number",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "ratingCount",
      title: "Rating Count",
      type: "number",
      readOnly: true,
      hidden: true,
    }),

    // Recipe fields (optional)
    defineField({
      name: "recipe",
      title: "Recipe",
      type: "object",
      fields: [
        defineField({
          name: "servings",
          title: "Servings",
          type: "number",
        }),
        defineField({
          name: "prepTime",
          title: "Prep Time",
          type: "string",
        }),
        defineField({
          name: "cookTime",
          title: "Cook Time",
          type: "string",
        }),
        defineField({
          name: "totalTime",
          title: "Total Time",
          type: "string",
        }),
        defineField({
          name: "ingredients",
          title: "Ingredients",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "ingredientSections",
          title: "Ingredient Sections",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Section Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "items",
                  title: "Items",
                  type: "array",
                  of: [{ type: "string" }],
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "instructions",
          title: "Instructions",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "instructionSections",
          title: "Instruction Sections",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Section Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "steps",
                  title: "Steps",
                  type: "array",
                  of: [{ type: "string" }],
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "nutrition",
          title: "Nutrition",
          type: "object",
          fields: [
            defineField({ name: "calories", title: "Calories", type: "number" }),
            defineField({ name: "protein", title: "Protein (g)", type: "number" }),
            defineField({ name: "carbs", title: "Carbs (g)", type: "number" }),
            defineField({ name: "fat", title: "Fat (g)", type: "number" }),
            defineField({ name: "fiber", title: "Fiber (g)", type: "number" }),
            defineField({ name: "sugar", title: "Sugar (g)", type: "number" }),
          ],
        }),
      ],
    }),

    // Body — Portable Text rich editor
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"],
                      }),
                  },
                ],
              },
            ],
          },
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              options: {
                list: [
                  { title: "Center", value: "center" },
                  { title: "Float Right", value: "float-right" },
                  { title: "Float Left", value: "float-left" },
                ],
                layout: "radio",
              },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Large", value: "large" },
                ],
                layout: "radio",
              },
              initialValue: "medium",
            }),
          ],
        },
        {
          name: "externalImage",
          title: "External Image",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "Image URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "layout",
              title: "Layout",
              type: "string",
              options: {
                list: [
                  { title: "Center", value: "center" },
                  { title: "Float Right", value: "float-right" },
                  { title: "Float Left", value: "float-left" },
                ],
                layout: "radio",
              },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              options: {
                list: [
                  { title: "Small", value: "small" },
                  { title: "Medium", value: "medium" },
                  { title: "Large", value: "large" },
                ],
                layout: "radio",
              },
              initialValue: "medium",
            }),
          ],
          preview: {
            select: { url: "url", alt: "alt" },
            prepare({ url, alt }: { url?: string; alt?: string }) {
              return {
                title: alt || "External Image",
                subtitle: url,
              };
            },
          },
        },
        {
          name: "imageGrid",
          title: "Image Grid",
          type: "object",
          fields: [
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "Alt Text",
                      type: "string",
                    }),
                  ],
                },
              ],
              validation: (rule) => rule.min(2).max(3).required(),
            }),
            defineField({
              name: "columns",
              title: "Columns",
              type: "string",
              options: {
                list: [
                  { title: "2 Columns", value: "2" },
                  { title: "3 Columns", value: "3" },
                ],
                layout: "radio",
              },
              initialValue: "2",
            }),
          ],
          preview: {
            select: { images: "images", columns: "columns" },
            prepare({ images, columns }: { images?: unknown[]; columns?: string }) {
              const count = images?.length || 0;
              return {
                title: `Image Grid (${count} images)`,
                subtitle: `${columns || 2} columns`,
              };
            },
          },
        },
        {
          name: "youtube",
          title: "YouTube",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "YouTube URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { url: "url", caption: "caption" },
            prepare({ url, caption }: { url?: string; caption?: string }) {
              return {
                title: caption || "YouTube Video",
                subtitle: url,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      category: "category",
      media: "image",
    },
    prepare(selection) {
      const { title, date, category } = selection;
      return {
        title: title || "Untitled",
        subtitle: `${category || ""} ${date ? `| ${date}` : ""}`,
        media: selection.media,
      };
    },
  },
});
