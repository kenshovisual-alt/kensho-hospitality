# Mudanza de hospitality.kenshovisual.com a Cloudflare

**Hecha el 29-10-2026 (20:07 CET).** La web la sirve el Worker `kensho-hospitality` (Cloudflare Workers, plan gratis,
**solo assets estáticos**: ninguna visita ejecuta código ni gasta cuota). Vercel ya no tiene el dominio (el proyecto
`kensho-hospitality` sigue, sin dominio). **Un push a `main` ya no publica nada:** se publica con

```bash
CLOUDFLARE_API_TOKEN=$(security find-generic-password -s cloudflare-api-token -a kensho -w) npx wrangler deploy
```

Este fichero no se publica (`.assetsignore`).

## Cómo queda

| Pieza | Estado |
|---|---|
| Web | Worker `kensho-hospitality`, ruta `hospitality.kenshovisual.com/*` (en `wrangler.jsonc`), carpeta del repo como assets |
| `http://` | Redirect Rule de la zona `kenshovisual.com`: → `https://hospitality.kenshovisual.com` + ruta, 301 en un salto |
| `_redirects` | `/index.html` → `/` (301). URLs viejas de `vercel.json` (`/servicios`, `/blog`, `/privacidad`… con y sin `.html`), que en Vercel daban 404, ahora van en un 301 a su página en kenshovisual.com; `/planes` y `/precios` a la home (los planes están aquí) |
| `_headers` | HSTS como en Vercel; `X-Robots-Tag: noindex` solo en `*.workers.dev` (vista previa) |
| `robots.txt` | Nuevo, permite todo (antes 404; sin él Cloudflare servía un texto genérico) |
| DNS | `CNAME hospitality → kenshovisual.com`, **proxied** (relleno: el tráfico lo coge la ruta del Worker). Antes `CNAME → …vercel-dns-017.com` |
| No publicado | `vercel.json`, `wrangler.jsonc`, `*.md`, `.git*` (`.assetsignore`) |

## Comprobado el 29-10-2026

- Antes del cambio, vista previa (https://kensho-hospitality.kenshovisual.workers.dev) contra Vercel: mismo title,
  description y H1; 27 ficheros enlazados sin 404; capturas escritorio y móvil (Chromium y WebKit, con scroll hasta
  abajo) iguales píxel a píxel; sin errores de consola. GSAP y Lenis siguen saliendo de sus CDN.
- Después, en el dominio: lo mismo, sin `X-Robots-Tag`, `http://` en un salto, certificado válido (`*.kenshovisual.com`).

## Vuelta atrás (si hiciera falta)

Añadir de nuevo `hospitality.kenshovisual.com` al proyecto `kensho-hospitality` en Vercel, borrar la ruta del Worker en
Cloudflare y volver a poner `CNAME hospitality → 2f87fbeb2621fd42.vercel-dns-017.com` en DNS only.
