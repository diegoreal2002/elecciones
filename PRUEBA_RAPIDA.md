# 🧪 Prueba Rápida del Sistema

## 1️⃣ Iniciar el servidor

```bash
cd /c/Users/diego/Documents/Tilewars/elecciones
npm run dev
```

Abre: **http://localhost:3000**

## 2️⃣ Probar votación desde terminal

Abre otra terminal y ejecuta:

### Ver candidatos sin votos
```bash
curl http://localhost:3000/api/results/1 | jq
```

Respuesta esperada:
```json
{
  "results": [
    {"id": 1, "text": "Fico Gutiérrez", "votes": 0},
    {"id": 2, "text": "Juan Fernando Cristo", "votes": 0},
    ...
  ],
  "totalVotes": 0
}
```

### Emitir un voto de prueba
```bash
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": 1,
    "optionId": 1,
    "deviceFingerprint": "test-fingerprint-001"
  }'
```

Respuesta esperada:
```json
{"success": true}
```

### Ver resultados actualizados
```bash
curl http://localhost:3000/api/results/1 | jq
```

Verás que Fico Gutiérrez tiene 1 voto:
```json
{
  "results": [
    {"id": 1, "text": "Fico Gutiérrez", "votes": 1},
    {"id": 2, "text": "Juan Fernando Cristo", "votes": 0},
    ...
  ],
  "totalVotes": 1
}
```

### Intentar votar dos veces (debe fallar)
```bash
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": 1,
    "optionId": 2,
    "deviceFingerprint": "test-fingerprint-001"
  }'
```

Respuesta esperada (error 409):
```json
{"error": "Already voted"}
```

### Simular múltiples votantes
```bash
# Votante 2
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"pollId": 1, "optionId": 2, "deviceFingerprint": "test-fingerprint-002"}'

# Votante 3
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"pollId": 1, "optionId": 3, "deviceFingerprint": "test-fingerprint-003"}'

# Votante 4
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"pollId": 1, "optionId": 1, "deviceFingerprint": "test-fingerprint-004"}'
```

## 3️⃣ Ver cambios en tiempo real

En la página web (http://localhost:3000):
- Los votos aparecerán automáticamente cada 2 segundos
- Las barras de progreso se actualizarán
- El total de votos cambiará

## 4️⃣ Probar en el navegador

1. Abre http://localhost:3000 en múltiples pestañas
2. En cada pestaña:
   - Verás la misma encuesta
   - Puedes votar una sola vez
   - Los resultados se sincronizan entre pestañas (cada 2 segundos)
   - Si intentas votar dos veces desde la misma pestaña, verás error

## 📝 Notas de prueba

✅ El sistema previene duplicados por IP + Device Fingerprint
✅ Cada navegador tiene un fingerprint diferente
✅ Los resultados se actualizan automáticamente
✅ La página muestra mensajes de error claros
✅ El contador total de votos es exacto

---

**Si todo funciona, ¡el sistema está listo para usar! 🎉**
