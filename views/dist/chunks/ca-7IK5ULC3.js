import "./chunk-IFG75HHC.js";

// locales/ca.ftl
var ca_default = `title = Go Send
importingFile = S'est\xE0 important\u2026
encryptingFile = S'est\xE0 xifrant\u2026
decryptingFile = S'est\xE0 desxifrant\u2026
downloadCount =
    { $num ->
        [one] 1 baixada
       *[other] { $num } baixades
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } hores
    }
copiedUrl = Copiat!
unlockInputPlaceholder = Contrasenya
unlockButtonLabel = Desbloca
downloadButtonLabel = Baixa
downloadFinish = Ha acabat la baixada
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Proveu el Send
errorPageHeader = Hi ha hagut un problema
fileTooBig = Aquest fitxer \xE9s massa gros per pujar-lo. Ha de tenir menys de { $size }.
linkExpiredAlt = L'enlla\xE7 ha caducat
notSupportedHeader = El vostre navegador no \xE9s compatible.
notSupportedLink = Per qu\xE8 el meu navegador no \xE9s compatible?
notSupportedOutdatedDetail = Aquesta versi\xF3 del Firefox no admet la tecnologia web amb qu\xE8 funciona el Send. Haureu d'actualitzar el navegador.
updateFirefox = Actualitza el Firefox
deletePopupCancel = Cancel\xB7la
deleteButtonHover = Suprimeix
passwordTryAgain = La contrasenya \xE9s incorrecta. Torneu-ho a provar.
javascriptRequired = El Send necessita JavaScript
whyJavascript = Per qu\xE8 el Send necessita JavaScript?
enableJavascript = Activeu el JavaScript i torneu-ho a provar.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } h { $minutes } min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } min
# A short status message shown when the user enters a long password
maxPasswordLength = Longitud m\xE0xima de la contrasenya: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = No s'ha pogut definir la contrasenya

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Compartici\xF3 de fitxers senzilla i privada
introDescription = El { -send-brand } permet compartir fitxers amb xifratge d'extrem a extrem mitjan\xE7ant un enlla\xE7 que caduca autom\xE0ticament. Per tant, us assegureu que tot all\xF2 que compartiu \xE9s privat i que no es mantindr\xE0 a Internet per sempre.
notifyUploadEncryptDone = El fitxer s'ha xifrat i est\xE0 llest per enviar-se
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Caduca despr\xE9s de { $downloadCount } o { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minut
       *[other] { $num } minuts
    }
timespanDays =
    { $num ->
        [one] 1 dia
       *[other] { $num } dies
    }
timespanWeeks =
    { $num ->
        [one] 1 setmana
       *[other] { $num } setmanes
    }
fileCount =
    { $num ->
        [one] 1 fitxer
       *[other] { $num } fitxers
    }
# byte abbreviation
bytes = B
# kibibyte abbreviation
kb = kB
# mebibyte abbreviation
mb = MB
# gibibyte abbreviation
gb = GB
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num }{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Mida total: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copieu l'enlla\xE7 per compartir el fitxer:
copyLinkButton = Copia l'enlla\xE7
downloadTitle = Baixa els fitxers
downloadDescription = Aquest fitxer s'ha compartit mitjan\xE7ant el { -send-brand } amb xifratge d'extrem a extrem i un enlla\xE7 que caduca autom\xE0ticament.
trySendDescription = Proveu el { -send-brand } per compartir fitxers de forma senzilla i privada.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Nom\xE9s es pot pujar 1 fitxer alhora.
       *[other] Nom\xE9s es poden pujar { $count } fitxers alhora.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Nom\xE9s es permet 1 fitxer.
       *[other] Nom\xE9s es permeten { $count } fitxers.
    }
expiredTitle = Aquest enlla\xE7 ha caducat.
notSupportedDescription = El { -send-brand } no funcionar\xE0 amb aquest navegador. El { -send-short-brand } funciona millor amb l'\xFAltima versi\xF3 del { -firefox } i funcionar\xE0 amb la versi\xF3 m\xE9s recent de la majoria de navegadors.
downloadFirefox = Baixa el { -firefox }
legalTitle = Av\xEDs de privadesa del { -send-short-brand }
legalDateStamp = Versi\xF3 1.0, amb data del 12 de mar\xE7 de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } d { $hours } h { $minutes } min
addFilesButton = Seleccioneu els fitxers que voleu pujar
uploadButton = Puja
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arrossegueu i deixeu anar els fitxers
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o feu clic aqu\xED per enviar fins a { $size }
addPassword = Protegeix amb contrasenya
emailPlaceholder = Introdu\xEFu la vostra adre\xE7a electr\xF2nica
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Inicieu la sessi\xF3 per enviar fins a { $size }
signInOnlyButton = Inicia la sessi\xF3
accountBenefitTitle = Creeu un compte del { -firefox } o inicieu la sessi\xF3
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Compartiu fitxers fins a { $size }
accountBenefitDownloadCount = Compartiu fitxers amb m\xE9s persones
accountBenefitTimeLimit =
    { $count ->
        [one] Manteniu els enlla\xE7os actius fins a 1 dia
       *[other] Manteniu els enlla\xE7os actius fins a { $count } dies
    }
accountBenefitSync = Gestioneu els fitxers compartits des de qualsevol dispositiu
accountBenefitMoz = Descobriu els altres serveis de { -mozilla }
signOut = Tanca la sessi\xF3
okButton = D'acord
downloadingTitle = S'est\xE0 baixant
noStreamsWarning = Pot ser que aquest navegador no pugui desxifrar un fitxer tan gran.
noStreamsOptionCopy = Copieu l'enlla\xE7 per obrir-lo en un altre navegador
noStreamsOptionFirefox = Proveu el nostre navegador preferit
noStreamsOptionDownload = Segueix amb aquest navegador
downloadFirefoxPromo = El nou { -firefox } us ofereix el { -send-short-brand }
# the next line after the colon contains a file name
shareLinkDescription = Compartiu l'enlla\xE7 al vostre fitxer:
shareLinkButton = Comparteix l'enlla\xE7
# $name is the name of the file
shareMessage = Baixeu \xAB{ $name }\xBB amb el { -send-brand }: compartici\xF3 de fitxers senzilla i segura
trailheadPromo = Hi ha una manera de protegir la vostra privadesa. Uniu-vos al Firefox.
learnMore = M\xE9s informaci\xF3.

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
  ca_default as default
};
//# sourceMappingURL=ca-7IK5ULC3.js.map
