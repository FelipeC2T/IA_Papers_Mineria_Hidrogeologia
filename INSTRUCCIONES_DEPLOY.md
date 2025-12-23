# 🚀 INSTRUCCIONES PARA DESPLEGAR EN GITHUB PAGES

## Paso 1: Crear el Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** (o el ícono **+** → **New repository**)
3. Configura el repositorio:
   - **Repository name:** `IA_Papers_Mineria`
   - **Description:** "Inteligencia Artificial aplicada a Hidrogeología y Minería - Análisis técnico basado en literatura científica"
   - **Visibility:** Public
   - ⚠️ **NO marques** "Add a README file" (ya tenemos uno)
   - ⚠️ **NO agregues** .gitignore ni license (ya los tenemos)
4. Haz clic en **"Create repository"**

## Paso 2: Subir los Archivos

### Opción A: Usando Git (Línea de Comandos) - RECOMENDADO

Abre PowerShell o Terminal en la carpeta `C:\Users\Felipe\Desktop\IA_Papers_Mineria` y ejecuta:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: IA en Geociencias website"

# Conectar con el repositorio remoto (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/IA_Papers_Mineria.git

# Renombrar rama a main
git branch -M main

# Subir todo a GitHub
git push -u origin main
```

### Opción B: Usando GitHub Desktop (Interfaz Gráfica)

1. Descarga e instala [GitHub Desktop](https://desktop.github.com/)
2. Abre GitHub Desktop y selecciona **File** → **Add Local Repository**
3. Selecciona la carpeta `C:\Users\Felipe\Desktop\IA_Papers_Mineria`
4. GitHub Desktop detectará que no es un repositorio Git y ofrecerá crearlo - acepta
5. Haz clic en **"Publish repository"**
6. Asegúrate que el nombre sea `IA_Papers_Mineria` y que esté marcado como **Public**
7. Haz clic en **"Publish repository"**

### Opción C: Subir Archivos Directamente desde GitHub Web

1. En la página del repositorio recién creado en GitHub
2. Haz clic en **"uploading an existing file"**
3. Arrastra TODOS los archivos de la carpeta `C:\Users\Felipe\Desktop\IA_Papers_Mineria`
   - index.html
   - styles.css
   - script.js
   - Brochure_IA_Geociencias.md
   - Resumen_Ejecutivo.md
   - Guia_Implementacion.md
   - Referencias_Completas.md
   - README.md
   - LICENSE
   - .gitignore
4. Escribe un mensaje de commit: "Initial commit: IA en Geociencias website"
5. Haz clic en **"Commit changes"**

## Paso 3: Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (⚙️ en la barra superior)
2. En el menú lateral izquierdo, busca y haz clic en **Pages**
3. En la sección **"Source"**:
   - **Branch:** Selecciona `main`
   - **Folder:** Selecciona `/root`
4. Haz clic en **"Save"**
5. Espera 1-2 minutos

✅ **Tu sitio estará disponible en:**  
`https://TU-USUARIO.github.io/IA_Papers_Mineria/`

## Paso 4: Verificar Funcionamiento

1. Espera unos minutos después de activar GitHub Pages
2. Visita la URL: `https://TU-USUARIO.github.io/IA_Papers_Mineria/`
3. Verifica que:
   - ✅ El diseño se ve correcto (gradiente azul-púrpura)
   - ✅ Las pestañas funcionan (Hidrogeología, Minería, etc.)
   - ✅ Las animaciones se ejecutan suavemente
   - ✅ El sitio es responsive (prueba en móvil)

## Paso 5: Actualizar README Principal (Opcional)

Si subes con éxito, puedes actualizar el `README.md` para incluir tu URL real:

1. Abre `README.md`
2. Busca esta línea:
   ```markdown
   **🔗 Visita el sitio:** [https://felipec2t.github.io/IA_Papers_Mineria/](https://felipec2t.github.io/IA_Papers_Mineria/)
   ```
3. Reemplázala con tu URL:
   ```markdown
   **🔗 Visita el sitio:** [https://TU-USUARIO.github.io/IA_Papers_Mineria/](https://TU-USUARIO.github.io/IA_Papers_Mineria/)
   ```
4. Guarda y haz commit:
   ```bash
   git add README.md
   git commit -m "Update README with actual GitHub Pages URL"
   git push
   ```

## 📋 Checklist Final

Antes de compartir tu sitio, verifica:

- [ ] Todos los archivos están en el repositorio
- [ ] GitHub Pages está activado
- [ ] El sitio carga correctamente en la URL
- [ ] Las 4 pestañas (Hidrogeología, Minería, Implementación, Referencias) funcionan
- [ ] El diseño se ve profesional y moderno
- [ ] Los enlaces de descarga a los archivos .md funcionan
- [ ] El sitio es responsive (se ve bien en móvil)
- [ ] El scroll progress indicator aparece en la parte superior
- [ ] Las animaciones de hover funcionan en las tarjetas

## 🔧 Solución de Problemas

### Error: "La página muestra código HTML en lugar de la web"
- **Causa:** GitHub Pages no está activado o está configurado incorrectamente
- **Solución:** Ve a Settings → Pages y verifica que Source esté en `main` y carpeta `/root`

### Error: "404 - Page not found"
- **Causa:** GitHub Pages aún está procesando (toma 1-2 minutos)
- **Solución:** Espera 5 minutos y vuelve a intentar

### Error: "Los estilos no cargan (página blanca con solo texto)"
- **Causa:** Los archivos CSS/JS no se subieron correctamente
- **Solución:** Verifica que `styles.css` y `script.js` estén en el repositorio

### Error: "Las pestañas no funcionan"
- **Causa:** El archivo `script.js` no se cargó
- **Solución:** Abre las DevTools del navegador (F12) y verifica errores en la consola

## 🎉 ¡Listo!

Una vez que tu sitio esté en línea, podrás:

- Compartir el link con colegas y stakeholders
- Usarlo como portafolio técnico
- Referenciarlo en presentaciones y propuestas
- Descargarlo en PDF (Ctrl+P → Guardar como PDF)

---

**Nota:** Si tienes problemas o preguntas, abre un Issue en el repositorio o consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages).
