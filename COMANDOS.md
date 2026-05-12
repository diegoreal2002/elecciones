# 🇨🇴 Comandos - Encuesta Presidencial 2026

## 🚀 Inicio Rápido

### 1. Preparar la aplicación
```bash
cd /c/Users/diego/Documents/Tilewars/elecciones

# Inicializar BD con 8 candidatos presidenciales
npm run seed

# Iniciar servidor en http://localhost:3000
npm run dev
```

### 2. Usar la aplicación
- Abre http://localhost:3000 en tu navegador
- Selecciona un candidato para votar
- Los resultados se actualizan automáticamente cada 2 segundos
- Recarga la página para ver los cambios en vivo

## 📊 API Endpoints

### Obtener resultados
```bash
curl http://localhost:3000/api/results/1
```

### Registrar un voto
```bash
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": 1,
    "optionId": 1,
    "deviceFingerprint": "tu-dispositivo-hash"
  }'
```

## 🔧 Comandos npm

```bash
npm run dev         # Servidor desarrollo (hot reload)
npm run build       # Compilar para producción
npm start           # Servidor producción
npm run lint        # Validar código
npm run seed        # Resetear BD con candidatos
```

## 🗄️ Base de datos

### Resetear BD completamente
```bash
del votes.db        # Eliminar archivo
npm run seed        # Reinicializar
npm run dev         # Reiniciar servidor
```

### Ver datos de BD (usando SQLite CLI)
```bash
# Descargar sqlite3 si no lo tienes
# Luego ejecutar:
sqlite3 votes.db

# En la consola de SQLite:
SELECT * FROM polls;
SELECT * FROM options;
SELECT * FROM votes;
.exit
```

## 🌐 Deployment

### Vercel (recomendado)
```bash
npm install -g vercel
vercel
```

### Build local para producción
```bash
npm run build
npm start
```

## 📋 Candidatos Incluidos

La encuesta contiene 8 opciones:
1. Fico Gutiérrez
2. Juan Fernando Cristo
3. Sergio Fajardo
4. Marelen Castillo Torres
5. Gustavo Bolívar
6. Rodolfo Hernández
7. Otro candidato
8. No votaría / Voto nulo

## 🔄 Características Clave

✅ **Una sola encuesta** - Enfocada en elecciones presidenciales
✅ **Actualizaciones cada 2 segundos** - Resultados en tiempo real
✅ **Prevención de duplicados** - IP + Device Fingerprint
✅ **Responsive** - Funciona en móvil, tablet, desktop
✅ **Porcentajes automáticos** - Se calculan en vivo
✅ **SQLite local** - Sin servidor de BD externo

## 🧪 Pruebas

Ver archivo: **PRUEBA_RAPIDA.md**

Contiene ejemplos con curl para:
- Ver candidatos
- Votar desde terminal
- Probar prevención de duplicados
- Simular múltiples votantes

## 🔐 Seguridad

- Los votos son anónimos
- Se usa SHA256 para el hash del votante
- No se almacenan datos personales
- IP se captura pero no se registra personalmente
- El sistema previene múltiples votos

## 📁 Estructura

```
elecciones/
├── app/
│   ├── api/
│   │   ├── polls/route.ts
│   │   ├── vote/route.ts
│   │   └── results/[id]/route.ts
│   ├── components/
│   │   └── PollComponent.tsx      (UI principal - encuesta única)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── db.ts
│   └── auth.ts
├── scripts/
│   └── seed.ts                     (8 candidatos presidenciales)
├── votes.db                        (BD SQLite)
├── COMANDOS.md                     (este archivo)
├── README_VOTACION.md              (documentación completa)
└── PRUEBA_RAPIDA.md               (pruebas con curl)
```

---

**Listo para votar! 🗳️ Ejecuta: `npm run seed && npm run dev`**
