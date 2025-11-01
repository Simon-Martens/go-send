import"./chunk.XOPNHUSF.js";var n=`title = Go Send
importingFile = Importerar\u2026
encryptingFile = Krypterar\u2026
decryptingFile = Avkodar\u2026
downloadCount =
    { $num ->
        [one] 1 nedladdning
       *[other] { $num } nedladdningar
    }
timespanHours =
    { $num ->
        [one] 1 timme
       *[other] { $num } timmar
    }
copiedUrl = Kopierad!
unlockInputPlaceholder = L\xF6senord
unlockButtonLabel = L\xE5s upp
downloadButtonLabel = Ladda ner
downloadFinish = Nedladdning klar
fileSizeProgress = ({ $partialSize } av { $totalSize })
sendYourFilesLink = Testa Send
errorPageHeader = N\xE5got gick fel!
fileTooBig = Den filen \xE4r f\xF6r stor f\xF6r att ladda upp. Det ska vara mindre \xE4n { $size }.
linkExpiredAlt = L\xE4nk upph\xF6rd
notSupportedHeader = Din webbl\xE4sare st\xF6ds inte.
notSupportedLink = Varf\xF6r st\xF6ds inte min webbl\xE4sare?
notSupportedOutdatedDetail = Tyv\xE4rr st\xF6djer den h\xE4r versionen av Firefox inte webbtekniken som driver Send. Du m\xE5ste uppdatera din webbl\xE4sare.
updateFirefox = Uppdatera Firefox
deletePopupCancel = Avbryt
deleteButtonHover = Ta bort
passwordTryAgain = Felaktigt l\xF6senord. F\xF6rs\xF6k igen.
javascriptRequired = Send kr\xE4ver JavaScript
whyJavascript = Varf\xF6r kr\xE4ver Send JavaScript?
enableJavascript = Aktivera JavaScript och f\xF6rs\xF6k igen.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }t { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Maximal l\xF6senordsl\xE4ngd: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Det h\xE4r l\xF6senordet kunde inte st\xE4llas in

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Enkel, privat fildelning
introDescription = { -send-brand } l\xE5ter dig dela filer med end-to-end-kryptering och en l\xE4nk som automatiskt upph\xF6r. S\xE5 att du kan beh\xE5lla det du delar privat och se till att dina saker inte stannar online f\xF6r alltid.
notifyUploadEncryptDone = Din fil \xE4r krypterad och redo att skickas
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = F\xF6rfaller efter { $downloadCount } eller { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minut
       *[other] { $num } minuter
    }
timespanDays =
    { $num ->
        [one] 1 dag
       *[other] { $num } dagar
    }
timespanWeeks =
    { $num ->
        [one] 1 vecka
       *[other] { $num } veckor
    }
fileCount =
    { $num ->
        [one] 1 fil
       *[other] { $num } filer
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
totalSize = Total storlek: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kopiera l\xE4nken f\xF6r att dela din fil:
copyLinkButton = Kopiera l\xE4nk
downloadTitle = Ladda ner filer
downloadDescription = Den h\xE4r filen delades via { -send-brand } med end-to-end-kryptering och en l\xE4nk som automatiskt upph\xF6r.
trySendDescription = Prova { -send-brand } f\xF6r enkel, s\xE4ker fildelning.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Endast 1 fil  kan laddas upp i taget.
       *[other] Endast { $count } filer kan laddas upp i taget.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Endast 1 arkiv \xE4r till\xE5ten.
       *[other] Endast { $count } arkiv \xE4r till\xE5tna.
    }
expiredTitle = Den h\xE4r l\xE4nken har upph\xF6rt.
notSupportedDescription = { -send-brand } fungerar inte med den h\xE4r webbl\xE4saren. { -send-short-brand } fungerar b\xE4st med den senaste versionen av { -firefox } och kommer att fungera med den nuvarande versionen av de flesta webbl\xE4sare.
downloadFirefox = H\xE4mta { -firefox }
legalTitle = { -send-short-brand } sekretesspolicy
legalDateStamp = Version 1.0, daterad den 12 mars 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }t { $minutes }m
addFilesButton = V\xE4lj filer som ska laddas upp
uploadButton = Ladda upp
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Dra och sl\xE4pp filer
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = eller klicka f\xF6r att skicka upp till { $size }
addPassword = Skydda med l\xF6senord
emailPlaceholder = Ange din e-postadress
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Logga in f\xF6r att skicka upp till { $size }
signInOnlyButton = Logga in
accountBenefitTitle = Skapa ett { -firefox }-konto eller logga in
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Dela filer upp till { $size }
accountBenefitDownloadCount = Dela filer med fler personer
accountBenefitTimeLimit =
    { $count ->
        [one] H\xE5ll l\xE4nk aktiv i upp till 1 dag
       *[other] H\xE5ll l\xE4nkar aktiva i upp till { $count } dagar
    }
accountBenefitSync = Hantera delade filer fr\xE5n vilken enhet som helst
accountBenefitMoz = L\xE4s om andra { -mozilla }-tj\xE4nster
signOut = Logga ut
okButton = OK
downloadingTitle = Laddar ner
noStreamsWarning = Den h\xE4r webbl\xE4saren kanske inte kan dekryptera en s\xE5 stor fil.
noStreamsOptionCopy = Kopiera l\xE4nken f\xF6r att \xF6ppna i en annan webbl\xE4sare
noStreamsOptionFirefox = Prova v\xE5r favoritwebbl\xE4sare
noStreamsOptionDownload = Forts\xE4tt med den h\xE4r webbl\xE4saren
downloadFirefoxPromo = { -send-short-brand } presenteras f\xF6r dig av den helt nya { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Dela l\xE4nken till din fil:
shareLinkButton = Dela l\xE4nk
# $name is the name of the file
shareMessage = Ladda ner "{ $name }" med { -send-brand }: enkel, s\xE4ker fildelning
trailheadPromo = Det finns ett s\xE4tt att skydda din integritet. G\xE5 med i Firefox.
learnMore = L\xE4s mer.

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
`;export{n as default};
