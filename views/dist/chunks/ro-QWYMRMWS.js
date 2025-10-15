// locales/ro.ftl
var ro_default = `title = Go Send
importingFile = Se import\u0103\u2026
encryptingFile = Se cripteaz\u0103\u2026
decryptingFile = Se decripteaz\u0103\u2026
downloadCount =
    { $num ->
        [one] 1 desc\u0103rcare
        [few] { $num } desc\u0103rc\u0103ri
       *[other] { $num } de desc\u0103rc\u0103ri
    }
timespanHours =
    { $num ->
        [one] 1 or\u0103
        [few] { $num } ore
       *[other] { $num } de ore
    }
copiedUrl = Copiat!
unlockInputPlaceholder = Parol\u0103
unlockButtonLabel = Deblocheaz\u0103
downloadButtonLabel = Descarc\u0103
downloadFinish = Desc\u0103rcare \xEEncheiat\u0103
fileSizeProgress = ({ $partialSize } din { $totalSize })
sendYourFilesLink = \xCEncearc\u0103 Send
errorPageHeader = Ceva nu a func\u021Bionat!
fileTooBig = Acest fi\u0219ier este prea mare. Ar trebuie s\u0103 fie sub { $size }.
linkExpiredAlt = Link expirat
notSupportedHeader = Browserul t\u0103u nu este suportat.
notSupportedLink = De ce browserul meu nu este suportat?
notSupportedOutdatedDetail = Din p\u0103cate, aceast\u0103 versiune de Firefox nu suport\u0103 tehnologiile web din spatele Send. Va trebui s\u0103 actualizezi browserul.
updateFirefox = Actualizeaz\u0103 Firefox
deletePopupCancel = Renun\u021B\u0103
deleteButtonHover = \u0218terge
passwordTryAgain = Parol\u0103 incorect\u0103. \xCEncearc\u0103 din nou.
javascriptRequired = Send necesit\u0103 JavaScript
whyJavascript = De ce Send necesit\u0103 JavaScript?
enableJavascript = Te rug\u0103m s\u0103 reactivezi JavaScript \u0219i s\u0103 \xEEncerci din nou.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Lungime minim\u0103 a parolei: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Aceast\u0103 parol\u0103 nu a putut fi setat\u0103

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Partajare de fi\u0219iere simpl\u0103 \u0219i privat\u0103
introDescription = { -send-brand } \xEE\u021Bi permite s\u0103 partajezi fi\u0219iere cu criptare cap\u0103t-la-cap\u0103t \u0219i un link care expir\u0103 automat. Deci, po\u021Bi p\u0103stra confiden\u021Bial ceea ce partajezi \u0219i te po\u021Bi asigura c\u0103 ce ai partajat nu r\u0103m\xE2ne online pentru totdeauna.
notifyUploadEncryptDone = Fi\u0219ierul t\u0103u este criptat \u0219i gata de trimitere
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expir\u0103 dup\u0103 { $downloadCount } sau { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minut
        [few] { $num } minute
       *[other] { $num } de minute
    }
timespanDays =
    { $num ->
        [one] 1 zi
        [few] { $num } zile
       *[other] { $num } de zile
    }
timespanWeeks =
    { $num ->
        [one] 1 s\u0103pt\u0103m\xE2n\u0103
        [few] { $num } s\u0103pt\u0103m\xE2ni
       *[other] { $num } de s\u0103pt\u0103m\xE2ni
    }
fileCount =
    { $num ->
        [one] 1 fi\u0219ier
        [few] { $num } fi\u0219iere
       *[other] { $num } de fi\u0219iere
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
totalSize = M\u0103rime total\u0103: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copiaz\u0103 linkul pentru partajarea fi\u0219ierului:
copyLinkButton = Copiaz\u0103 linkul
downloadTitle = Descarc\u0103 fi\u0219ierele
downloadDescription = Acest fi\u0219ier a fost partajat prin { -send-brand }, cu criptare cap\u0103t-la-cap\u0103t \u0219i un link care expir\u0103 automat.
trySendDescription = \xCEncearc\u0103 { -send-brand } pentru o partajare simpl\u0103 \u0219i sigur\u0103 a fi\u0219ierelor.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Numai 1 fi\u0219ier poate fi \xEEnc\u0103rcat simultan.
        [few] Numai { $count } fi\u0219iere pot fi \xEEnc\u0103rcate simultan.
       *[other] Numai { $count } de fi\u0219iere pot fi \xEEnc\u0103rcate simultan.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Numai 1 arhiv\u0103 este permis\u0103.
        [few] Numai { $count } arhive sunt permise.
       *[other] Numai { $count } de arhive sunt permise.
    }
expiredTitle = Acest link a expirat.
notSupportedDescription = { -send-brand } nu va func\u021Biona pe acest browser. { -send-short-brand } func\u021Bioneaz\u0103 cel mai bine cu ultima versiune de { -firefox } \u0219i va func\u021Biona cu versiunea curent\u0103 a majorit\u0103\u021Bii browserelor.
downloadFirefox = Descarc\u0103 { -firefox }
legalTitle = Declara\u021Bie de confiden\u021Bialitate { -send-short-brand }
legalDateStamp = Versiunea 1.0 din data de 12 martie 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }z { $hours }h { $minutes }m
addFilesButton = Selecteaz\u0103 fi\u0219ierele pentru \xEEnc\u0103rcare
uploadButton = \xCEncarc\u0103
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Trage \u0219i plaseaz\u0103 fi\u0219ierele
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = sau d\u0103 clic pentru a trimite p\xE2n\u0103 la { $size }
addPassword = Protejeaz\u0103 cu parol\u0103
emailPlaceholder = Introdu e-mailul t\u0103u
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Autentific\u0103-te pentru a trimite p\xE2n\u0103 la { $size }
signInOnlyButton = Autentificare
accountBenefitTitle = Creeaz\u0103 un cont { -firefox } sau autentific\u0103-te
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Partajeaz\u0103 fi\u0219iere de p\xE2n\u0103 la { $size }
accountBenefitDownloadCount = Partajeaz\u0103 fi\u0219iere cu mai multe persoane
accountBenefitTimeLimit =
    { $count ->
        [one] P\u0103streaz\u0103 linkurile active p\xE2n\u0103 la 1 zi
        [few] P\u0103streaz\u0103 linkurile active p\xE2n\u0103 la { $count } zile
       *[other] P\u0103streaz\u0103 linkurile active p\xE2n\u0103 la { $count } de zile
    }
accountBenefitSync = Gestioneaz\u0103 fi\u0219ierele partajate de pe orice dispozitiv
accountBenefitMoz = Afl\u0103 despre celelalte servicii { -mozilla }
signOut = Deconectare
okButton = Ok
downloadingTitle = Se descarc\u0103
noStreamsWarning = Este posibil ca acest browser s\u0103 nu poat\u0103 decripta un fi\u0219ier at\xE2t de mare.
noStreamsOptionCopy = Copiaz\u0103 linkul pentru a-l deschide \xEEntr-un alt browser
noStreamsOptionFirefox = \xCEncearc\u0103 browserul nostru favorit
noStreamsOptionDownload = Continu\u0103 cu acest browser
downloadFirefoxPromo = { -send-short-brand } \xEE\u021Bi este adus de noul { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Partajeaz\u0103 linkul c\u0103tre fi\u0219ier:
shareLinkButton = Partajeaz\u0103 linkul
# $name is the name of the file
shareMessage = Descarc\u0103 \u201E{ $name }\u201D cu { -send-brand }: partajare simpl\u0103 \u0219i sigur\u0103 a fi\u0219ierelor
trailheadPromo = Exist\u0103 o modalitate de a-\u021Bi proteja via\u021Ba privat\u0103. Folose\u0219te Firefox.
learnMore = Afl\u0103 mai multe.
`;
export {
  ro_default as default
};
//# sourceMappingURL=ro-QWYMRMWS.js.map
