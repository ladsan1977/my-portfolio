import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      img: image(),
      img_alt: z.string().optional(),
    }),
});

export const collections = { work };
