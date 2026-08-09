# Blog de Noticias Nacionales — Ejercicios Tutorial 2 (Nuxt Content)

**Nombre del estudiante:** Pablo Antonio Alvarado Umaña

Proyecto para el curso de Arquitectura de Información, elaborado sobre la base
de Nuxt 4 y el módulo `@nuxt/content`, siguiendo la estructura del Tutorial 2
("Blog con Nuxt Content").

## Instalación

```bash
npm install
npm run dev
```

La aplicación corre en `http://localhost:3000`.

## Cómo se resolvió cada punto del ejercicio

### 1. Nueve entradas en tres categorías, con schema de autor completo

`content.config.ts` declara la colección `blog` (tipo `page`, origen
`blog/**/*.md`) con un `schema` de Zod que exige:

- `author`: objeto con `name`, `bio` e `image`.
- `date`: fecha de publicación.
- `category`: uno de los valores `sucesos`, `deportes` o `espectaculos`.

Las nueve entradas viven en:

```
content/blog/sucesos/        (3 artículos, autora: María Fernanda Solís)
content/blog/deportes/       (3 artículos, autor: Carlos Andrés Rojas)
content/blog/espectaculos/   (3 artículos, autora: Daniela Castro Mora)
```

Las imágenes de los autores son archivos SVG de marcador de posición ubicados
en `public/images/authors/`, referenciados desde el frontmatter con la ruta
pública (ej. `/images/authors/maria-solis.svg`).

### 2. Página principal con enlaces a categorías + listado por categoría

- `app/pages/index.vue`: portada del blog, con tarjetas que enlazan a
  `/blog/sucesos`, `/blog/deportes` y `/blog/espectaculos`, además de un
  resumen de las noticias más recientes de las tres secciones.
- `app/pages/blog/[category]/index.vue`: página de listado por categoría.
  Usa `queryCollection('blog').where('category', '=', category)` para traer
  únicamente las entradas de la sección solicitada, ordenadas por fecha
  descendente. Si el parámetro de ruta no corresponde a una de las tres
  categorías válidas, responde con un error 404.

### 3. Noticia anterior / siguiente restringida a la misma categoría

`app/pages/blog/[...slug].vue` es la página de detalle de cada artículo.
Para la navegación entre noticias utiliza:

```js
queryCollectionItemSurroundings('blog', route.path, {
  before: 1,
  after: 1,
  fields: ['title', 'description']
}).where('category', '=', post.value.category)
```

El `.where('category', '=', ...)` encadenado garantiza que "anterior" y
"siguiente" solo consideren artículos de la misma sección que se está
leyendo, nunca de otra categoría.

### 4. Búsqueda de texto completo sobre todas las noticias

`app/pages/buscar.vue` implementa una búsqueda global (sin filtrar por
categoría) usando el composable `useSearchCollection('blog')`, que construye
en el navegador un índice FTS5 (SQLite) a partir de las secciones del
contenido, incluyendo el **cuerpo** de cada artículo y no solo el título o la
descripción.

Esto se puede comprobar buscando un término que solo aparece dentro del texto
de un artículo (no en su título), por ejemplo:

- Buscar **"corto circuito"** → debe aparecer la noticia del incendio del
  Mercado Central, aunque esas palabras no están en el título.
- Buscar **"tiempo extra"** → debe aparecer la noticia de la final de
  baloncesto.
- Buscar **"talleres comunitarios"** → debe aparecer la noticia de la obra
  de teatro.

## Estructura relevante del proyecto

```
content.config.ts                    Definición de la colección "blog" y su schema
nuxt.config.ts                       Registro de @nuxt/content y hoja de estilos
content/blog/sucesos/*.md            3 artículos de la sección Sucesos
content/blog/deportes/*.md           3 artículos de la sección Deportes
content/blog/espectaculos/*.md       3 artículos de la sección Espectáculos
app/app.vue                          Layout raíz (encabezado + NuxtPage)
app/components/TheHeader.vue         Navegación principal del sitio
app/pages/index.vue                  Portada del blog (punto 2)
app/pages/blog/[category]/index.vue  Listado por categoría con where() (punto 2)
app/pages/blog/[...slug].vue         Detalle + anterior/siguiente (punto 3)
app/pages/buscar.vue                 Búsqueda de texto completo (punto 4)
app/assets/css/blog.css              Estilos del blog
public/images/authors/*.svg          Imágenes de los autores
```
