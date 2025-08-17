# 🚀 Guía de Despliegue en Vercel - Dúo Eterno

## 📋 Pre-requisitos

- ✅ Node.js 18+ instalado
- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Repositorio subido a GitHub/GitLab/Bitbucket

## 🛠️ Configuración de Despliegue

### Método 1: Vercel CLI (Recomendado)

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login en Vercel**
   ```bash
   vercel login
   ```

3. **Deploy desde el directorio del proyecto**
   ```bash
   vercel --prod
   ```

### Método 2: Vercel Dashboard

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Conecta tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Vite
4. Configuración automática:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## ⚙️ Configuración Automática

El archivo `vercel.json` incluido configura automáticamente:

### 🔧 Build Settings
- Comando de build optimizado para producción
- Output directory correcto (`dist`)
- Configuración de SPA para React

### 🚄 Performance Optimizations
- **Cache Headers**: Assets estáticos cacheados por 1 año
- **Immutable Assets**: CSS/JS con cache inmutable
- **Image Optimization**: PNG optimizadas automáticamente

### 🔄 Routing Configuration
- **SPA Routing**: Todas las rutas redirigen a `index.html`
- **Asset Serving**: Assets servidos desde `/assets/`

## 🌐 Variables de Entorno (Opcional)

Si necesitas variables de entorno, crea un archivo `.env.production`:

```bash
# .env.production
VITE_APP_TITLE="Dúo Eterno - Producción"
VITE_API_URL="https://api.duo-eterno.com"
```

Y agrega las variables en el dashboard de Vercel:
- Dashboard → Project → Settings → Environment Variables

## 📊 Monitoreo Post-Despliegue

### Analytics Automáticos
- Vercel Web Analytics habilitado automáticamente
- Métricas de Core Web Vitals
- Estadísticas de tráfico en tiempo real

### Performance
- **Lighthouse Score**: Objetivo 95+ en todas las métricas
- **Bundle Size**: ~286KB gzipped (optimizado)
- **Loading Time**: <2s en 3G rápido

## 🚀 URLs de Ejemplo

Después del despliegue tendrás:
- **Producción**: `https://duo-eterno.vercel.app`
- **Preview**: URLs automáticas para cada PR
- **Development**: `http://localhost:5173`

## 🔧 Troubleshooting

### Error: "Build Failed"
```bash
# Verificar build local
npm run build

# Si falla, revisar errores de TypeScript
npm run lint
```

### Error: "Routes not working"
- ✅ `vercel.json` incluye configuración de SPA
- ✅ Todas las rutas redirigen a `index.html`

### Assets no cargan
- ✅ Verificar que `/public/assets/` esté en el repo
- ✅ Paths son relativos (`/assets/` no `./assets/`)

## 📈 Comandos Útiles

```bash
# Build y test local
npm run build && npm run preview

# Deploy de preview
vercel

# Deploy a producción
vercel --prod

# Ver logs de deployment
vercel logs [deployment-url]

# Información del proyecto
vercel ls
```

## 🎯 Optimizaciones Incluidas

### 🖼️ Assets
- Pixel art optimizado para web
- Compresión automática de imágenes
- Lazy loading de sprites

### ⚡ JavaScript
- Tree shaking automático
- Code splitting por rutas
- Bundle optimization con Vite

### 🎨 CSS
- Autoprefixer automático
- Minificación en producción
- Critical CSS inlined

---

**¡Tu Tamagotchi del Vínculo está listo para el mundo! 🌍✨**