<!-- app/pages/index.vue -->
<script setup>
// Traemos las noticias más recientes de las tres categorías para la portada
const { data: recientes } = await useAsyncData('home-recientes', () => {
  return queryCollection('blog')
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'author', 'date', 'category')
    .limit(6)
    .all()
})

const categorias = [
  { slug: 'sucesos', nombre: 'Sucesos', descripcion: 'Seguridad, emergencias y hechos de interés policial y judicial.' },
  { slug: 'deportes', nombre: 'Deportes', descripcion: 'Fútbol, atletismo y las principales ligas nacionales.' },
  { slug: 'espectaculos', nombre: 'Espectáculos', descripcion: 'Cine, música, teatro y cultura nacional.' }
]

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <main class="home">
    <h1>Noticias Nacionales</h1>
    <p class="lead">Las últimas novedades del país, organizadas por sección.</p>

    <!-- Enlaces hacia cada una de las tres categorías -->
    <section class="categories">
      <NuxtLink
        v-for="cat in categorias"
        :key="cat.slug"
        :to="`/blog/${cat.slug}`"
        class="category-card"
      >
        <h2>{{ cat.nombre }}</h2>
        <p>{{ cat.descripcion }}</p>
      </NuxtLink>
    </section>

    <section class="recent">
      <h2>Lo más reciente</h2>
      <ul class="post-list">
        <li v-for="post in recientes" :key="post.path">
          <NuxtLink :to="post.path">
            <span class="badge">{{ post.category }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.description }}</p>
            <p class="meta">{{ post.author.name }} — {{ formatDate(post.date) }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>
