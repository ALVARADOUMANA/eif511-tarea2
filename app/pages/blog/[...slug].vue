<!-- app/pages/blog/[...slug].vue -->
<script setup>
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
}

// Anterior / siguiente restringido a la misma categoría del artículo actual
const { data: surroundings } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('blog', route.path, {
    before: 1,
    after: 1,
    fields: ['title', 'description']
  }).where('category', '=', post.value.category)
})

const anterior = computed(() => surroundings.value?.[0] ?? null)
const siguiente = computed(() => surroundings.value?.[1] ?? null)

useSeoMeta({
  title: post.value.title,
  description: post.value.description
})

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <article class="post-detail">
    <p class="badge">{{ post.category }}</p>
    <h1>{{ post.title }}</h1>

    <div class="author-box">
      <img :src="post.author.image" :alt="post.author.name" class="author-avatar">
      <div>
        <p class="author-name">{{ post.author.name }}</p>
        <p class="author-bio">{{ post.author.bio }}</p>
        <p class="meta">Publicado el {{ formatDate(post.date) }}</p>
      </div>
    </div>

    <ContentRenderer :value="post" />

    <nav class="surround-nav" aria-label="Navegación entre noticias de la misma categoría">
      <NuxtLink v-if="anterior" :to="anterior.path" class="surround-link prev">
        <span class="surround-label">&larr; Anterior en {{ post.category }}</span>
        <span class="surround-title">{{ anterior.title }}</span>
      </NuxtLink>
      <span v-else class="surround-link disabled">Es la noticia más antigua de {{ post.category }}</span>

      <NuxtLink v-if="siguiente" :to="siguiente.path" class="surround-link next">
        <span class="surround-label">Siguiente en {{ post.category }} &rarr;</span>
        <span class="surround-title">{{ siguiente.title }}</span>
      </NuxtLink>
      <span v-else class="surround-link disabled">Es la noticia más reciente de {{ post.category }}</span>
    </nav>

    <NuxtLink :to="`/blog/${post.category}`" class="back-link">Volver a {{ post.category }}</NuxtLink>
  </article>
</template>
