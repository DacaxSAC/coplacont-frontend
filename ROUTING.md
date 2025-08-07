# Sistema de Enrutamiento - CoPlaCont Frontend

## 📋 Descripción

Este documento describe la implementación del sistema de enrutamiento usando **React Router DOM v6** en el proyecto CoPlaCont Frontend.

## 🛣️ Rutas Implementadas

### Rutas Principales

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `HomePage` | Página de inicio con información general y enlaces principales |
| `/auth/login` | `LoginPage` | Página de inicio de sesión |
| `/auth/register` | `RegisterPage` | Página de registro de usuarios |
| `/auth` | Redirección | Redirecciona automáticamente a `/auth/login` |
| `*` | Redirección | Cualquier ruta no encontrada redirecciona a `/` |

## 🏗️ Estructura del Router

```
src/
├── router/
│   ├── AppRouter.tsx    # Configuración principal de rutas
│   └── index.ts         # Exports del router
├── pages/
│   ├── HomePage/        # Página de inicio
│   ├── LoginPage/       # Página de login
│   └── RegisterPage/    # Página de registro
└── App.tsx              # Componente principal que usa AppRouter
```

## 🔧 Configuración Técnica

### Dependencias Instaladas

```json
{
  "dependencies": {
    "react-router-dom": "^6.x.x"
  },
  "devDependencies": {
    "@types/react-router-dom": "^5.x.x"
  }
}
```

### Componente AppRouter

```typescript
// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
```

## 🎯 Características Implementadas

### ✅ Navegación Entre Páginas
- Enlaces de navegación en todas las páginas
- Navegación fluida sin recarga de página
- Breadcrumbs automáticos en la URL

### ✅ Redirecciones Inteligentes
- `/auth` → `/auth/login`
- Rutas no encontradas → `/`
- Manejo de errores 404

### ✅ Estructura Modular
- Router separado del componente principal
- Fácil mantenimiento y escalabilidad
- Exports organizados con archivos index.ts

### ✅ Navegación de Usuario
- Enlaces entre login y registro
- Botón "Volver al inicio" en páginas de auth
- Navegación intuitiva desde la página principal

## 🚀 Cómo Usar

### Agregar Nueva Ruta

1. **Crear la página:**
```typescript
// src/pages/NuevaPagina/NuevaPagina.tsx
export const NuevaPagina: React.FC = () => {
  return <div>Mi nueva página</div>;
};
```

2. **Agregar al router:**
```typescript
// src/router/AppRouter.tsx
<Route path="/nueva-ruta" element={<NuevaPagina />} />
```

3. **Crear enlaces:**
```typescript
// En cualquier componente
import { Link } from 'react-router-dom';

<Link to="/nueva-ruta">Ir a Nueva Página</Link>
```

### Navegación Programática

```typescript
import { useNavigate } from 'react-router-dom';

const MiComponente = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/auth/login');
  };
  
  return <button onClick={handleClick}>Ir a Login</button>;
};
```

## 📱 Responsive y Accesibilidad

- Todas las páginas son completamente responsive
- Enlaces con estados hover y focus
- Navegación accesible por teclado
- Semántica HTML correcta

## 🔮 Próximas Mejoras

- [ ] Rutas protegidas con autenticación
- [ ] Lazy loading de componentes
- [ ] Breadcrumbs dinámicos
- [ ] Transiciones entre páginas
- [ ] Rutas anidadas para dashboard
- [ ] Parámetros de URL dinámicos
- [ ] Query parameters para filtros

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📚 Recursos

- [React Router DOM Documentation](https://reactrouter.com/)
- [React Router DOM v6 Migration Guide](https://reactrouter.com/upgrading/v5)
- [Atomic Design Pattern](./ATOMIC_DESIGN.md)

---

**Nota:** Este sistema de routing está diseñado para ser escalable y mantenible, siguiendo las mejores prácticas de React Router DOM v6 y la arquitectura de componentes atómicos del proyecto.