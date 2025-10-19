import "./chunk-IFG75HHC.js";

// locales/fi.ftl
var fi_default = `title = Go Send
importingFile = Tuodaan\u2026
encryptingFile = Salataan...
decryptingFile = Puretaan salausta...
downloadCount =
    { $num ->
        [one] yhden latauksen
       *[other] { $num } latauksen
    }
timespanHours =
    { $num ->
        [one] 1 tunnin
       *[other] { $num } tunnin
    }
copiedUrl = Kopioitu!
unlockInputPlaceholder = Salasana
unlockButtonLabel = Avaa
downloadButtonLabel = Lataa
downloadFinish = Lataus valmis
fileSizeProgress = { $partialSize } / { $totalSize }
sendYourFilesLink = Kokeile Send -palvelua
errorPageHeader = Jokin meni pieleen!
fileTooBig = T\xE4m\xE4 tiedosto on liian suuri ladattavaksi. Sen pit\xE4isi olla pienempi kuin { $size }.
linkExpiredAlt = Linkki on vanhentunut
notSupportedHeader = Selaintasi ei tueta.
notSupportedLink = Miksi selaintani ei tueta?
notSupportedOutdatedDetail = Valitettavasti t\xE4m\xE4 Firefoxin versio ei tue Sendi\xE4 k\xE4ytt\xE4v\xE4\xE4 web-tekniikkaa. Sinun on p\xE4ivitett\xE4v\xE4 selaimesi.
updateFirefox = P\xE4ivit\xE4 Firefox
deletePopupCancel = Peruuta
deleteButtonHover = Poista
passwordTryAgain = V\xE4\xE4r\xE4 salasana. Yrit\xE4 uudelleen.
javascriptRequired = Firefox-Send vaatii JavaScriptin
whyJavascript = Miksi Send vaatii JavaScriptin?
enableJavascript = Ota JavaScript k\xE4ytt\xF6\xF6n ja yrit\xE4 uudelleen.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } t { $minutes } min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } min
# A short status message shown when the user enters a long password
maxPasswordLength = Salasanan enimm\xE4ispituus: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = T\xE4t\xE4 salasanaa ei voitu asettaa

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Helppoa ja yksityist\xE4 tiedostonjakoa
introDescription = { -send-brand } mahdollistaa tiedostojen jakamisen automaattisesti vanhenevalla linkill\xE4. Tiedostojen jakaminen tapahtuu p\xE4\xE4st\xE4 p\xE4\xE4h\xE4n -salattuna. N\xE4in jakamasi tiedostot pysyv\xE4t yksityisin\xE4 ja voit olla varma, etteiv\xE4t l\xE4hett\xE4m\xE4si tiedostot pysy verkossa ikuisesti.
notifyUploadEncryptDone = Tiedosto on salattu ja valmis l\xE4hetett\xE4v\xE4ksi
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Vanhenee { $downloadCount } tai { $timespan } j\xE4lkeen
timespanMinutes =
    { $num ->
        [one] 1 minuutin
       *[other] { $num } minuutin
    }
timespanDays =
    { $num ->
        [one] 1 p\xE4iv\xE4n
       *[other] { $num } p\xE4iv\xE4n
    }
timespanWeeks =
    { $num ->
        [one] 1 viikon
       *[other] { $num } viikon
    }
fileCount =
    { $num ->
        [one] 1 tiedosto
       *[other] { $num } tiedostoa
    }
# byte abbreviation
bytes = t
# kibibyte abbreviation
kb = kt
# mebibyte abbreviation
mb = Mt
# gibibyte abbreviation
gb = Gt
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num } { $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Koko yhteens\xE4: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kopioi linkki jakaaksesi tiedoston:
copyLinkButton = Kopioi linkki
downloadTitle = Lataa tiedostot
downloadDescription = T\xE4m\xE4 tiedosto jaettiin { -send-brand } -palvelun kautta p\xE4\xE4st\xE4 p\xE4\xE4h\xE4n -salattuna ja automaattisesti vanhenevalla linkill\xE4.
trySendDescription = Kokeile { -send-brand } -palvelua jakaaksesi tiedostoja helposti ja turvallisesti.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Vain 1 tiedosto on mahdollistaa l\xE4hett\xE4\xE4 kerralla.
       *[other] Vain { $count } tiedostoa on mahdollista l\xE4hett\xE4\xE4 kerralla.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Vain 1 arkisto on sallittu.
       *[other] Vain { $count } arkistoa on sallittu.
    }
expiredTitle = T\xE4m\xE4 linkki on vanhentunut.
notSupportedDescription = { -send-brand } ei toimi t\xE4ll\xE4 selaimella. { -send-short-brand } toimii parhaiten { -firefox }in uusimmalla versiolla, ja toimii useimpien selainten uusimmilla versioilla.
downloadFirefox = Lataa { -firefox }
legalTitle = { -send-short-brand }-yksityisyysk\xE4yt\xE4nt\xF6
legalDateStamp = Versio 1.0, p\xE4iv\xE4tty 13. maaliskuuta 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } pv { $hours } t { $minutes } min
addFilesButton = Valitse l\xE4hetett\xE4v\xE4t tiedostot
uploadButton = L\xE4het\xE4
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Ved\xE4 ja pudota tiedostot
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = tai napsauta l\xE4hett\xE4\xE4ksesi tiedostoja, joiden koko voi olla enint\xE4\xE4n { $size }
addPassword = Suojaa salasanalla
emailPlaceholder = Kirjoita s\xE4hk\xF6postiosoitteesi
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Kirjautumalla voit l\xE4hett\xE4\xE4 jopa { $size } kokoisia tiedostoja
signInOnlyButton = Kirjaudu sis\xE4\xE4n
accountBenefitTitle = Luo { -firefox }-tili tai kirjaudu sis\xE4\xE4n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Jaa jopa { $size } kokoisia tiedostoja
accountBenefitDownloadCount = Jaa tiedostoja useamman ihmisen kesken
accountBenefitTimeLimit =
    { $count ->
        [one] S\xE4ilyt\xE4 linkit aktiivisina 1 p\xE4iv\xE4n ajan
       *[other] S\xE4ilyt\xE4 linkit aktiivisina { $count } p\xE4iv\xE4n ajan
    }
accountBenefitSync = Hallitse jaettuja tiedostoja milt\xE4 tahansa laitteelta
accountBenefitMoz = Lue lis\xE4\xE4 muista { -mozilla }-palveluista
signOut = Kirjaudu ulos
okButton = OK
downloadingTitle = Ladataan
noStreamsWarning = T\xE4m\xE4 selain ei v\xE4ltt\xE4m\xE4tt\xE4 osaa purkaa salausta n\xE4in suurikokoisista tiedostoista.
noStreamsOptionCopy = Kopioi linkki avataksesi sen toisessa selaimessa
noStreamsOptionFirefox = Kokeile suosikkiselaintamme
noStreamsOptionDownload = Jatka t\xE4ll\xE4 selaimella
downloadFirefoxPromo = { -send-short-brand } on olemassa kiitos uuden { -firefox }in.
# the next line after the colon contains a file name
shareLinkDescription = Jaa linkki tiedostoosi:
shareLinkButton = Jaa linkki
# $name is the name of the file
shareMessage = Lataa tiedosto \u201D{ $name }\u201D { -send-brand } -palvelusta: yksinkertaista ja turvallista tiedostonjakoa
trailheadPromo = On tapa suojata yksityisyytt\xE4\xE4n. Liity Firefoxiin.
learnMore = Lue lis\xE4\xE4.

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
  fi_default as default
};
//# sourceMappingURL=fi-SI2D7DPR.js.map
