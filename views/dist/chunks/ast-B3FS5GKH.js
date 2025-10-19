import "./chunk-IFG75HHC.js";

// locales/ast.ftl
var ast_default = `title = Go Send
importingFile = Importando...
encryptingFile = Cifrando...
decryptingFile = Descifrando...
downloadCount =
    { $num ->
        [one] 1 descarga
       *[other] { $num } descargues
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } hores
    }
copiedUrl = \xA1Copi\xF3se!
unlockInputPlaceholder = Contrase\xF1a
unlockButtonLabel = Desbloquiar
downloadButtonLabel = Baxar
downloadFinish = Complet\xF3se la descarga
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Probar Send
errorPageHeader = \xA1Asocedi\xF3 daqu\xE9 malo!
fileTooBig = Esti ficheru ye mui grande como pa xubilu. Deber\xEDa tener menos de { $size }.
linkExpiredAlt = Caduc\xF3 l'enllaz
notSupportedHeader = El to restolador nun ta sofit\xE1u.
notSupportedLink = \xBFPor qu\xE9'l mio restolador nun ta sofit\xE1u?
notSupportedOutdatedDetail = Desafortunadamente esta versi\xF3n de Firefox nun sofita la teunolox\xEDa web qu'usa Send. Vas precisar anovar el restolador.
updateFirefox = Anovar Firefox
deletePopupCancel = Encaboxar
deleteButtonHover = Desaniciar
passwordTryAgain = La contrase\xF1a ye incorreuta. Volvi tentalo.
javascriptRequired = Send rique JavaScript
whyJavascript = \xBFPor qu\xE9 Send rique JavaScript?
enableJavascript = Activa JavaScript y volvi tentalo, por favor.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Llargor m\xE1ximu de la contrase\xF1a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Nun pudo afitase esta contrase\xF1a

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Compartici\xF3n de ficheros privada y cenciella
introDescription = { -send-brand } d\xE9xate compartir ficheros con cifr\xE1u puntu a puntu y un enllaz que caduca autom\xE1ticamente. D'esti mou, aseg\xFAreste de que lo que compartes ye privao y nun va tar siempres en llinia.
notifyUploadEncryptDone = El ficheru ta cifr\xE1u y prepar\xE1u pa unviase
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Caduca dempu\xE9s de { $downloadCount } \xF3 { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minutu
       *[other] { $num } minutos
    }
timespanDays =
    { $num ->
        [one] 1 d\xEDa
       *[other] { $num } d\xEDes
    }
timespanWeeks =
    { $num ->
        [one] 1 selmana
       *[other] { $num } selmanes
    }
fileCount =
    { $num ->
        [one] 1 ficheru
       *[other] { $num } ficheros
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
totalSize = Tama\xF1u total: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copia l'enllaz pa compartir el ficheru:
copyLinkButton = Copiar l'enllaz
downloadTitle = Descarga de ficheros
downloadDescription = Esti ficheru comparti\xF3se per { -send-brand } con cifr\xE1u puntu a puntu y un enllaz que caduca autom\xE1ticamente.
trySendDescription = Prueba { -send-brand } pa una compartici\xF3n de ficheros cenciella y segura.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Nam\xE1i pue xubise 1 ficheru al empar.
       *[other] Nam\xE1i puen xubise { $count } ficheros al empar.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Nam\xE1i se permite 1 archivu
       *[other] Nam\xE1i se permiten { $count } archivos
    }
expiredTitle = Esti enllaz caduc\xF3.
notSupportedDescription = { -send-brand } nun va funcionar con esti restolador. { -send-short-brand } funciona meyor cola \xFAltima versi\xF3n de { -firefox } y l'actual de la mayor\xEDa de restoladores.
downloadFirefox = Baxar { -firefox }
legalTitle = Avisu de privacid\xE1 de { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0, con data del 12 de marzu de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Esbillar los ficheros a unviar
uploadButton = Xubir
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arrastra y suelta ficheros
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o calca pa unviar hasta { $size }
addPassword = Protexer con una contrase\xF1a
emailPlaceholder = Introduz el to corr\xE9u
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Anicia sesi\xF3n pa unviar hasta { $size }
signInOnlyButton = Aniciar sesi\xF3n
accountBenefitTitle = Creaci\xF3n d'una cuenta de { -firefox } o aniciu de sesi\xF3n nella
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Comparti ficheros d'hasta { $size }
accountBenefitDownloadCount = Comparti ficheros con m\xE1s xente
accountBenefitTimeLimit =
    { $count ->
        [one] Calti\xE9n activos los enllaces demientres 1 d\xEDa
       *[other] Calti\xE9n activos los enllaces demientres { $count } d\xEDes
    }
accountBenefitSync = Xestiona los ficheros compart\xEDos dende cualesquier pres\xE9u
accountBenefitMoz = Deprendi m\xE1s tocante a otros servicios de { -mozilla }
signOut = Zarrar sesi\xF3n
okButton = Aceutar
downloadingTitle = Baxando
noStreamsWarning = Esti restolador quiciabes nun seya a descifrar un ficheru d'esti tama\xF1u.
trailheadPromo = Hai un mou de protexer la to privacid\xE1. X\xFAnite a Firefox.
learnMore = Deprender m\xE1s.
`;
export {
  ast_default as default
};
//# sourceMappingURL=ast-B3FS5GKH.js.map
