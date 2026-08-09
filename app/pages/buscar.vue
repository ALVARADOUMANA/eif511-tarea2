<!-- app/pages/buscar.vue -->
<script setup>
// useSearchCollection indexa TODO el contenido de la colección (título, descripción
// y cuerpo del artículo) usando SQLite FTS5, sin restringir por categoría.
const { status, search } = useSearchCollection('blog', {
  extraFields: ['category']
})

const query = ref('')
const results = ref([])

const NOMBRES = {
  sucesos: 'Sucesos',
  deportes: 'Deportes',
  espectaculos: 'Espectáculos'
}

watch(query, async (value) => {
  results.value = value.trim().length > 1 ? await search(value) : []
})

useSeoMeta({ title: 'Buscar noticias' })
</script>

<template>
  <main class="search-page">
    <h1>Buscar noticias</h1>
    <p class="lead">
      La búsqueda revisa el título, la descripción y el contenido completo de cada
      artículo, sin importar su categoría.
    </p>

    <input
      v-model="query"
      type="search"
      placeholder="Buscar por ejemplo: puente, medalla, festival…"
      class="search-input"
      aria-label="Buscar noticias"
    >

    <p v-if="status === 'loading'" class="search-status">Preparando el índice de búsqueda…</p>

    <p v-else-if="query.trim().length > 1 && results.length === 0" class="search-status">
      No se encontraron resultados para «{{ query }}».
    </p>

    <ul v-else class="post-list">
      <li v-for="item in results" :key="item.id">
        <NuxtLink :to="item.id">
          <span v-if="item.category" class="badge">{{ NOMBRES[item.category] ?? item.category }}</span>
          <h3>{{ item.title }}</h3>
          <p v-html="item.content" />
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
