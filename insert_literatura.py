# Script para insertar sección de literatura en index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

with open('literatura_section.html', 'r', encoding='utf-8') as f:
    lit_section = f.read()

# Buscar donde insertar
marker = '<div class="tab-content" id="implementacion">'
parts = index.split(marker, 1)

if len(parts) == 2:
    # Insertar la nueva sección
    new_content = parts[0] + lit_section + '\n\n        ' + marker + parts[1]
    
    # Guardar
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print('✅ Sección de Literatura insertada exitosamente en index.html')
    print(f'Tamaño anterior: {len(index)} bytes')
    print(f'Tamaño nuevo: {len(new_content)} bytes')
else:
    print('❌ No se encontró el marcador de implementación')
