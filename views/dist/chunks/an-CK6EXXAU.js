// locales/an.ftl
var an_default = `title = Go Send
importingFile = Se ye importando\u2026
encryptingFile = Se ye cifrando\u2026
decryptingFile = Se ye descifrando\u2026
downloadCount =
    { $num ->
        [one] 1 descarga
       *[other] { $num } descargas
    }
timespanHours =
    { $num ->
        [one] hora
       *[other] { $num } horas
    }
copiedUrl = Copiau!
unlockInputPlaceholder = Clau
unlockButtonLabel = Desblocar
downloadButtonLabel = Descargar
downloadFinish = Descarga completa
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Preba Send
errorPageHeader = I ha habiu bell problema!
fileTooBig = Ixe fichero ye masiau gran pa cargar-lo. Ha de tener menos de { $size }
linkExpiredAlt = Lo vinclo ye caducau
notSupportedHeader = Lo suyo navegador no ye compatible
notSupportedLink = Per qu\xE9 no ye compatible lo m\xEDo navegador?
notSupportedOutdatedDetail = Esta versi\xF3n de Firefox no admite la tecnoloch\xEDa web con que funciona lo Send. Habr\xE1s d'esviellar lo navegador.
updateFirefox = Esviellar Firefox
deletePopupCancel = Cancelar
deleteButtonHover = Borrar
passwordTryAgain = La contrasenya ye incorrecta. Torne-lo a intentar.
javascriptRequired = Send necesita JavaScript
whyJavascript = Per qu\xE9 Send necesita JavaScript?
enableJavascript = Activa JavaScript y torna-lo a intentar.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } h { $minutes } min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } min
# A short status message shown when the user enters a long password
maxPasswordLength = Maxima lonchitut d'a clau: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = No s'ha puesto definir la clau

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Compartici\xF3n de fichers simpla y privada
introDescription = { -send-brand } te permite de compartir fichers cifraus de cabo a cabo, y tami\xE9n un vinclo que expira automaticament. Asinas, puetz mantener en privau lo que compartes y asegurar-te de que los tuyos contenius no se quedan pa cutio en linia.
notifyUploadEncryptDone = Lo fichero s'ha cifrau y ye presto pa ninviar-se
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Caduca dimpu\xE9s de { $downloadCount } u { $timespan }
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
        [one] 1 fichero
       *[other] { $num } fichers
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
totalSize = Mida total: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copiar lo vinclo que quiers compartir
copyLinkButton = Copiar lo vinclo
downloadTitle = Descargar los fichers
downloadDescription = Este fichero s'ha compartiu per medio de { -send-brand } con cifrau de cabo a cabo y un vinclo que caduca automaticament.
trySendDescription = Preba { -send-brand } pa una compartici\xF3n de fichers simpla y segura.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Nom\xE1s se puet puyar 1 fitxer de vez.
       *[other] Nom\xE1s se pueden puyar  { $count } fichers de vez.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Nom\xE1s se permite 1 ficher.
       *[other] Nom\xE1s se permiten { $count } fichers.
    }
expiredTitle = Este vinclo ye caducau.
notSupportedDescription = { -send-brand } no funcionar\xE1 con este navegador. { -send-short-brand } funciona millor con a zaguera versi\xF3n de { -firefox } y funcionar\xE1 con a versi\xF3n mas recient d'a mayor parte de navegadors.
downloadFirefox = Descargar { -firefox }
legalTitle = Aviso de privacidat de { -send-short-brand }
legalDateStamp = Versi\xF3 1.0, con data d'o 12 de marzo de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } d { $hours } h { $minutes } min
addFilesButton = Triar los fichers a cargar
uploadButton = Cargar
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arrociega y suelta los fichers
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = u fes clic aqu\xED pa ninviar dica { $size }
addPassword = Protecher con una clau
emailPlaceholder = Escribe la tuya adreza de correu
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Inicia una sesi\xF3n pa ninviar dica { $size }
signInOnlyButton = Iniciar la sesi\xF3n
accountBenefitTitle = Crea una cuenta de { -firefox } u dentra-ie
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Compartir fichers dica { $size }
accountBenefitDownloadCount = Compartir fichers con mas chent
accountBenefitTimeLimit =
    { $count ->
        [one] Mantiene los vinclos activos dica 1 dia
       *[other] Mantiene los vinclos activos dica { $count } d\xEDas
    }
accountBenefitSync = Chestiona los fichers compartius dende qualsequier dispositivo
accountBenefitMoz = Descubre mas cosas sobre los atros servicios de { -mozilla }
signOut = Zarrar la sesi\xF3n
okButton = Vale
downloadingTitle = Se ye descargando
noStreamsWarning = Este navegador talment no pueda descifrar un fichero tant gran.
noStreamsOptionCopy = Copia lo vinclo pa ubrir-lo en belatro navegador
noStreamsOptionFirefox = Preba lo nuestro navegador favorito
noStreamsOptionDownload = Continar con este navegador
downloadFirefoxPromo = Lo nuevo { -firefox } t'ofreix { -send-short-brand }.
# the next line after the colon contains a file name
shareLinkDescription = Comparte lo vinclo enta lo tuyo fichero:
shareLinkButton = Compartir lo vinclo
# $name is the name of the file
shareMessage = Baixa-te \xAB{ $name }\xBB con { -send-brand }: compartici\xF3n de fiches simpla y segura
trailheadPromo = I hai una manera de protecher la tuya privacidat. Une-te a Firefox.
learnMore = Mas informaci\xF3n
`;
export {
  an_default as default
};
//# sourceMappingURL=an-CK6EXXAU.js.map
