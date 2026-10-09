# Dependency inventory / Inventario de dependencias

English first; español después. This inventory is scoped to the delivered repository, not the developer workstation or installed host binaries.

| Component | Purpose | Shipped? | Review status |
|---|---|---|---|
| Application JS, HTML, CSS and embedded schedule | Offline planner | Yes, source and standalone bundle | Inspected and tested within the scope in SECURITY.md |
| Third-party npm/JavaScript packages | None required by app | No | No lockfile or npm dependency tree to audit |
| Remote scripts, fonts, CDN assets | None | No | No runtime downloads |
| Scriptable | iPhone host and file/WebView APIs | No | External vendor dependency; installed version unknown, not audited |
| DroidScript | Android host and file/WebView APIs | No | External vendor dependency; installed version unknown, not audited |
| iOS WebKit / Android WebView and OS | JS/UI execution and platform security | No | External platform dependencies, not audited |
| Python 3 standard library | Optional build.py | Script only | No pip packages needed for build |
| Node.js standard library | Optional tests/security.cjs | Test only | No npm packages needed for included test |
| PNG tutorial assets | Documentation | Yes | Local static images; not loaded by the app |

Development-only UI checks used Playwright and a Chromium test binary outside this repository. They are not bundled, not installed by build.py and not required to use the app or run the included security assertions. This review does not attest to those tools or their dependency trees. The documentation images were created from simulated UI captures and diagram rendering, not from a phone installation.

## Español

La app incluye código propio y los datos de programación; no incluye dependencias npm, scripts remotos ni CDN. Scriptable/DroidScript, WebView y el sistema operativo son dependencias externas reales: no se conoce ni se auditó la versión instalada en cada dispositivo.

Para construir el proyecto basta Python 3 y su biblioteca estándar. La prueba de seguridad incluida usa Node.js y módulos estándar. No requiere `npm install` ni `pip install`.

Playwright y Chromium se usaron únicamente en comprobaciones de desarrollo externas al paquete. No se distribuyen ni se certifica su cadena de dependencias. Los PNG son documentación estática y no son necesarios para ejecutar la app. “Sin paquetes npm” no significa “sin dependencias de plataforma” ni “sin vulnerabilidades”.
