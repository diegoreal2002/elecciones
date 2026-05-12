# 🇨🇴 Encuesta Presidencial 2026 - Colombia

Sistema de votación en tiempo real para las elecciones presidenciales colombianas 2026.

## ✨ Características

- **Una sola encuesta**: Enfocada en candidatos presidenciales colombianos
- **Actualizaciones en tiempo real**: Los resultados se actualizan cada 2 segundos
- **Prevención de duplicados**: IP + Device Fingerprint
- **Interfaz moderna**: Diseño responsive con Tailwind CSS
- **Resultados instantáneos**: Porcentajes y conteos en vivo
- **Base de datos SQLite**: Sin dependencias externas

## 🚀 Candidatos Incluidos

1. Fico Gutiérrez
2. Juan Fernando Cristo
3. Sergio Fajardo
4. Marelen Castillo Torres
5. Gustavo Bolívar
6. Rodolfo Hernández
7. Otro candidato
8. No votaría / Voto nulo

## 🛠️ Instalación Rápida

```bash
cd /c/Users/diego/Documents/Tilewars/elecciones

# Inicializar BD con candidatos
npm run seed

# Iniciar servidor
npm run dev
```

Accede a: **http://localhost:3000**

## 📊 Cómo Funciona

1. **Carga de página**: Se genera un fingerprint único del dispositivo
2. **Visualización**: Ves todos los candidatos con sus votos actuales
3. **Votación**: Selecciona un candidato para votar
4. **Confirmación**: Tu voto se registra y se muestra mensaje de éxito
5. **Protección**: El sistema evita que votes dos veces desde el mismo dispositivo

## 🔄 Actualizaciones en Tiempo Real

- Los resultados se actualizan automáticamente cada **2 segundos**
- Los porcentajes se recalculan en vivo
- El total de votos se actualiza constantemente
- No necesitas recargar la página (pero puedes hacerlo)

## 🔌 API Endpoints

```bash
# Ver candidatos y votos actuales
curl http://localhost:3000/api/results/1

# Respuesta:
{
  "results": [
    {"id": 1, "text": "Fico Gutiérrez", "votes": 15},
    {"id": 2, "text": "Juan Fernando Cristo", "votes": 8},
    ...
  ],
  "totalVotes": 150
}
```

## 📦 Tecnologías

- **Next.js 16**: Framework React moderno
- **React 19**: UI interactiva
- **SQLite3**: BD local
- **TypeScript**: Type safety
- **Tailwind CSS**: Estilos responsivos
- **Crypto-JS**: Fingerprinting seguro

## 🗄️ Base de Datos

### Tabla: polls
```
id: Integer (PK)
question: Text - "¿Por quién votarías en las elecciones presidenciales 2026?"
created_at: DateTime
```

### Tabla: options
```
id: Integer (PK)
poll_id: Integer (FK)
text: Text - Nombre del candidato
```

### Tabla: votes
```
id: Integer (PK)
poll_id: Integer (FK)
option_id: Integer (FK)
voter_hash: Text (UNIQUE) - SHA256(IP + DeviceFingerprint)
ip_address: Text
created_at: DateTime
```

## 📱 Prevención de Duplicados

El sistema usa una combinación de:
- **IP Address**: Detecta desde la misma red
- **Device Fingerprint**: Basado en User-Agent + Idioma del navegador
- **Voter Hash**: SHA256(IP + Fingerprint) = ÚNICO

Esto asegura que una misma persona no pueda votar dos veces.

## 🔧 Comandos

```bash
npm run dev          # Desarrollo (hot reload)
npm run build        # Build producción
npm start            # Servidor producción
npm run lint         # Validar código
npm run seed         # Resetear BD con candidatos
```

## 📊 Ejemplo de Uso

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Hacer un voto de prueba
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": 1,
    "optionId": 2,
    "deviceFingerprint": "test-hash-123"
  }'

# Ver resultados actualizados
curl http://localhost:3000/api/results/1
```

## 🌐 Deploy

### Vercel (recomendado)
```bash
npm install -g vercel
vercel deploy
```

### Railway
```bash
vercel install -g @railway/cli
railway link
railway up
```

## 🔒 Seguridad

✅ Los votos son anónimos
✅ Se protege contra duplicados
✅ HTTPS recomendado en producción
✅ Validación en servidor
✅ No se almacenan datos personales

## ⚙️ Resetear Encuesta

```bash
# Eliminar BD
del votes.db

# Reinicializar con candidatos frescos
npm run seed

# Reiniciar servidor
npm run dev
```

## 📝 Notas

- La encuesta está optimizada para una sola pregunta
- Los candidatos pueden editarse en `scripts/seed.ts`
- Los resultados se actualizan cada 2 segundos (configurable en el componente)
- El intervalo de actualización no afecta el performance

---

**¡Sistema listo para votar! 🗳️**
