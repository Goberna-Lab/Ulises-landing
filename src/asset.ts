/**
 * Prefija una ruta de `public/` con el base del build.
 *
 * Vite reescribe las URLs de los assets que importa, pero NO las rutas
 * absolutas escritas a mano en un atributo `src`. En GitHub Pages el sitio no
 * cuelga de la raíz del dominio, así que `/logo-goberna.svg` daría 404.
 */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`
