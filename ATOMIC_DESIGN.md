# Patrón de Diseño Atómico - Estructura del Proyecto

Este proyecto implementa el **Patrón de Diseño Atómico** (Atomic Design) creado por Brad Frost. Esta metodología organiza los componentes de UI en una jerarquía que va desde los elementos más básicos hasta las páginas completas.

## 🏗️ Estructura de Carpetas

```
src/
├── components/
│   ├── atoms/          # Elementos básicos e indivisibles
│   ├── molecules/      # Grupos de átomos funcionando juntos
│   ├── organisms/      # Grupos de moléculas formando secciones
│   └── templates/      # Estructuras de página sin contenido
├── pages/              # Páginas completas con contenido real
├── hooks/              # Custom hooks de React
├── utils/              # Funciones utilitarias
└── types/              # Definiciones de tipos TypeScript
```

## ⚛️ Átomos (Atoms)

Los elementos más básicos de la interfaz. No pueden dividirse más sin perder su funcionalidad.

### Componentes Implementados:
- **Button**: Botón reutilizable con variantes (primary, secondary, danger) y tamaños
- **Input**: Campo de entrada con validación y estados de error

### Características:
- Altamente reutilizables
- Sin dependencias de otros componentes
- Props bien definidas con TypeScript
- Estilos modulares con CSS

## 🧬 Moléculas (Molecules)

Combinaciones de átomos que trabajan juntos como una unidad.

### Componentes Implementados:
- **FormField**: Combina Input + Label + Mensajes de error
- **Card**: Contenedor flexible para mostrar contenido estructurado

### Características:
- Combinan múltiples átomos
- Tienen una función específica
- Reutilizables en diferentes contextos

## 🦠 Organismos (Organisms)

Grupos de moléculas y/o átomos que forman secciones complejas de la interfaz.

### Componentes Implementados:
- **LoginForm**: Formulario completo de inicio de sesión con validación

### Características:
- Funcionalidad completa y específica
- Pueden contener lógica de estado
- Representan secciones distintivas de la UI

## 📄 Templates

Definen la estructura y layout de las páginas sin contenido específico.

### Componentes Implementados:
- **PageLayout**: Layout base con header, sidebar, main content y footer

### Características:
- Definen la estructura de la página
- Reutilizables para múltiples páginas
- Responsive design incluido

## 📱 Pages

Instancias específicas de templates con contenido real.

### Páginas Implementadas:
- **LoginPage**: Página de inicio de sesión completa

### Características:
- Contenido específico y real
- Combinan templates con organismos
- Manejan el estado de la aplicación

## 🚀 Ventajas del Patrón Atómico

1. **Reutilización**: Los componentes se pueden reutilizar en múltiples contextos
2. **Mantenibilidad**: Cambios en átomos se propagan automáticamente
3. **Consistencia**: Design system coherente en toda la aplicación
4. **Escalabilidad**: Fácil agregar nuevos componentes siguiendo la estructura
5. **Testing**: Cada nivel se puede testear independientemente
6. **Documentación**: Estructura clara y autodocumentada

## 🛠️ Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como bundler
- **CSS Modules** para estilos modulares
- **ESLint** para calidad de código

## 📋 Convenciones de Código

### Nomenclatura:
- Componentes: PascalCase (`Button`, `FormField`)
- Archivos: PascalCase para componentes (`Button.tsx`)
- Props: camelCase con interfaces tipadas

### Estructura de Componentes:
```typescript
// 1. Imports
import React from 'react';
import './Component.css';

// 2. Interface de Props
export interface ComponentProps {
  // props definition
}

// 3. Componente
export const Component: React.FC<ComponentProps> = (props) => {
  // component logic
};

// 4. Export default
export default Component;
```

### Exports:
- Cada componente tiene su carpeta con `index.ts` para exports limpios
- Exports nombrados e default disponibles
- Tipos exportados junto con componentes

## 🎯 Próximos Pasos

1. Agregar más átomos (Typography, Icon, Badge)
2. Crear moléculas adicionales (SearchBox, Navigation)
3. Implementar organismos complejos (Header, Footer, DataTable)
4. Agregar templates para diferentes tipos de página
5. Implementar sistema de temas
6. Agregar Storybook para documentación visual
7. Implementar tests unitarios para cada nivel

## 📚 Recursos

- [Atomic Design por Brad Frost](https://atomicdesign.bradfrost.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [CSS Modules](https://github.com/css-modules/css-modules)