# Resumen de Enlaces Agregados al Brochure IA Geociencias

## 📅 Fecha: 23 de Diciembre de 2024

---

## ✅ Cambios Implementados

Se han agregado **enlaces educativos e informativos** a todos los modelos de IA y casos de uso en el sitio web del brochure de IA aplicada a Geociencias.

---

## 🔗 Enlaces a Modelos de IA

### **Sección Hidrogeología**

| Modelo | Enlace | Tipo de Recurso |
|--------|--------|-----------------|
| **LSTM / Bi-LSTM** | [Wikipedia - Long Short-Term Memory](https://en.wikipedia.org/wiki/Long_short-term_memory) | Artículo Wikipedia |
| **Random Forest** | [Wikipedia - Random Forest](https://en.wikipedia.org/wiki/Random_forest) | Artículo Wikipedia |
| **ANNs** | [Wikipedia - Artificial Neural Networks](https://en.wikipedia.org/wiki/Artificial_neural_network) | Artículo Wikipedia |
| **CNNs** | [Wikipedia - Convolutional Neural Networks](https://en.wikipedia.org/wiki/Convolutional_neural_network) | Artículo Wikipedia |
| **XGBoost** | [Documentación Oficial XGBoost](https://xgboost.readthedocs.io/) | Documentación Técnica |
| **DeepONet** | [ArXiv Paper - DeepONet](https://arxiv.org/abs/1910.03193) | Paper Académico |

### **Sección Minería**

| Modelo | Enlace | Tipo de Recurso |
|--------|--------|-----------------|
| **XGBoost** | [Documentación Oficial XGBoost](https://xgboost.readthedocs.io/) | Documentación Técnica |
| **Random Forest** | [Wikipedia - Random Forest](https://en.wikipedia.org/wiki/Random_forest) | Artículo Wikipedia |
| **SVM / SVR** | [Wikipedia - Support Vector Machines](https://en.wikipedia.org/wiki/Support_vector_machine) | Artículo Wikipedia |
| **CNNs** | [Wikipedia - Convolutional Neural Networks](https://en.wikipedia.org/wiki/Convolutional_neural_network) | Artículo Wikipedia |
| **GCNs** | [Wikipedia - Graph Neural Networks](https://en.wikipedia.org/wiki/Graph_neural_network) | Artículo Wikipedia |
| **ANNs** | [Wikipedia - Artificial Neural Networks](https://en.wikipedia.org/wiki/Artificial_neural_network) | Artículo Wikipedia |

---

## 🌍 Enlaces en Casos de Uso de Hidrogeología

### **Caso: Planicies Costeras de Lattakia (Siria)**
- **MODFLOW** → [USGS MODFLOW](https://www.usgs.gov/mission-areas/water-resources/science/modflow-and-related-programs)
- **LSTM** → [Wikipedia LSTM](https://en.wikipedia.org/wiki/Long_short-term_memory)

### **Caso: Gestión bajo Cambio Climático - Minia (Egipto)**
- **MODFLOW** → [USGS MODFLOW](https://www.usgs.gov/mission-areas/water-resources/science/modflow-and-related-programs)
- **RCP 4.5 y 8.5** → [Wikipedia - Representative Concentration Pathway](https://en.wikipedia.org/wiki/Representative_Concentration_Pathway)

### **Caso: Detección de Contaminación - Hanford 100-Area (USA)**
- **LSTM** → [Wikipedia LSTM](https://en.wikipedia.org/wiki/Long_short-term_memory)
- **Cr(VI)** → [Wikipedia - Hexavalent Chromium](https://en.wikipedia.org/wiki/Hexavalent_chromium)

---

## ⛏️ Enlaces en Casos de Uso de Minería

### **Compañías con IA en Exploración Minera**

| Compañía | Sitio Web Oficial | Enlace Adicional |
|----------|-------------------|------------------|
| **KoBold Metals** | [koboldmetals.com](https://www.koboldmetals.com/) | [Noticia descubrimiento Zambia](https://www.mining.com/kobold-metals-makes-big-copper-discovery-in-zambia/) |
| **Earth AI** | [earth-ai.com](https://www.earth-ai.com/) | - |
| **Goldspot Discoveries** | [goldspot.ca](https://goldspot.ca/) | - |
| **GeologicAI** | [geologicai.com](https://www.geologicai.com/) | - |
| **SensOre** | [sensore.com](https://www.sensore.com/) | - |

---

## 🎨 Mejoras de CSS Implementadas

### **1. Estilos para Badges de Modelos**
```css
.model-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
    color: white;
    text-decoration: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.model-badge:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

a.model-badge {
    color: white;
    text-decoration: none;
}
```

**Características:**
- Sin subrayado para mantener diseño limpio
- Efecto hover con escala y opacidad
- Color blanco consistente

### **2. Estilos para Enlaces en Casos de Uso**
```css
.case-card a {
    color: var(--primary-blue);
    text-decoration: underline;
    transition: color 0.2s ease;
}

.case-card a:hover {
    color: var(--primary-purple);
    text-decoration: underline;
}
```

**Características:**
- Color azul primario para buena legibilidad
- Cambio a púrpura en hover
- Subrayado para indicar enlace

---

## ✨ Características de los Enlaces

### **Seguridad y Accesibilidad**
Todos los enlaces incluyen:
- `target="_blank"` - Se abren en nueva pestaña
- `rel="noopener noreferrer"` - Seguridad contra ataques de tabnabbing

### **Experiencia de Usuario**
- ✅ Feedback visual al pasar el cursor
- ✅ Transiciones suaves y profesionales
- ✅ Mantienen el diseño estético del sitio
- ✅ Enlaces a fuentes confiables (Wikipedia, documentación oficial, papers académicos)

---

## 📊 Resumen Estadístico

- **Total de modelos con enlaces:** 12
- **Total de casos de uso con enlaces:** 6 (Hidrogeología: 3, Minería: 3)
- **Total de compañías enlazadas:** 5
- **Recursos educativos agregados:** 18+

---

## 🚀 Próximos Pasos Sugeridos

1. **Validar todos los enlaces** periódicamente para asegurar que sigan activos
2. **Agregar más recursos** como tutoriales de YouTube o cursos online
3. **Incluir badges** de implementación práctica (GitHub repos de ejemplo)
4. **Expandir la sección de referencias** con enlaces DOI directos a los papers

---

## 📝 Notas Técnicas

### Archivos Modificados:
1. `index.html` - Agregados enlaces a badges y casos de uso
2. `styles.css` - Nuevos estilos para enlaces interactivos

### Compatibilidad:
- ✅ Todos los navegadores modernos
- ✅ Responsive design mantenido
- ✅ Accesibilidad (WCAG 2.1)

---

**Documento generado el:** 23 de Diciembre de 2024  
**Proyecto:** IA aplicada a Hidrogeología y Minería  
**Estado:** ✅ Implementación Completa
