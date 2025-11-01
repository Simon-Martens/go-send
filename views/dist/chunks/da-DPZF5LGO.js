import "./chunk-IFG75HHC.js";

// locales/da.ftl
var da_default = `title = Go Send
importingFile = Importerer\u2026
encryptingFile = Krypterer\u2026
decryptingFile = Dekrypterer\u2026
downloadCount =
    { $num ->
        [one] 1 hentning
       *[other] { $num } hentninger
    }
timespanHours =
    { $num ->
        [one] 1 time
       *[other] { $num } timer
    }
copiedUrl = Kopieret!
unlockInputPlaceholder = Adgangskode
unlockButtonLabel = L\xE5s op
downloadButtonLabel = Hent
downloadFinish = Hentning fuldf\xF8rt
fileSizeProgress = ({ $partialSize } af { $totalSize })
sendYourFilesLink = Pr\xF8v Send
errorPageHeader = Der gik noget galt!
fileTooBig = Den fil er for stor at uploade. Den skal v\xE6re mindre end { $size }.
linkExpiredAlt = Link er udl\xF8bet
notSupportedHeader = Din browser underst\xF8ttes ikke.
notSupportedLink = Hvorfor underst\xF8ttes min browser ikke?
notSupportedOutdatedDetail = Desv\xE6rre underst\xF8tter denne version af Firefox ikke den webteknologi, som driver Send. Du skal opdatere din browser.
updateFirefox = Opdater Firefox
deletePopupCancel = Annuller
deleteButtonHover = Slet
passwordTryAgain = Forkert adgangskode. Pr\xF8v igen.
javascriptRequired = Send kr\xE6ver JavaScript
whyJavascript = Hvorfor kr\xE6ver Send JavaScript?
enableJavascript = Aktiver JavaScript og pr\xF8v igen.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } t { $minutes } m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } m
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimum l\xE6ngde af adgangskode: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Adgangskoden kunne ikke s\xE6ttes

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Enkel, privat fildeling
introDescription = { -send-brand } g\xF8r det muligt at dele filer via et tidsbegr\xE6nset link og med end to end-kryptering. P\xE5 den m\xE5de kan du dele filer privat og samtidig v\xE6re sikker p\xE5, at det delte ikke forbliver online for evigt.
notifyUploadEncryptDone = Din fil er krypteret og klar til at blive sendt
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Udl\xF8ber efter { $downloadCount } eller { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minut
       *[other] { $num } minutter
    }
timespanDays =
    { $num ->
        [one] 1 dag
       *[other] { $num } dage
    }
timespanWeeks =
    { $num ->
        [one] 1 uge
       *[other] { $num } uger
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
totalSize = Samlet st\xF8rrelse: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kopier linket for at dele din fil:
copyLinkButton = Kopier link
downloadTitle = Hent filer
downloadDescription = Denne fil blev delt via { -send-brand } med end to end-kryptering og et link, der automatisk udl\xF8ber.
trySendDescription = Pr\xF8v { -send-brand } for enkel og sikker fildeling.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Du kan kun uploade 1 fil ad gangen.
       *[other] Du kan kun uploade { $count } filer ad gangen.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Kun 1 arkiv er tilladt.
       *[other] Kun { $count } arkiver er tilladt.
    }
expiredTitle = Dette link er udl\xF8bet.
notSupportedDescription = { -send-brand } virker ikke med denne browser. { -send-short-brand } virker bedst med den nyeste version af { -firefox } og med de fleste andre nye browsere.
downloadFirefox = Hent { -firefox }
legalTitle = { -send-short-brand }, om privatlivspolitik
legalDateStamp = Version 1.0, udsendt d. 12. marts 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } d. { $hours } t. { $minutes } m.
addFilesButton = V\xE6lg filer, der skal uploades
uploadButton = Upload
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Tr\xE6k og slip filer
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = eller klik for at sende filer p\xE5 op til { $size }
addPassword = Beskyt med adgangskode
emailPlaceholder = Indtast din mailadresse
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Log ind for at sende filer p\xE5 op til { $size }
signInOnlyButton = Log ind
accountBenefitTitle = Opret en { -firefox }-konto eller log ind
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Del filer p\xE5 op til { $size }
accountBenefitDownloadCount = Del filer med flere personer
accountBenefitTimeLimit =
    { $count ->
        [one] Bevar links aktive i op til 1 dag
       *[other] Bevar links aktive i op til { $count } dage
    }
accountBenefitSync = H\xE5ndter delte filer p\xE5 enhver enhed
accountBenefitMoz = L\xE6s om andre tjenester fra { -mozilla }
signOut = Log ud
okButton = OK
downloadingTitle = Henter
noStreamsWarning = Denne browser kan muligvis ikke dekryptere en fil, der er s\xE5 stor.
noStreamsOptionCopy = Kopier linket for at \xE5bne det i en anden browser
noStreamsOptionFirefox = Pr\xF8v vores favorit-browser
noStreamsOptionDownload = Forts\xE6t med denne browser
downloadFirefoxPromo = { -send-short-brand } pr\xE6senteres af den nye { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Del linket til din fil:
shareLinkButton = Del link
# $name is the name of the file
shareMessage = Hent { $name } med { -send-brand } - simpel og sikker fildeling
trailheadPromo = Beskyt dine digitale rettigheder. Slut dig til Firefox.
learnMore = L\xE6s mere.

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
  da_default as default
};
//# sourceMappingURL=da-DPZF5LGO.js.map
