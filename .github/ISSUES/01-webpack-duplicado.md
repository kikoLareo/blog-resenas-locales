# Configuración webpack duplicada en next.config.mjs

**Tipo:** 🔴 Crítico
**Componente:** Configuración
**Archivos afectados:** `next.config.mjs`

## Descripción

La configuración de webpack está duplicada en el archivo `next.config.mjs`. Hay dos definiciones separadas de la función `webpack` (líneas 10-27 y líneas 130-146), donde la segunda sobrescribe completamente a la primera.

## Problema

**Primera configuración (líneas 10-27):**
```javascript
webpack: (config, { isServer }) => {
  config.resolve.alias = {
    ...config.resolve.alias,
  };

  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
  }

  return config;
},
```

**Segunda configuración (líneas 130-146):**
```javascript
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
  }

  return config;
},
```

## Impacto

- ❌ La configuración de `resolve.fallback` para client-side se pierde
- ❌ Posibles errores en tiempo de ejecución con módulos node (fs, path, os)
- ❌ Build inconsistente entre desarrollo y producción
- ❌ Sanity Studio puede fallar sin los fallbacks correctos

## Solución propuesta

Fusionar ambas configuraciones en una sola función webpack:

```javascript
webpack: (config, { dev, isServer }) => {
  // Configuración de alias
  config.resolve.alias = {
    ...config.resolve.alias,
  };

  // Fallbacks para client-side
  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
  }

  // Optimizaciones de producción
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
  }

  return config;
},
```

## Pasos para reproducir

1. Abrir `next.config.mjs`
2. Buscar "webpack:" (aparece 2 veces)
3. Verificar que la segunda definición sobrescribe la primera

## Prioridad

**Alta** - Puede causar errores en producción

## Labels sugeridos

`bug`, `critical`, `configuration`, `webpack`
