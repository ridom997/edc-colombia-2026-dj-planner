# Security / Seguridad

## English

Reviewed 9 October 2026. No malicious behavior was identified in the inspected code. This is a limited review, not an antivirus scan or a guarantee of zero vulnerabilities.

The app runs bundled code offline, with no remote JavaScript or npm dependencies. Scriptable, DroidScript, WebView and operating systems are external dependencies not audited here.

Final plans are pasted into a text field. Empty text, malformed JSON, content over 250,000 characters, wrong events and invalid DJ/time identifiers are rejected. JSON is parsed as data, never executed. Validation errors allow correction; cancellation and invalid input preserve the previous plan. Confirmation is required before replacement. Personal choices remain separate.

64 automated security assertions passed. Additional simulated Scriptable and Android dialog tests cover paste, validation, correction, cancellation, confirmation and personal-plan preservation. No physical phones or antivirus engine were used. See docs/security-test-result.txt and tests/paste-import.cjs.

Outgoing links require explicit actions and are limited to Spotify searches and fixed author/event/organizer URLs. No tracking or remote code downloads were identified. Local choices are not encrypted. The source is readable and editable. The internal checksum covers the executable block only; it is not a signature and does not prove authenticity.

Whole-file SHA-256 of DJs_EDC_Colombia_2026.js:

`3aa1e21bdcbd2969e5c2c2dd8eabd7bc03421cd3bdaf9db8df860a44614146d8`

## Español

Revisión del 9 de octubre de 2026. No se identificó comportamiento malicioso. Esta revisión limitada no es un escaneo antivirus ni garantiza ausencia de vulnerabilidades.

El plan final se importa pegando JSON. Se rechazan texto vacío, JSON inválido, más de 250 000 caracteres, eventos incompatibles y DJs u horarios desconocidos. Los errores permiten corregir el texto. Cancelar o introducir datos inválidos conserva el plan anterior; un plan válido requiere confirmación. Las elecciones personales se conservan.

Pasaron 64 comprobaciones de seguridad y pruebas adicionales de los cuadros de importación con APIs simuladas de Scriptable y Android. No se probaron teléfonos físicos. Las plataformas anfitrionas no se auditaron. No hay dependencias npm ni descargas de código remoto en el aplicativo. El almacenamiento no añade cifrado y el JS es editable. La huella no es una firma digital.

Descarga desde el repositorio del autor y compara la huella completa indicada arriba. Revisa los horarios en fuentes oficiales. Exporta un respaldo antes de actualizar.
