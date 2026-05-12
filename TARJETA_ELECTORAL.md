# ✅ Tarjeta Electoral 2026 - Lista Completa

## 🗳️ 14 Opciones de Votación

### Candidatos (13)
1. **Paloma Valencia – Juan Daniel Oviedo** (PV - JDO)
2. **Iván Cepeda Castro – Aída Quilcué** (ICC - AQ)
3. **Abelardo de la Espriella – José Manuel Restrepo** (AE - JMR)
4. **Roy Barreras – Martha Lucía Zamora** (RB - MLZ)
5. **Sergio Fajardo – Edna Bonilla** (SF - EB)
6. **Claudia López – Leonardo Huerta** (CL - LH)
7. **Sondra McCollins – Leonardo Karam Helo** (SM - LKH)
8. **Mauricio Lizcano – Luis Carlos Reyes** (ML - LCR)
9. **Miguel Uribe Turbay – Luisa Fernanda Villegas** (MUT - LFV)
10. **Clara López Obregón – María Consuelo del Río Mantilla** (CLO - MCRM)
11. **Luis Gilberto Murillo – Luz María Zapata** (LGM - LMZ)
12. **Carlos Caicedo – Omar Nelson Alarcón** (CC - ONA)
13. **Santiago Botero – Carlos Fernando Cuevas** (SB - CFC)

### Voto Especial
14. **VOTO EN BLANCO** (EB)

---

## 🎨 Interfaz de Tarjeta Electoral

**Características:**
- ✅ Grid de 2-4 columnas (responsive)
- ✅ Cada candidato en un recuadro
- ✅ Circulo de color con iniciales
- ✅ Nombre completo de la fórmula
- ✅ Contador de votos
- ✅ Checkmark al votar
- ✅ Diseño estilo tarjeta electoral oficial

**Colores:**
- Cada candidato tiene un color diferente (azul, rojo, verde, amarillo, etc.)
- Voto en blanco: blanco con borde gris oscuro
- Seleccionado: anillo amarillo brillante

---

## 🚀 Instrucciones Finales

### 1. Reinicia el servidor:
```bash
npm run dev
```

### 2. Abre en el navegador:
```
http://localhost:3000
```

### 3. Lo que verás:
- ✅ Tarjeta electoral estilo matriz
- ✅ 14 opciones (13 candidatos + voto en blanco)
- ✅ Initiales de cada candidato en círculos de color
- ✅ Número de votos por opción
- ✅ Actualizaciones cada 2 segundos

### 4. Prueba a votar:
- Haz clic en un candidato
- Verás un checkmark amarillo
- El contador aumentará
- Los resultados se actualizarán automáticamente
- No podrás votar dos veces desde el mismo dispositivo

---

## 📊 Testing

```bash
# Ver todos los candidatos
curl http://localhost:3000/api/polls | jq '.[] | .options'

# Ver resultados
curl http://localhost:3000/api/results/1 | jq

# Votar por un candidato
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"pollId": 1, "optionId": 1, "deviceFingerprint": "test-user-1"}'
```

---

## 🎯 Próximos Pasos (Opcional)

Para mejorar aún más la interfaz, puedes:
1. **Agregar fotos**: Descargar imágenes de los candidatos y reemplazar los círculos
2. **Agregar símbolos**: Incluir los símbolos electorales de cada partido
3. **Modo dark**: Agregar tema oscuro
4. **Compartir resultados**: Permitir descargar/compartir resultados en PDF
5. **Estadísticas**: Gráficos de tendencias en tiempo real

---

**¡Tu tarjeta electoral está lista! 🗳️**
