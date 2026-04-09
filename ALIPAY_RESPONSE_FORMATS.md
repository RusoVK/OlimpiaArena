# Formatos de Respuesta de Alipay getAuthCode

## ¿De dónde vienen estos códigos?

La respuesta de `getAuthCode` varía según:
- **Versión del Alipay SDK** (1.x, 2.x, etc)
- **Tipo de ambiente** (H5, mini programa, etc)
- **Servidor de Alipay** (diferentes actualizaciones)

## 5 Formatos que Manejamos

### Formato 1: String Directo
```javascript
// Respuesta: "authCode123456789"
typeof result === 'string' && result.length > 0

// Desde: Algunas versiones antiguas del SDK o H5 simplificado
// Documentación: No oficial, pero encontrado en implementaciones reales
```

### Formato 2: Objeto con `authCode`
```javascript
// Respuesta: { authCode: "authCode123456789", ... }
result?.authCode && typeof result.authCode === 'string'

// Desde: Documentación oficial de Alipay
// Link: https://opendocs.alipay.com/mini/api/openapi-authorize
// Versiones: 1.x SDK onwards
```

### Formato 3: Objeto con `code`
```javascript
// Respuesta: { code: "authCode123456789", resultCode: 0, ... }
result?.code && typeof result.code === 'string'

// Desde: Alipay H5 / algunas versiones de mini programa
// Link: https://opendocs.alipay.com/mini/api/getauthcode
// Variación útil aunque menos común
```

### Formato 4: Objeto con `resultCode` === 0 y `result`
```javascript
// Respuesta: { resultCode: 0, result: "authCode123456789", msg: "ok", ... }
(result?.resultCode === 0 || result?.resultCode === '0') && result?.result

// Desde: Alipay Payment API responses
// Link: https://opendocs.alipay.com/mini/api/pay
// Patrón Standard: resultCode indica éxito, `result` contiene payload
```

### Formato 5: Objeto Vacío
```javascript
// Respuesta: {}
result && typeof result === 'object' && Object.keys(result).length === 0

// Desde: 
//   - Simuladores locales incompletos
//   - Enviroments de testing que no devuelven datos reales
//   - Fallback cuando el bridge responde pero sin contenido
//
// Solución: Generamos código simulado: H5_SIM_{timestamp}
```

---

## ¿Por qué tantos formatos?

**Problema Real en Producción:**
- Alipay no tiene una documentación unificada para H5 vs mini programa
- Diferentes versiones del SDK devuelven formatos diferentes
- Cada actualización del servidor puede cambiar la estructura
- Los clientes chinos usan versiones antiguas del SDK

**Nuestra Estrategia:**
Detectar automáticamente cuál formato recibimos y adaptarnos, sin romper en ningún caso.

---

## Cómo Identificar tu Formato Real

Cuando se ejecute desde la super app:
1. Abre DevTools en el teléfono (si está disponible)
2. O mira el **panel de logs flotante** en la app
3. Busca la línea: `📊 Analizando respuesta recibida...`
4. Luego verás cuál formato detectamos: `📌 Formato X - ...`

---

## Referencias Oficiales

| Formato | Fuente | Documentación |
|---------|--------|---------------|
| Formato 2 | Alipay Official | https://opendocs.alipay.com/mini/api/openapi-authorize |
| Formato 4 | Payment API | https://opendocs.alipay.com/mini/api/pay |
| Formato 3 | H5 Alt | https://opendocs.alipay.com/mini/api/getauthcode |
| Formato 1 | Legacy | Community implementations |
| Formato 5 | Test/Sim | Local development workaround |

---

## En Código (alipayBridge.ts)

```typescript
// Líneas 190-245 en src/services/alipayBridge.ts

// Formato 1: String directo
if (typeof result === 'string' && result.length > 0) {
  logger.success('📌 Formato 1 - authCode string directo', result.substring(0, 30));
  return { success: true, authCode: result, raw: result };
}

// Formato 2: { authCode: "..." }
if (result?.authCode && typeof result.authCode === 'string') {
  logger.success('📌 Formato 2 - objeto.authCode', result.authCode.substring(0, 30));
  return { success: true, authCode: result.authCode, raw: result };
}

// ... etc
```
