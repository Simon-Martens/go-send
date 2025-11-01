import"./chunk.XOPNHUSF.js";var e=`title = Go Send
importingFile = Import\xE1l\xE1s\u2026
encryptingFile = Titkos\xEDt\xE1s\u2026
decryptingFile = Visszafejt\xE9s\u2026
downloadCount =
    { $num ->
        [one] 1 let\xF6lt\xE9s
       *[other] { $num } let\xF6lt\xE9s
    }
timespanHours =
    { $num ->
        [one] 1 \xF3ra
       *[other] { $num }  \xF3ra
    }
copiedUrl = M\xE1solva!
unlockInputPlaceholder = Jelsz\xF3
unlockButtonLabel = Felold\xE1s
downloadButtonLabel = Let\xF6lt\xE9s
downloadFinish = A let\xF6lt\xE9s befejez\u0151d\xF6tt
fileSizeProgress = ({ $partialSize } / { $totalSize })
sendYourFilesLink = Pr\xF3b\xE1lja ki a Sendet
errorPageHeader = Hiba t\xF6rt\xE9nt!
fileTooBig = Ez a f\xE1jl t\xFAl nagy a felt\xF6lt\xE9shez. Kevesebb mint { $size } kell legyen.
linkExpiredAlt = A hivatkoz\xE1s lej\xE1rt
notSupportedHeader = A b\xF6ng\xE9sz\u0151 nem t\xE1mogatott.
notSupportedLink = Mi\xE9rt nem t\xE1mogatott a b\xF6ng\xE9sz\u0151m?
notSupportedOutdatedDetail = Sajnos a Firefox ezen verzi\xF3ja nem t\xE1mogatja a Send alapj\xE1t k\xE9pez\u0151 technol\xF3gi\xE1t. Friss\xEDtenie kell a b\xF6ng\xE9sz\u0151j\xE9t.
updateFirefox = Firefox friss\xEDt\xE9se
deletePopupCancel = M\xE9gse
deleteButtonHover = T\xF6rl\xE9s
passwordTryAgain = Helytelen jelsz\xF3. Pr\xF3b\xE1lja meg \xFAjra.
javascriptRequired = A Sendhez JavaScript sz\xFCks\xE9ges
whyJavascript = Mi\xE9rt van sz\xFCks\xE9g JavaScriptre a Sendhez?
enableJavascript = K\xE9rj\xFCk enged\xE9lyezze a JavaScriptet, majd pr\xF3b\xE1lkozzon \xFAjra.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }\xF3 { $minutes }p
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }p
# A short status message shown when the user enters a long password
maxPasswordLength = Maxim\xE1lis jelsz\xF3hossz: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Ez a jelsz\xF3 nem \xE1ll\xEDthat\xF3 be

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Egyszer\u0171, priv\xE1t f\xE1jlmegoszt\xE1s
introDescription = A { -send-brand }del v\xE9gpontok k\xF6z\xF6tti titkos\xEDt\xE1ssal oszthat meg f\xE1jlokat, a hivatkoz\xE1sok pedig automatikusan lej\xE1rnak. \xCDgy bizalmasan tarthatja azt, amit megoszt, \xE9s biztos\xEDthatja, hogy a dolgok nem maradnak \xF6r\xF6kre online.
notifyUploadEncryptDone = A f\xE1jl titkos\xEDtva \xE9s k\xE9szen \xE1ll a k\xFCld\xE9sre
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = { $downloadCount } vagy { $timespan } ut\xE1n el\xE9v\xFCl
timespanMinutes =
    { $num ->
        [one] 1 perc
       *[other] { $num } perc
    }
timespanDays =
    { $num ->
        [one] 1 nap
       *[other] { $num } nap
    }
timespanWeeks =
    { $num ->
        [one] 1 h\xE9t
       *[other] { $num } h\xE9t
    }
fileCount =
    { $num ->
        [one] 1 f\xE1jl
       *[other] { $num } f\xE1jl
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
fileSize = { $num } { $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Teljes m\xE9ret: { $size }
# the next line after the colon contains a file name
copyLinkDescription = M\xE1solja a hivatkoz\xE1st a f\xE1jl megoszt\xE1s\xE1hoz:
copyLinkButton = Hivatkoz\xE1s m\xE1sol\xE1sa
downloadTitle = F\xE1jlok let\xF6lt\xE9se
downloadDescription = Ez a f\xE1jl a { -send-brand } szolg\xE1ltat\xE1ssal lett megosztva, v\xE9gpontok k\xF6z\xF6tti titkos\xEDt\xE1ssal, \xE9s a hivatkoz\xE1s automatikusan el\xE9v\xFCl.
trySendDescription = Pr\xF3b\xE1lja ki a { -send-brand }et az egyszer\u0171, biztons\xE1gos f\xE1jlmegoszt\xE1s\xE9rt.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Egyszerre csak 1 f\xE1jl t\xF6lthet\u0151 fel.
       *[other] Egyszerre csak { $count } f\xE1jl t\xF6lthet\u0151 fel.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Csak 1 arch\xEDvum enged\xE9lyezett.
       *[other] Csak { $count } arch\xEDvum enged\xE9lyezett.
    }
expiredTitle = Ez a hivatkoz\xE1s el\xE9v\xFClt.
notSupportedDescription = A { -send-brand } nem m\u0171k\xF6dik ebben a b\xF6ng\xE9sz\u0151ben. A { -send-short-brand } a { -firefox } legfrissebb verzi\xF3j\xE1val m\u0171k\xF6dik a legjobban, de m\u0171k\xF6dik a legt\xF6bb b\xF6ng\xE9sz\u0151 aktu\xE1lis verzi\xF3j\xE1val is.
downloadFirefox = A { -firefox } let\xF6lt\xE9se
legalTitle = { -send-short-brand } adatv\xE9delmi nyilatkozat
legalDateStamp = 1.0-s verzi\xF3, kelt 2019. m\xE1rcius 12-\xE9n
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }n { $hours }\xF3 { $minutes }p
addFilesButton = V\xE1lassza ki a felt\xF6ltend\u0151 f\xE1jlokat
uploadButton = Felt\xF6lt\xE9s
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = H\xFAzza ide a f\xE1jlokat
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = vagy jelentkezzen be, \xE9s k\xFCldj\xF6n legfeljebb { $size }-ot
addPassword = Jelszavas v\xE9delem
emailPlaceholder = Adja meg az e-mail c\xEDm\xE9t
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Jelentkezzen be, \xE9s k\xFCldj\xF6n legfeljebb { $size }-ot
signInOnlyButton = Bejelentkez\xE9s
accountBenefitTitle = Hozzon l\xE9tre egy { -firefox } fi\xF3kot vagy jelentkezzen be
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Osszon meg f\xE1jlokat { $size }-ig
accountBenefitDownloadCount = Osszon meg f\xE1jlokat t\xF6bb emberrel
accountBenefitTimeLimit =
    { $count ->
        [one] A hivatkoz\xE1sok akt\xEDvan tart\xE1sa legfeljebb 1 napig
       *[other] A hivatkoz\xE1sok akt\xEDvan tart\xE1sa legfeljebb { $count } napig
    }
accountBenefitSync = Kezelje a megosztott f\xE1jlokat b\xE1rmely eszk\xF6zr\u0151l
accountBenefitMoz = Ismerje meg a t\xF6bbi { -mozilla } szolg\xE1ltat\xE1st
signOut = Kijelentkez\xE9s
okButton = OK
downloadingTitle = Let\xF6lt\xE9s
noStreamsWarning = El\u0151fordulhat, hogy a b\xF6ng\xE9sz\u0151 nem fog tudni visszafejteni egy ekkora f\xE1jlt.
noStreamsOptionCopy = M\xE1solja a hivatkoz\xE1st, \xE9s nyissa meg egy m\xE1sik b\xF6ng\xE9sz\u0151ben
noStreamsOptionFirefox = Pr\xF3b\xE1lja ki a kedvenc b\xF6ng\xE9sz\u0151nket
noStreamsOptionDownload = Folytat\xE1s ezzel a b\xF6ng\xE9sz\u0151vel
downloadFirefoxPromo = A { -send-short-brand }et a vadonat\xFAj { -firefox } hozza el \xD6nnek.
# the next line after the colon contains a file name
shareLinkDescription = Ossza meg a f\xE1jlja hivatkoz\xE1s\xE1t:
shareLinkButton = Hivatkoz\xE1s megoszt\xE1sa
# $name is the name of the file
shareMessage = \u201E{ $name }\u201D let\xF6lt\xE9se a { -send-brand } seg\xEDts\xE9g\xE9vel: egyszer\u0171, biztons\xE1gos f\xE1jlmegoszt\xE1s
trailheadPromo = V\xE9dje meg a mag\xE1nszf\xE9r\xE1j\xE1t. Csatlakozzon a Firefoxhoz.
learnMore = Tov\xE1bbi tudnival\xF3k.

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
`;export{e as default};
