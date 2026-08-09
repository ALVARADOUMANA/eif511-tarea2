import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        // Autor: nombre, biografía e imagen (requisito del ejercicio)
        author: z.object({
          name: z.string(),
          bio: z.string(),
          image: z.string()
        }),
        // Fecha de publicación
        date: z.date(),
        // Categoría: una de las tres secciones del periódico
        category: z.enum(['sucesos', 'deportes', 'espectaculos'])
      })
    })
  }
})
