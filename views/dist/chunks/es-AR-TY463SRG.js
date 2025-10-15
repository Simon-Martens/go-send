// locales/es-AR.ftl
var es_AR_default = `title = Go Send
importingFile = Importando\u2026
encryptingFile = Cifrando\u2026
decryptingFile = Descifrando\u2026
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
sendYourFilesLink = Prob\xE1 Send
errorPageHeader = \xA1Algo fall\xF3!
fileTooBig = El archivo es demasiado grande para subir. Deber\xEDa tener menos de { $size }.
linkExpiredAlt = Enlace explirado
notSupportedHeader = El navegador no est\xE1 soportado.
notSupportedLink = \xBFPor qu\xE9 mi navegador no est\xE1 soportado?
notSupportedOutdatedDetail = Desafortunadamente esta versi\xF3n de Firefox no soporta la tecnolog\xEDa web que necesita Send. Necesit\xE1s actualizar el navegador.
updateFirefox = Actualizar Firefox
deletePopupCancel = Cancelar
deleteButtonHover = Borrar
passwordTryAgain = Contrase\xF1a incorrecta. Intent\xE1 nuevamente.
javascriptRequired = Send requiere JavaScript
whyJavascript = \xBFPor qu\xE9 Send requiere Java Script?
enableJavascript = Por favor habilite JavaScript y pruebe de nuevo.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = h { $hours } m { $minutes }
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = m { $minutes }
# A short status message shown when the user enters a long password
maxPasswordLength = Longitud m\xE1xima de la contrase\xF1a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = No se pudo establecer la contrase\xF1a

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Intercambio de archivos sencillo y privado
introDescription = { -send-brand } le permite compartir archivos con cifrado de extremo a extremo y un enlace que caduca autom\xE1ticamente. As\xED puede mantener privado lo que comparte y asegurarse de que sus cosas no permanezcan en l\xEDnea para siempre.
notifyUploadEncryptDone = Su archivo est\xE1 cifrado y listo para enviar
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Vence despu\xE9s de { $downloadCount } o { $timespan }
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
        [one] 1 file
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
copyLinkDescription = Copiar el enlace para compartir su archivo:
copyLinkButton = Copiar enlace
downloadTitle = Descargar archivos
downloadDescription = Este archivo se comparti\xF3 a trav\xE9s de { -send-brand } con cifrado de extremo a extremo y un enlace que caduca autom\xE1ticamente.
trySendDescription = Pruebe { -send-brand } para compartir archivos de forma sencilla y segura.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Solo se puede subir 1 archivo a la vez.
       *[other] Solo se pueden subir archivos { $count } a la vez.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Solo se permite 1 archivo.
       *[other] Solo se permiten { $count } archivos.
    }
expiredTitle = Este enlace caduc\xF3.
notSupportedDescription = { -send-brand } no funcionar\xE1 con este navegador. { -send-short-brand } funciona mejor con la \xFAltima versi\xF3n de { -firefox }, y funcionar\xE1 con la versi\xF3n actual de la mayor\xEDa de los navegadores.
downloadFirefox = Descargue { -firefox }
legalTitle = Aviso de privacidad de { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0, con fecha 12 de marzo de 2019.
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Seleccionar archivos para subir
uploadButton = Subir
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arrastrar y soltar archivos
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o haga clic para enviar hasta { $size }
addPassword = Proteger con contrase\xF1a
emailPlaceholder = Ingrese su correo electr\xF3nico
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Inicie sesi\xF3n para enviar hasta { $size }
signInOnlyButton = Iniciar sesi\xF3n
accountBenefitTitle = Cree una cuenta de { -firefox } o inicie la sesi\xF3n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Compartir archivos hasta { $size }
accountBenefitDownloadCount = Compartir archivos con m\xE1s personas
accountBenefitTimeLimit =
    { $count ->
        [one] Mantenga los enlaces activos hasta por 1 d\xEDa
       *[other] Mantenga los enlaces activos hasta por { $count } d\xEDas
    }
accountBenefitSync = Administre archivos compartidos desde cualquier dispositivo.
accountBenefitMoz = Conocer sobre otros servicios de { -mozilla }
signOut = Salir
okButton = Aceptar
downloadingTitle = Descargando
noStreamsWarning = Es posible que este navegador no pueda descifrar un archivo tan grande.
noStreamsOptionCopy = Copiar el enlace para abrir en otro navegador.
noStreamsOptionFirefox = Pruebe nuestro navegador favorito
noStreamsOptionDownload = Continuar con este navegador
downloadFirefoxPromo = El nuevo { -firefox } te ofrece { -send-short-brand }.
# the next line after the colon contains a file name
shareLinkDescription = Compartir el enlace con tu dispositivo:
shareLinkButton = Compartir el enlace
# $name is the name of the file
shareMessage = Descargar "{ $name }" con { -send-brand }: compartir archivos de forma simple y segura
trailheadPromo = Hay una forma de proteger tu privacidad. Unite a Firefox.
learnMore = Conocer m\xE1s.
`;
export {
  es_AR_default as default
};
//# sourceMappingURL=es-AR-TY463SRG.js.map
