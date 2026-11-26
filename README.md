# Sistema de Gestión de Turnos · Gloria S.A. (simulación académica)

Simulación del módulo interno de Recursos Humanos de una empresa industrial de producción continua, tomando como referencia a Gloria S.A. Proyecto académico, sin fines de lucro.

> **Aviso:** todos los datos (trabajadores, turnos, cifras) son ficticios. El nombre y el logo de Gloria S.A. pertenecen a su titular y se usan solo como referencia en este trabajo académico.

## Fase 1 · Presentación del problema

Esta versión **muestra el error original, sin corrección**: el algoritmo prioriza al personal experimentado y le asigna una cantidad excesiva de turnos nocturnos y domingos.

| Grupo | Noches (mes) | Domingos trabajados (de 5) |
|---|---|---|
| Experimentados (E01–E06) | 6 a 8 | 3 a 4 |
| Nuevos (E07–E12) | 1 a 2 | 1 a 2 |

## Funciones

- Panel principal con indicadores y estado del sistema.
- Registro de 12 trabajadores.
- Generación de horarios de noviembre de 2026 (vista mensual y semanal).
- Panel de incidencias con alertas y trabajadores afectados.
- Reporte de RR. HH. con comparación, gráfico de distribución, fecha de generación e impresión.

## Estructura

```
├── index.html
├── css/styles.css
├── js/
│   ├── data.js        # datos ficticios y estado
│   ├── algorithm.js   # algoritmo de asignación (fase 1, con el error)
│   └── ui.js          # vistas, alertas, reporte y gráfico
└── assets/logo-gloria.jpg
```

## Cómo ejecutarlo

No requiere instalación. Abre `index.html` en el navegador.

Para publicarlo: en GitHub, *Settings → Pages*, rama `main`, carpeta raíz.

## Alcance de esta fase

No incluye reglas de rotación equitativa, límites de turnos ni correcciones automáticas. La solución corresponde a la fase siguiente.
