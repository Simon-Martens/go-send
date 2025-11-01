import "./chunk-IFG75HHC.js";

// locales/nb-NO.ftl
var nb_NO_default = `title = Go Send
importingFile = Importerer\u2026
encryptingFile = Krypterer...
decryptingFile = Dekrypterer...
downloadCount =
    { $num ->
        [one] 1 nedlasting
       *[other] { $num } nedlastinger
    }
timespanHours =
    { $num ->
        [one] 1 time
       *[other] { $num } timer
    }
copiedUrl = Kopiert!
unlockInputPlaceholder = Passord
unlockButtonLabel = L\xE5s opp
downloadButtonLabel = Last ned
downloadFinish = Nedlastingen er fullf\xF8rt.
fileSizeProgress = ({ $partialSize } av { $totalSize })
sendYourFilesLink = Pr\xF8v Send
errorPageHeader = Det oppstod en feil.
fileTooBig = Filen er for stor til \xE5 laste opp. Det m\xE5 v\xE6re mindre enn { $size }.
linkExpiredAlt = Lenke utl\xF8pt
notSupportedHeader = Din nettleser er ikke st\xF8ttet.
notSupportedLink = Hvorfor er ikke nettleseren min st\xF8ttet?
notSupportedOutdatedDetail = Dessverre st\xF8tter ikke denne versjonen av Firefox netteknologien som driver Send. Du trenger \xE5 oppdatere nettleseren din.
updateFirefox = Oppdater Firefox
deletePopupCancel = Avbryt
deleteButtonHover = Slett
passwordTryAgain = Feil passord. Pr\xF8v igjen.
javascriptRequired = Send krever JavaScript.
whyJavascript = Hvorfor krever Send JavaScript?
enableJavascript = Sl\xE5 p\xE5 JavaScript og pr\xF8v igjen.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }t { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimum passordlengde: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Dette passordet kunne ikke settes

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Enkel, privat fildeling
introDescription = { -send-brand } lar deg dele filer via en tidsbegrenset lenke med ende-til-ende-kryptering. P\xE5 den m\xE5ten kan du dele filer privat og samtidig v\xE6re trygg p\xE5 at filene dine ikke blir liggende p\xE5 nettet for alltid.
notifyUploadEncryptDone = Filen din er kryptert og klar til \xE5 sende
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Utl\xF8per etter { $downloadCount } eller { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minutt
       *[other] { $num } minutter
    }
timespanDays =
    { $num ->
        [one] 1 dag
       *[other] { $num } dager
    }
timespanWeeks =
    { $num ->
        [one] 1 uke
       *[other] { $num } uker
    }
fileCount =
    { $num ->
        [one] 1 fil
       *[other] { $num } filer
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
totalSize = Total st\xF8rrelse: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kopier lenken for \xE5 dele filen din:
copyLinkButton = Kopier lenke
downloadTitle = Last ned filer
downloadDescription = Denne filen ble delt via { -send-brand } med ende-til-ende-kryptering og en lenke som automatisk utl\xF8per.
trySendDescription = Pr\xF8v { -send-brand } for enkel, sikker fildeling.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Kun 1 fil kan lastes opp om gangen.
       *[other] Kun { $count } filer kan lastes opp om gangen.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Kun 1 arkiv er tillatt.
       *[other] Kun { $count } arkiver er tillatt.
    }
expiredTitle = Denne lenken er utl\xF8pt.
notSupportedDescription = { -send-brand } virker ikke med denne nettleseren. { -send-short-brand } fungerer best med den nyeste versjonen av { -firefox }, og vil fungere med den nyeste versjonen av de fleste nettlesere.
downloadFirefox = Last ned { -firefox }
legalTitle = { -send-short-brand } Personvernerkl\xE6ring
legalDateStamp = Versjon 1.0, datert den 12. mars 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }t { $minutes }m
addFilesButton = Velg filer du vil laste opp
uploadButton = Last opp
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Dra og slipp filer
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = eller klikk for \xE5 sende filer p\xE5 opptil { $size }
addPassword = Beskytt med passord
emailPlaceholder = Skriv inn e-postadressen din
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Logg inn for \xE5 sende opptil { $size }
signInOnlyButton = Logg inn
accountBenefitTitle = Opprett en { -firefox }-konto eller logg inn
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Del filer p\xE5 opptil { $size }
accountBenefitDownloadCount = Del filer med flere personer
accountBenefitTimeLimit =
    { $count ->
        [one] Hold lenker aktiv opptil 1 dag
       *[other] Hold lenker aktiv opptil { $count }\xA0dager
    }
accountBenefitSync = Behandle delte filer fra en hvilken som helst enhet
accountBenefitMoz = Les om andre { -mozilla }-tjenester
signOut = Logg ut
okButton = OK
downloadingTitle = Laster ned
noStreamsWarning = Denne nettleseren kan kanskje ikke dekryptere en s\xE5 stor fil.
noStreamsOptionCopy = Kopier lenken for \xE5 \xE5pne den i en annen nettleser
noStreamsOptionFirefox = Pr\xF8v favorittnettleseren v\xE5r
noStreamsOptionDownload = Fortsett med denne nettleseren
downloadFirefoxPromo = { -send-short-brand } presenteres for deg av den helt nye { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Del lenken til filen din:
shareLinkButton = Del lenke
# $name is the name of the file
shareMessage = Last ned \u2039{ $name }\u203A med { -send-brand }: enkel, trygg fildeling
trailheadPromo = Det finnes en m\xE5te \xE5 ta vare p\xE5 personvernet ditt. Bruk Firefox.
learnMore = Les mer.

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
  nb_NO_default as default
};
//# sourceMappingURL=nb-NO-7VVUTNJN.js.map
