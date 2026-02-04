import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "master",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "273bf5e1-3214-42e0-8814-8de04677400c",
  token: process.env.NEXT_PUBLIC_TINA_TOKEN || "17130ba255ca53fd13a54d085638127cde4a4bf2",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/posts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              { value: "cooking", label: "Cooking" },
              { value: "travel", label: "Travel" },
              { value: "diy", label: "DIY" },
              { value: "mama-life", label: "Mama Life" },
            ],
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "image",
            label: "Image",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },

          // Recipe fields (optional — leave empty for non-recipe posts)
          {
            type: "number",
            name: "servings",
            label: "Servings",
          },
          {
            type: "string",
            name: "prepTime",
            label: "Prep Time",
          },
          {
            type: "string",
            name: "cookTime",
            label: "Cook Time",
          },
          {
            type: "string",
            name: "totalTime",
            label: "Total Time",
          },

          // Flat ingredients list
          {
            type: "string",
            name: "ingredients",
            label: "Ingredients",
            list: true,
          },

          // Grouped ingredient sections
          {
            type: "object",
            name: "ingredientSections",
            label: "Ingredient Sections",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title",
                required: true,
              },
              {
                type: "string",
                name: "items",
                label: "Items",
                list: true,
              },
            ],
          },

          // Flat instructions list
          {
            type: "string",
            name: "instructions",
            label: "Instructions",
            list: true,
          },

          // Grouped instruction sections
          {
            type: "object",
            name: "instructionSections",
            label: "Instruction Sections",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title",
                required: true,
              },
              {
                type: "string",
                name: "steps",
                label: "Steps",
                list: true,
              },
            ],
          },

          // Nutrition
          {
            type: "object",
            name: "nutrition",
            label: "Nutrition",
            fields: [
              {
                type: "number",
                name: "calories",
                label: "Calories",
              },
              {
                type: "number",
                name: "protein",
                label: "Protein (g)",
              },
              {
                type: "number",
                name: "carbs",
                label: "Carbs (g)",
              },
              {
                type: "number",
                name: "fat",
                label: "Fat (g)",
              },
              {
                type: "number",
                name: "fiber",
                label: "Fiber (g)",
              },
              {
                type: "number",
                name: "sugar",
                label: "Sugar (g)",
              },
            ],
          },

          // Body — plain textarea to preserve custom <!-- IMG: ... --> syntax
          {
            type: "string",
            name: "body",
            label: "Body",
            isBody: true,
            ui: {
              component: "textarea",
            },
          },
        ],
      },
    ],
  },
});
