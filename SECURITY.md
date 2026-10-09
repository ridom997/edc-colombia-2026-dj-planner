# Security review / Revisión de seguridad

Reviewed on **9 October 2026**. English first; español después.

## English — conclusion and scope

**No malicious behavior was identified in the inspected source. This is a limited source review, not a security certification, antivirus result or guarantee that no vulnerability exists.**

Reviewed artifact: `DJs_EDC_Colombia_2026.js` and the matching `src/` files in this package. Whole-file SHA-256:

`c4260e495d437d1176e77cf6c895e96adee48c4553dd68675e7cc441837910ad`

The review covered JSON import, native bridge messages, local persistence, navigation, external links, DOM rendering, integrity checks and the dependency inventory. Documentation assets are local PNGs and Markdown. This package contains no host-app installer or executable binary.

### Changes made during review

| Finding | Assessment | Change |
|---|---|---|
| Unknown, nonfinite or negative import file size could pass the pre-read check | Resource-exhaustion risk; no exploit established | Reject nonfinite, nonpositive and oversized sizes before reading; retain the post-read length check |
| Android console bridge encoded a message before its size was checked | Avoidable processing of oversized input | Check length and handler availability before encoding and dispatch |
| Routine personal saves also rewrote the final profile | Unnecessary write authority and accidental-overwrite risk | Personal saves now write only personal choices and settings; final import remains a separate confirmed operation |
| Inherited object keys were not explicitly separated from atom IDs | Defensive validation improvement; no prototype-pollution exploit demonstrated | Use a null-prototype atom lookup; reject unknown keys in tests |
| Malformed bridge/import object shape and revision acknowledgment | Inconsistent failure handling | Validate object shape; acknowledge only safe-integer revisions |

Zoom settings are restricted to 50–160% in fixed increments. Four additional checks verify allowed values and rejection of out-of-range settings.

### New per-hour exclusions

Per-hour skip data is validated against known time ranges and DJ IDs. Additional tests cover pausing/resuming, preserving earlier selections, and rejecting malformed or conflicting exclusions. Exports contain the resulting selected ranges; skipped ranges are not reintroduced on final-plan import.

### Evidence

- `node --check DJs_EDC_Colombia_2026.js` passed.
- `node tests/security.cjs` passed **67 assertions**, including bad/null/array objects, unknown and inherited keys, duplicate/invalid IDs, invalid sizes rejected before read, import preservation, unauthorized navigation rejection, known link allowlist, personal/final isolation, SHA-256 reference vectors and changed-code detection.
- Additional development tests used Chromium with simulated Scriptable and DroidScript APIs: saving/reopening, disk-write failure and retry, JSON exchange, malformed/oversized imports, backup recovery, continuing selections, sticky hour navigation and timeline content geometry. These are **not physical-device tests**. The development browser harness is not a runtime dependency and is not bundled here.
- Scriptable/Android simulated planner runs observed **zero background WebView network requests**. This says nothing about traffic produced independently by the host app or OS.
- Review of application modules found no `eval`, `new Function`, `fetch`, `XMLHttpRequest`, shell execution, remote imports or assignment of untrusted data to `innerHTML`. Text is rendered through `textContent`; embedded JSON escapes `<`. This inspection is not a malware signature scan.
- No secrets or credentials were identified in the inspected application source. The export contains schedule identifiers and DJ choices, not credentials or contact lists.
- No third-party npm dependencies, remote JavaScript/CDN assets or downloaded code are used by the runtime. Consequently an npm dependency vulnerability scan is **not applicable to the shipped JS**, not “passed with zero CVEs.”

### Controls and boundaries

- JSON must match the schedule and known set/interval IDs. Files are capped at 250 KB as reported by the host API and 250,000 characters after reading. Unknown extra properties are not executed and are not copied into persisted choices.
- Imported data is parsed as JSON, never evaluated. The user confirms replacing a final plan.
- WebView content uses a restrictive CSP (`default-src 'none'`, `connect-src 'none'`, no external assets). Inline scripts/styles remain enabled because the UI is bundled in one file; this is a defense-in-depth limitation, not a strict nonce/hash CSP.
- Android uses `NoApp`, `NoLocate` and `NoCapture`. Native bridge messages are still a privileged interface and must remain restricted if new features are added.
- Host JavaScript evaluation APIs are used only for the fixed acknowledgment callback with JSON-encoded arguments, not to run imported JSON.
- Explicit user actions may open Spotify artist searches or fixed links to GitHub, the EDC Colombia website and the Instagram profiles of the author, EDC Colombia, Páramo Presenta and Insomniac. Sharing invokes the OS chooser; it does not silently send a file.
- State is stored locally in two verified alternating records. The app adds **no encryption**. Anyone with access to the host app's files/backups or an unlocked device may access choices. The JS itself is readable and editable.
- The automatic checksum covers only the executable block. It excludes the guide/header and is not a digital signature. An attacker can alter both code and verifier. Compare a complete-file SHA-256 from a trusted independent publication.

### Not tested / residual risks

No ClamAV/clamd, Semgrep or other antivirus/SAST engine was available in this environment. **No antivirus scan was performed.** The code was not uploaded to a public scanning service. No third-party host binaries, plugins, installed OS/WebView versions or vendor CVEs were audited. Exact installed device versions are unknown. There was no physical iPhone/Android test, penetration test, exhaustive fuzzing or independent external audit.

Storage errors, device shutdown during a save, host differences, modified source, inaccurate clocks and schedule-data errors remain possible. A compromised host or device is outside this app's trust boundary. Keep the host app/OS updated through their official channels and test offline saving on your actual devices.

### Optional Windows antivirus check before publishing

With Microsoft Defender enabled, run PowerShell from the project directory:

```powershell
Update-MpSignature
Start-MpScan -ScanType CustomScan -ScanPath (Join-Path (Get-Location) 'DJs_EDC_Colombia_2026.js')
```

Review the result in Windows Security → Protection history. This scan has **not** been run by this review. No-detection results would still not prove absolute safety.

### Reporting

Report reproducible non-sensitive bugs to the repository owner. If a report contains private data or an exploitable security issue, use GitHub private vulnerability reporting **only if enabled** on the actual repository. Otherwise ask the maintainer for a private contact before posting details publicly. No response-time commitment is implied.

## Español — conclusión y alcance

**No se identificó comportamiento malicioso en el código inspeccionado. Es una revisión limitada, no una certificación, un resultado antivirus ni una garantía de ausencia de vulnerabilidades.** La huella del archivo revisado figura arriba.

Se revisaron importación JSON, mensajes entre interfaz y funciones nativas, guardado, enlaces, renderizado, integridad y dependencias. Se reforzaron cinco puntos: tamaños inválidos antes de leer, límite previo de mensajes Android, separación del guardado personal y final, claves heredadas del diccionario e identificación de objetos/revisiones inválidos. No se afirma que existiera una explotación demostrada.

Se aprobaron **67 comprobaciones reproducibles** mediante `node tests/security.cjs`, más pruebas de desarrollo con Chromium y APIs nativas simuladas. Estas últimas comprobaron guardado, reapertura, recuperación ante fallos, intercambio JSON y funcionamiento de interfaz. No equivalen a pruebas en teléfonos reales. En los WebView simulados no se observaron solicitudes de red en segundo plano; no se examinó el tráfico independiente de las aplicaciones anfitrionas.

No se encontraron `eval`, ejecución de comandos del sistema, descargas de código ni inserción de datos importados como HTML. El JSON se valida como datos. Los enlaces salientes del aplicativo requieren acciones explícitas y se limitan a búsquedas en Spotify y enlaces fijos de GitHub, la web de EDC Colombia y los perfiles de Instagram del autor, EDC Colombia, Páramo Presenta e Insomniac. Compartir abre el selector del sistema, sin enviar automáticamente.

No se incluyen paquetes npm ni librerías remotas. Un análisis de dependencias npm no aplica al JS distribuido; no se presenta como “cero CVE”. Scriptable, DroidScript, el sistema operativo y WebView son dependencias externas no auditadas. Se desconocen las versiones instaladas en los teléfonos.

**No había antivirus ni un motor SAST instalado; no se ejecutó un escaneo antivirus ni se subió el código a servicios públicos de análisis.** Tampoco hubo pruebas físicas, pentest, fuzzing exhaustivo ni auditoría independiente. Puedes realizar el análisis opcional de Microsoft Defender mostrado arriba y revisar su historial de protección. No detectar amenazas tampoco certifica seguridad absoluta.

Los archivos locales no tienen cifrado añadido por la app. El dispositivo, la aplicación anfitriona y sus respaldos deben protegerse. La huella interna comprueba solo el bloque de código y se puede modificar junto con el verificador; no es una firma. Compara la huella completa publicada por una fuente confiable.

Pueden ocurrir fallos de guardado, cierres inesperados, diferencias entre anfitriones y errores de horarios o reloj. Actualiza anfitrión y sistema por canales oficiales y prueba el modo avión en ambos teléfonos. Para reportar una vulnerabilidad, usa el canal privado de GitHub solo si el propietario lo habilita; no publiques datos privados ni detalles sensibles sin acordar un canal adecuado.

## Primary references / Fuentes primarias

- [OWASP — Input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [DroidScript — WebView API](https://droidscript.github.io/Docs/docs/latest/app/CreateWebView.htm)
- [Scriptable documentation](https://docs.scriptable.app/)
- [Microsoft — Start-MpScan](https://learn.microsoft.com/en-us/powershell/module/defender/start-mpscan)
