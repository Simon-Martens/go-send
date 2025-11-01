import "./chunk-IFG75HHC.js";

// locales/es-ES.ftl
var es_ES_default = `title = Go Send
importingFile = Importando...
encryptingFile = Cifrando...
decryptingFile = Descifrando...
downloadCount =
    { $num ->
        [one] 1 descarga
       *[other] { $num } descargas
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } horas
    }
copiedUrl = \xA1Copiado!
unlockInputPlaceholder = Contrase\xF1a
unlockButtonLabel = Desbloquear
downloadButtonLabel = Descargar
downloadFinish = Descarga completa
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Prueba Send
errorPageHeader = \xA1Se ha producido un error!
fileTooBig = Ese archivo es muy grande. Deber\xEDa ocupar menos de { $size }.
linkExpiredAlt = Enlace caducado
notSupportedHeader = Tu navegador no es compatible.
notSupportedLink = \xBFPor qu\xE9 mi navegador no es compatible?
notSupportedOutdatedDetail = Lamentablemente, esta versi\xF3n de Firefox no admite la tecnolog\xEDa web que impulsa Send. Tendr\xE1s que actualizar tu navegador.
updateFirefox = Actualizar Firefox
deletePopupCancel = Cancelar
deleteButtonHover = Eliminar
passwordTryAgain = Contrase\xF1a incorrecta. Int\xE9ntalo de nuevo.
javascriptRequired = Send requiere JavaScript
whyJavascript = \xBFPor qu\xE9 Send requiere JavaScript?
enableJavascript = Por favor, activa JavaScript y vuelve a intentarlo.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Longitud m\xE1xima de la contrase\xF1a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = No se ha podido establecer la contrase\xF1a

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Enviar
-firefox = Firefox
-mozilla = Mozilla
introTitle = Compartir archivos de forma sencilla y privada
introDescription = { -send-brand } te permite compartir archivos con cifrado de extremo a extremo y un enlace que caduca autom\xE1ticamente. As\xED que puedes mantener lo que compartes en privado y asegurarte de que tus cosas no permanezcan en l\xEDnea para siempre.
notifyUploadEncryptDone = El archivo est\xE1 cifrado y listo para enviar
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Caduca tras { $downloadCount } o { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minuto
       *[other] { $num } minutos
    }
timespanDays =
    { $num ->
        [one] 1 d\xEDa
       *[other] { $num } d\xEDas
    }
timespanWeeks =
    { $num ->
        [one] 1 semana
       *[other] { $num } semanas
    }
fileCount =
    { $num ->
        [one] 1 archivo
       *[other] { $num } archivos
    }
# byte abbreviation
bytes = B
# kibibyte abbreviation
kb = KB
# mebibyte abbreviation
mb = MB
# gibibyte abbreviation
gb = GB
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num }{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Tama\xF1o total: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copiar el enlace para compartir el archivo:
copyLinkButton = Copiar enlace
downloadTitle = Descargar archivos
downloadDescription = Este archivo se comparti\xF3 a trav\xE9s de { -send-brand } con cifrado de extremo a extremo y un enlace que caduca autom\xE1ticamente.
trySendDescription = Prueba { -send-brand } para compartir archivos de forma sencilla y segura.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Solo se puede subir 1 archivo a la vez.
       *[other] Solo se pueden subir { $count } archivos a la vez.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Solo se permite 1 archivo.
       *[other] Solo se permiten { $count } archivos.
    }
expiredTitle = Este enlace ha expirado.
notSupportedDescription = { -send-brand } no funciona con este navegador. { -send-short-brand } funciona mejor con la \xFAltima versi\xF3n de { -firefox }, y funciona con la \xFAltima versi\xF3n de la mayor\xEDa de los navegadores.
downloadFirefox = Descargar { -firefox }
legalTitle = Aviso de privacidad de { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0 del 12 de marzo de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Seleccionar archivos para subir
uploadButton = Subir
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arrastrar y soltar archivos
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o hacer clic para enviar hasta { $size }
addPassword = Proteger con contrase\xF1a
emailPlaceholder = Introducir direcci\xF3n de correo
archiveNameLabel = Nombre del archivo
archiveNameHint = El nombre que ver\xE1n los destinatarios al descargar
archiveNameInvalidChars = El nombre no puede contener: < > : " / \\\\ | ? *
archiveNameInvalidEnd = El nombre no puede terminar con un punto o espacio
archiveNameReserved = Este nombre de archivo est\xE1 reservado por el sistema
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Iniciar sesi\xF3n para enviar hasta { $size }
signInOnlyButton = Iniciar sesi\xF3n
accountBenefitTitle = Crear una cuenta { -firefox } o iniciar sesi\xF3n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Compartir archivos de hasta { $size }
accountBenefitDownloadCount = Compartir archivos con m\xE1s gente
accountBenefitTimeLimit =
    { $count ->
        [one] Mantener enlaces activos durante 1 d\xEDa
       *[other] Mantener enlaces activos durante { $count } d\xEDas
    }
accountBenefitSync = Administrar los archivos compartidos desde cualquier dispositivo
accountBenefitMoz = Saber m\xE1s sobre otros servicios de { -mozilla }
signOut = Cerrar sesi\xF3n
okButton = Vale
downloadingTitle = Descargando
noStreamsWarning = Puede que este navegador no pueda descifrar un archivo tan grande.
noStreamsOptionCopy = Copiar el enlace para abrirlo en otro navegador
noStreamsOptionFirefox = Probar nuestro navegador favorito
noStreamsOptionDownload = Continuar en este navegador
downloadFirefoxPromo = El nuevo { -firefox } te ofrece { -send-short-brand }.
# the next line after the colon contains a file name
shareLinkDescription = Compartir el enlace a tu archivo:
shareLinkButton = Compartir enlace
# $name is the name of the file
shareMessage = Descargar \u201C{ $name }\u201D con { -send-brand }: comparte archivos de forma segura y sencilla
trailheadPromo = Existe la forma de proteger tu privacidad. \xDAnete a Firefox.
learnMore = Saber m\xE1s.

footerLinkCli = CLI
footerLinkDmca = DMCA
footerLinkSource = Source
footerLinkLogin = Sign in
footerLinkLogout = Sign out

## Login strings

loginTitle = Upload Access
loginDescription = Enter your credentials to continue
loginEmailLabel = Email
loginPasswordLabel = Password
loginSubmitButton = Sign in
loginSubmitting = Signing in...
loginErrorChallenge = Could not start login challenge. Please try again.
loginErrorGeneric = Login failed. Please try again.
`;
export {
  es_ES_default as default
};
//# sourceMappingURL=es-ES-XGWIURD2.js.map
