import"./chunk.E3IN6YWE.js";var e=`title = Go Send
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
sendYourFilesLink = Probar Send
errorPageHeader = \xA1Algo se fue a las pailas!
fileTooBig = Ese archivo es muy grande para ser subido. Debiera tener un tama\xF1o menor a { $size }.
linkExpiredAlt = Enlace expirado
notSupportedHeader = Tu navegador no est\xE1 soportado.
notSupportedLink = \xBFPor qu\xE9 mi navegador no es soportado?
notSupportedOutdatedDetail = Lamentablemente esta versi\xF3n de Firefox no soporta la tecnolog\xEDa web que potencia a Send. Deber\xE1s actualizar tu navegador.
updateFirefox = Actualizar Firefox
deletePopupCancel = Cancelar
deleteButtonHover = Eliminar
passwordTryAgain = Contrase\xF1a incorrecta. Vuelve a intentarlo.
javascriptRequired = Send requiere JavaScript.
whyJavascript = \xBFPor qu\xE9 Send requiere JavaScript?
enableJavascript = Por favor, activa JavaScript y vuelve a intentarlo.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Longitud m\xE1xima de la contrase\xF1a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Esta contrase\xF1a no pudo ser establecida

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Intercambio de archivos simple y privado
introDescription = { -send-brand } te permite compartir archivos con cifrado de extremo a extremo y un enlace que expira autom\xE1ticamente. As\xED puedes mantener lo que compartes en privado y asegurarte de que tus cosas no permanezcan en l\xEDnea para siempre.
notifyUploadEncryptDone = Tu archivo est\xE1 cifrado y listo para enviar
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expira despu\xE9s de { $downloadCount } o { $timespan }
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
downloadTitle = Bajando archivos
downloadDescription = Este archivo fue compartido a trav\xE9s de { -send-brand } con cifrado de punto a punto y un enlace que expira autom\xE1ticamente.
trySendDescription = Prueba { -send-brand } para compartir archivos de forma simple y segura.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Solo 1 archivo puede ser subido a la vez.
       *[other] Solo { $count } archivos pueden ser subidos a la vez.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Solo 1 archivo est\xE1 permitido.
       *[other] Solo { $count } archivos est\xE1n permitidos.
    }
expiredTitle = Este enlace ha expirado.
notSupportedDescription = { -send-brand } no funcionar\xE1 con este navegador. { -send-short-brand } funciona mejor con la \xFAltima versi\xF3n de { -firefox } y con la versi\xF3n actual de la mayor\xEDa de los navegadores.
downloadFirefox = Bajar { -firefox }
legalTitle = Aviso de privacidad de { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0 del 12 de marzo de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Selecciona los archivos a subir
uploadButton = Subir
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arrastra y suelta archivos
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o haz clic para enviar hasta { $size }
addPassword = Protegido con contrase\xF1a
emailPlaceholder = Ingresa tu correo
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Con\xE9ctate para enviar hasta { $size }
signInOnlyButton = Conectarse
accountBenefitTitle = Crea una cuenta de { -firefox } o con\xE9ctate
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Comparte archivos de hasta { $size }
accountBenefitDownloadCount = Comparte archivos con m\xE1s personas
accountBenefitTimeLimit =
    { $count ->
        [one] Mantener enlaces activos durante 1 d\xEDa
       *[other] Mantener enlaces activos durante { $count } d\xEDas
    }
accountBenefitSync = Administrar los archivos compartidos desde cualquier dispositivo
accountBenefitMoz = Aprender m\xE1s acerca de otros servicios de { -mozilla }
signOut = Salir
okButton = Aceptar
downloadingTitle = Bajando
noStreamsWarning = Es posible que este navegador no pueda descifrar un archivo tan grande.
noStreamsOptionCopy = Copiar el enlace para abrirlo en otro navegador
noStreamsOptionFirefox = Prueba nuestro navegador favorito
noStreamsOptionDownload = Continuar con este navegador
downloadFirefoxPromo = { -send-short-brand } es tra\xEDdo a ti por el renovado { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Comparte el enlace a tu dispositivo:
shareLinkButton = Compartir enlace
# $name is the name of the file
shareMessage = Baja "{ $name }" con { -send-brand }: compartir archivos de forma simple y segura
trailheadPromo = Hay una forma de proteger tu privacidad. \xDAnete a Firefox.
learnMore = Aprender m\xE1s.
`;export{e as default};
