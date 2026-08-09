<!-- app/pages/blog/[category]/index.vue -->
<script setup>
const route = useRoute()

const CATEGORIAS_VALIDAS = ['sucesos', 'deportes', 'espectaculos']
const NOMBRES = {
  sucesos: 'Sucesos',
  deportes: 'Deportes',
  espectaculos: 'Espectáculos'
}

const category = route.params.category

// Solo permitimos las tres categorías declaradas en el schema
if (!CATEGORIAS_VALIDAS.includes(category)) {
  throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada' })
}

const { data: posts } = await useAsyncData(`categoria-${category}`, () => {
  return queryCollection('blog')
    .where('category', '=', category)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'author', 'date', 'category')
    .all()
})

if (!posts.value || posts.value.length === 0) {
  // La categoría es válida pero aún no tiene artículos; no es un error 404
}

useSeoMeta({
  title: NOMBRES[category]
})

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <main class="category-page">
    <h1>{{ NOMBRES[category] }}</h1>

    <p v-if="!posts || posts.length === 0" class="empty">
      Todavía no hay artículos publicados en esta categoría.
    </p>

    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink :to="post.path">
          <h2>{{ post.title }}</h2>
          <p>{{ post.description }}</p>
          <p class="meta">{{ post.author.name }} — {{ formatDate(post.date) }}</p>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
