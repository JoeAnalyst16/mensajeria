# 📦 Panel de Mensajería

Sistema de gestión de documentos y mensajería interna para organizaciones, con control de acceso por roles y funcionalidades de registro, seguimiento y exportación.

## 🚀 Características

- **Sistema de autenticación** con roles diferenciados
- **Gestión de documentos** con prioridades y seguimiento
- **Control de acceso** basado en roles de usuario
- **Exportación de datos** a formato CSV
- **Interfaz responsive** adaptable a móviles y desktop
- **Almacenamiento local** para persistencia de datos

## 👥 Roles de Usuario

### 🚚 Mensajero
- Visualización de listado de documentos asignados
- Consulta de detalles de entrega

### 📋 Oficina de Partes
- Registro de nuevos documentos
- Visualización completa del listado
- Asignación de mensajeros

### 👑 Administrador
- Acceso completo a todas las funciones
- Exportación de registros a CSV
- Gestión de usuarios y documentos

## 🛠️ Tecnologías Utilizadas

- **React 18+** con Hooks
- **Tailwind CSS** para estilos
- **Shadcn/UI** componentes de interfaz
- **SessionStorage** para persistencia local
- **Lucide React** para iconografía

## 📋 Requisitos Previos

- Node.js 16+ 
- npm o yarn
- Navegador moderno con soporte para ES6+

## ⚡ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/panel-mensajeria.git
cd panel-mensajeria
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Instalar dependencias adicionales
```bash
# Shadcn/UI components
npm install @/components/ui/card @/components/ui/button @/components/ui/input @/components/ui/textarea @/components/ui/tabs

# Iconos
npm install lucide-react
```

### 4. Ejecutar la aplicación
```bash
npm start
# o
yarn start
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Guía de Uso

### Primer Acceso
1. **Acceder a la aplicación** en tu navegador
2. **Crear cuenta** haciendo clic en "Registrarme"
3. **Completar datos** (email, contraseña, rol)
4. **Iniciar sesión** con las credenciales creadas

### Registro de Documentos
1. **Navegar** a la pestaña "Registrar" (solo oficina de partes y admin)
2. **Completar formulario**:
   - ID del documento
   - Tipo (Legal, General, etc.)
   - Prioridad (Alta, Media, Baja)
   - Destino o acción
   - Mensajero asignado
   - Fecha y hora
   - Observaciones
3. **Guardar** el registro

### Consulta y Exportación
1. **Ver listado** en la pestaña correspondiente
2. **Filtrar** por prioridad (colores diferenciados)
3. **Exportar CSV** (solo administradores)

## 📊 Estructura de Datos

### Usuario
```javascript
{
  uid: "string",
  email: "user@example.com",
  rol: "mensajero" | "oficina_partes" | "admin"
}
```

### Documento/Registro
```javascript
{
  id: "string",
  tipo: "string",
  prioridad: "Alta" | "Media" | "Baja",
  destino: "string",
  mensajero: "string",
  fecha: "YYYY-MM-DD",
  hora: "HH:MM",
  observaciones: "string",
  timestamp: "ISO_DATE_STRING"
}
```

## 🎨 Personalización

### Colores del Tema
```css
/* Colores principales */
--color-primary: #22c55e      /* Verde */
--color-background: #0f172a   /* Azul oscuro */
--color-secondary: #1e293b    /* Gris azulado */

/* Prioridades */
--color-high: #ef4444         /* Rojo - Alta */
--color-medium: #eab308       /* Amarillo - Media */
--color-low: #22c55e          /* Verde - Baja */
```

### Agregar Nuevos Campos
1. **Actualizar estado del formulario**:
```javascript
const [form, setForm] = useState({
  // ... campos existentes
  nuevoCampo: ""
});
```

2. **Agregar input en el JSX**:
```jsx
<Input 
  name="nuevoCampo" 
  placeholder="Nuevo Campo" 
  value={form.nuevoCampo} 
  onChange={handleChange}
/>
```

3. **Incluir en exportación CSV**:
```javascript
const encabezados = "ID,Tipo,...,NuevoCampo\n";
```

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear archivo `.env.local`:
```env
REACT_APP_VERSION=1.0.0
REACT_APP_COMPANY_NAME=Tu Empresa
REACT_APP_EXPORT_LIMIT=1000
```

### Límites y Validaciones
```javascript
// En MensajeriaPanel.jsx
const LIMITS = {
  maxRecords: 1000,
  maxFileSize: '5MB',
  allowedRoles: ['mensajero', 'oficina_partes', 'admin']
};
```

## 📱 Responsive Design

La aplicación se adapta automáticamente a:
- **Desktop**: Grid completo con múltiples columnas
- **Tablet**: Grid adaptativo 2-3 columnas
- **Mobile**: Layout vertical de una columna

## 🔐 Seguridad

### Características Implementadas
- ✅ Control de acceso por roles
- ✅ Validación de formularios
- ✅ Escape de caracteres en CSV
- ✅ Sanitización de inputs
- ✅ Sesiones temporales (sessionStorage)

### Recomendaciones para Producción
- Implementar autenticación JWT
- Usar HTTPS en todas las comunicaciones
- Validación server-side
- Rate limiting para APIs
- Logging de actividades

## 🐛 Solución de Problemas

### Error: "Component not found"
```bash
# Reinstalar dependencias de UI
npm install @/components/ui/*
```

### Error: "SessionStorage not available"
- Verificar que el navegador soporte sessionStorage
- Revisar configuración de privacidad del navegador

### Performance: App lenta con muchos registros
```javascript
// Implementar paginación
const ITEMS_PER_PAGE = 50;
const [currentPage, setCurrentPage] = useState(1);
```

## 📈 Roadmap

### Versión 2.0
- [ ] Integración con base de datos real
- [ ] Notificaciones push
- [ ] Historial de cambios
- [ ] Búsqueda avanzada
- [ ] Informes y gráficos

### Versión 2.1
- [ ] API REST completa
- [ ] Aplicación móvil nativa
- [ ] Sincronización offline
- [ ] Multi-tenancy

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crear rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir Pull Request**

### Estándares de Código
- Usar ESLint y Prettier
- Comentarios en español
- Tests unitarios para nuevas funciones
- Documentación actualizada

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Reconocimientos

- [Shadcn/UI](https://ui.shadcn.com/) por los componentes de interfaz
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Lucide](https://lucide.dev/) por los iconos
- [React](https://reactjs.org/) por el framework

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. **Revisar** la sección de [Issues](https://github.com/tu-usuario/panel-mensajeria/issues)
2. **Crear** un nuevo issue si no existe
3. **Contactar** directamente al autor

---

⭐ **Si este proyecto te fue útil, no olvides darle una estrella en GitHub!**
