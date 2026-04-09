# 🎮 OLIMPIA ARENA - Sistema de Identidad Visual

**Retro-Futurismo Cognitivo | Neon-Neuron Aesthetic**

Esta carpeta contiene la configuración completa de la identidad visual de Olimpia Arena, incluyendo colores, tipografía, constantes de diseño y componentes reutilizables.

---

## 📂 Estructura de Archivos

- **`colors.ts`** - Paleta de colores completa (Dark UI + Neón)
- **`typography.ts`** - Definiciones de tipografía (Inter + JetBrains Mono)
- **`constants.ts`** - Constantes de diseño (espacios, bordes, sombras, animaciones)
- **`index.ts`** - Exportación centralizada del tema
- **`useTheme.ts`** - Hook y helpers para usar el tema en componentes React
- **`global.css`** - Estilos CSS globales con animaciones keyframe
- **`README.md`** - Este archivo

---

## 🎨 Paleta de Colores

### Fondos (Dark UI Base)
```ts
COLORS.background.abyss   // #0f172a - Azul Abismo (fondo principal)
COLORS.background.night   // #1e293b - Azul Noche (paneles)
COLORS.background.deep    // #1a202c - Azul Profundo (alternativa)
```

### Neón (Identidad Visual)
```ts
COLORS.neon.cyan   // #00FFFF - Cian Neón (principal)
COLORS.neon.teal   // #00DACA - Teal Aqua (Toka)
```

### Cubo de Rubik
```ts
COLORS.cube.yellow   // #FBBF24
COLORS.cube.red      // #EF4444
COLORS.cube.orange   // #F97316
COLORS.cube.green    // #10B981
COLORS.cube.white    // #F8FAF8
```

### Gamificación
```ts
COLORS.gamification.gold         // #FFD700 - Oro (Rank 1, PB)
COLORS.gamification.alertOrange  // #FF8C00 - Naranja Alerta (+2s)
COLORS.gamification.success      // Verde de éxito
```

---

## 📝 Tipografía

### Inter (UI)
Usado para títulos, etiquetas y descripción general de la interfaz.

```ts
TYPOGRAPHY.heading.h1    // 32px, Bold 800
TYPOGRAPHY.heading.h2    // 28px, Bold 800
TYPOGRAPHY.body.md       // 14px, Medium 500
TYPOGRAPHY.label.md      // 12px, Semibold 600 (UPPERCASE)
```

### JetBrains Mono (Datos)
Usado para cronómetro, tiempos, scrambles y datos técnicos.

```ts
TYPOGRAPHY.mono.lg       // 16px, Bold 600, monospace
TYPOGRAPHY.mono.md       // 14px, Bold 600, monospace
TYPOGRAPHY.timer.main    // 48px, Bold 700 (para cronómetro)
```

---

## 🌊 Constantes de Diseño

### Espacios (Escala 4px)
```ts
DESIGN_CONSTANTS.spacing.xs    // 4px
DESIGN_CONSTANTS.spacing.sm    // 8px
DESIGN_CONSTANTS.spacing.md    // 16px
DESIGN_CONSTANTS.spacing.lg    // 24px
DESIGN_CONSTANTS.spacing.xl    // 32px
```

### Bordes Neón
```ts
DESIGN_CONSTANTS.neoBorders.cyanThin     // 1px rgba(0,255,255,0.8)
DESIGN_CONSTANTS.neoBorders.cyanMedium   // 2px rgba(0,255,255,1)
```

### Sombras y Glows
```ts
DESIGN_CONSTANTS.shadows.glowCyanSmall   // Glow cian sutil
DESIGN_CONSTANTS.shadows.glowCyanLarge   // Glow cian intenso
```

### Transiciones
```ts
DESIGN_CONSTANTS.transitions.fast    // 150ms ease-in-out
DESIGN_CONSTANTS.transitions.smooth  // 250ms ease-in-out
```

---

## ⚙️ Cómo Usar el Tema

### En Componentes React

```tsx
import { useTheme, COLORS, TYPOGRAPHY } from '@/theme';

export function MiComponente() {
  const { colors, design } = useTheme();

  return (
    <div style={{
      backgroundColor: colors.background.night,
      border: design.neoBorders.cyanThin,
      padding: design.spacing.lg,
      borderRadius: design.borderRadius.lg,
    }}>
      <h1 style={TYPOGRAPHY.heading.h1}>Título Principal</h1>
      <p style={TYPOGRAPHY.body.md}>Contenido del componente</p>
    </div>
  );
}
```

### Con CSS Classes

```tsx
<div className="bg-night border-cyan p-lg">
  <h1 className="text-neon-cyan">Título</h1>
  <p className="text-secondary">Descripción</p>
</div>
```

### Con Variables CSS

```css
.my-component {
  background-color: var(--color-bg-night);
  border: var(--border-radius-md);
  padding: var(--spacing-lg);
}
```

---

## 🎯 Componentes Predefinidos

### Botón Primario
```tsx
<button style={OLIMPIA_THEME.components.buttonPrimary}>
  CTA Principal
</button>
```

### Botón Secundario
```tsx
<button style={OLIMPIA_THEME.components.buttonSecondary}>
  Opcción Alternativa
</button>
```

### Panel
```tsx
<div style={OLIMPIA_THEME.components.panel}>
  Contenido en un panel con efecto neón
</div>
```

### Input
```tsx
<input style={OLIMPIA_THEME.components.input} />
```

---

## ✨ Animaciones

### Disponibles en CSS
```css
/* Pulso para cronómetro READY */
<div className="pulse">Pulsing element</div>

/* Destello neón */
<div className="neon-flash">Flash effect</div>

/* Glow variable */
<div className="glow-shift">Shift effect</div>
```

### Definidas en TypeScript
```ts
// En DESIGN_CONSTANTS.animations
pulse        // Parpadeo suave
neonFlash    // Destello intenso de neón
glowShift    // Cambio de glow cyan → teal
xpFill       // Llenado de barra de XP
slideInDown  // Entrada desde arriba
fadeIn       // Desvanecimiento
```

---

## 🛠️ Helpers Útiles

### `getTypographyStyle()`
```tsx
import { getTypographyStyle } from '@/theme';

const titleStyle = getTypographyStyle('h1');
const bodyStyle = getTypographyStyle('body.md');
const timerStyle = getTypographyStyle('timer.main');
```

### `getColorWithOpacity()`
```tsx
import { getColorWithOpacity } from '@/theme';

const cyanSemi = getColorWithOpacity(COLORS.neon.cyan, 0.5);
```

### `getGlowShadow()`
```tsx
import { getGlowShadow } from '@/theme';

const glowStyle = {
  boxShadow: getGlowShadow('cyan', 'medium')
};
```

---

## 📱 Responsivo

Los breakpoints están definidos en `DESIGN_CONSTANTS.breakpoints`:
- `xs`: 320px
- `sm`: 480px
- `md`: 640px
- `lg`: 768px
- `xl`: 1024px
- `xxl`: 1280px

---

## 🚀 Próximos Pasos

1. ✅ Crear pantalla del Mercado de Canje
2. ✅ Implementar Arena interactivo
3. ✅ Dashboard con estadísticas
4. ✅ Rankings y leaderboard

---

## 📖 Referencias

- **Filosofía**: Retro-Futurismo Cognitivo (Neon-Neuron)
- **Inspiración**: Cubos de Rubik + Interfaz digital de vanguardia
- **Objetivo**: Rendimiento cognitivo + Competición + Gamificación

---

**Olimpia Arena | E-Sports Cognitivos | TOKA Mini App**
