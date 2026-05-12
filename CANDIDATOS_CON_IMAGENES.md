# 📸 Tarjeta Electoral con Imágenes de Candidatos

## ✨ Cambios Principales

### ✅ 14 Candidatos Reales con Imágenes
1. **Iván Cepeda** - Wikimedia
2. *(Espacio vacío en columna 2)*
3. **Claudia López** - Wikimedia
4. **Santiago Botero** - La República
5. **Mauricio Lizcano** - Wikimedia
6. **Abelardo de la Espriella** - La República
7. **Miguel Uribe Londoño** - Centro Democrático
8. **Sondra Macollins Garvin** - Wikimedia
9. **Roy Barreras** - Congreso Visible
10. **Carlos Eduardo Caicedo** - Wikimedia
11. **Gustavo Matamoros** - Google Images
12. **Paloma Valencia** - Wikimedia
13. **Sergio Fajardo** - YouTube
14. **Luis Gilberto Murillo** - Wikimedia
15. **Voto en Blanco** - Google Images

---

## 🎨 Estructura de Grid

### Layout: 4 Columnas
```
Primera Fila:
[Vacío]         [Iván Cepeda]      [Claudia López]    [Santiago Botero]

Segunda Fila:
[Mauricio Liz]  [Abelardo Espr]    [Miguel Uribe]     [Sondra Macollins]

Tercera Fila:
[Roy Barreras]  [Carlos Caicedo]   [Gustavo Matamoros] [Paloma Valencia]

Cuarta Fila:
[Sergio Fajardo] [Luis Murillo]    [Voto en Blanco]   [Vacío]
```

---

## 📸 Imágenes

✅ **Cada candidato tiene foto real**
✅ **Imágenes descargadas de fuentes confiables:**
- Wikimedia Commons (oficial)
- La República (medios colombianos)
- Congreso Visible (transparencia)
- Sitios oficiales de partidos
- YouTube (canales públicos)

✅ **Optimizadas para:**
- Carga rápida
- Visualización en grid
- Responsive design

---

## 🖼️ Componentes de Cada Tarjeta

```
┌─────────────────────┐
│                     │
│   [FOTO GRANDE]     │
│                     │
│   NOMBRE CANDIDATO  │
│        N VOTOS      │
│                     │
└─────────────────────┘
```

- Imagen grande (proporción cuadrada)
- Gradiente overlay para legibilidad de texto
- Nombre del candidato
- Contador de votos
- Checkmark al votar

---

## ⚙️ Cambios Técnicos

### Nuevo archivo: `app/config/candidates.ts`
- Mapeo de candidatos con URLs de imágenes
- En el orden exacto solicitado
- Incluye espacios en blanco

### Actualizado: `next.config.ts`
- Permite imágenes de dominios confiables
- Wikimedia, La República, Google, etc.
- Optimizado para Next.js Image

### Actualizado: `ElectoralBallot.tsx`
- Usa componente `Image` de Next.js
- Grid de 4 columnas real
- Primera fila con primer candidato en columna 2
- Aspectos cuadrados para cada tarjeta
- Imágenes con overlay gradiente

---

## 🚀 Para Ver

### 1. Reinicia el servidor:
```bash
npm run dev
```

### 2. Abre en navegador:
```
http://localhost:3000
```

### 3. Lo que verás:
✅ Grid de 4 columnas
✅ Fotos reales de candidatos
✅ Primera fila: vacío + 3 candidatos
✅ Nombre y votos en cada tarjeta
✅ Checkmark al votar
✅ Actualizaciones en tiempo real

---

## 🎯 Características

✨ **Visual profesional** - Fotos reales
📸 **Diseño moderno** - Grid limpio
⚡ **Rápido** - Next.js Image optimization
🔒 **Seguro** - Imágenes de fuentes confiables
📱 **Responsive** - Grid adaptable
🗳️ **Funcional** - Votación en tiempo real

---

**¡Sistema de votación con fotos reales listo! 📸🗳️**
