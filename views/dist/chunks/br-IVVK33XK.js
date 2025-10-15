// locales/br.ftl
var br_default = `title = Go Send
importingFile = Oc'h enporzhia\xF1 \u2026
encryptingFile = Oc'h enrinega\xF1..
decryptingFile = Oc'h ezrinega\xF1...
downloadCount =
    { $num ->
        [one] { $num } bellgargadenn
        [two] { $num } bellgargadenn
        [few] { $num } fellgargadenn
        [many] { $num } a bellgargadenno\xF9
       *[other] { $num } pellgargadenn
    }
timespanHours =
    { $num ->
        [one] { $num } eur
        [two] { $num } eur
        [few] { $num } eur
        [many] { $num } a eurio\xF9
       *[other] { $num } eur
    }
copiedUrl = Eilet!
unlockInputPlaceholder = Ger-tremen
unlockButtonLabel = Dibrenna\xF1
downloadButtonLabel = Pellgarga\xF1
downloadFinish = Pellgargadur echu
fileSizeProgress = ({ $partialSize } war { $totalSize })
sendYourFilesLink = Esaeit Send
errorPageHeader = Degouezhet ez eus bet ur fazi!
fileTooBig = Re vras eo ar restr-ma\xF1 evit e pellgas. Rankout a ra beza\xF1 nebeutoc'h eget { $size }
linkExpiredAlt = Ere diamzeret
notSupportedHeader = N'eo ket skoret ho merdeer.
notSupportedLink = Perak n'eo ket skoret ma merdeer?
notSupportedOutdatedDetail = Siwazh n'eo ket skoret ar c'halvezerezhio\xF9 implijet evit Send gant an handelv-ma\xF1 eus Firefox. Ret e vo deoc'h hizivaat ho merdeer.
updateFirefox = Hizivaat Firefox
deletePopupCancel = Nulla\xF1
deleteButtonHover = Dilemel
passwordTryAgain = Ger-tremen direizh. Klaskit en-dro.
javascriptRequired = Send a azgoulenn Javascript
whyJavascript = Perak e azgoulenn Send Javascript?
enableJavascript = Gweredekait Javascript ha klaskit en-dro.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }e { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Hirder brasa\xF1 aotreet evit ar ger-tremen: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = N'haller ket despiza\xF1 ar ger-tremen

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Ranna\xF1 restro\xF9 en un doare eeun ha prevez
introDescription = A-drugarez da { -send-brand } a c'hallit ranna\xF1 restro\xF9 gant un enrinega\xF1 penn-ouzh-penn hag un ere a ziamzero ent emgefreek. Evel-se e c'hallit mirout ar pezh a rannit prevez ha beza\xF1 sur ne chomo ket ho trao\xF9 enlinenn da viken.
notifyUploadEncryptDone = Enrineget eo ho restr ha prest eo da veza\xF1 kaset
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Diamzeri\xF1 a raio goude { $downloadCount } pe { $timespan }
timespanMinutes =
    { $num ->
        [one] { $num } vunutenn
        [two] { $num } vunutenn
        [few] { $num } munutenn
        [many] { $num } a vunutenno\xF9
       *[other] { $num } munutenn
    }
timespanDays =
    { $num ->
        [one] { $num } devezh
        [two] { $num } zevezh
        [few] { $num } devezh
        [many] { $num } a zevezhio\xF9
       *[other] { $num } devezh
    }
timespanWeeks =
    { $num ->
        [one] { $num } sizhun
        [two] { $num } sizhun
        [few] { $num } sizhun
        [many] { $num } a sizhunio\xF9
       *[other] { $num } sizhun
    }
fileCount =
    { $num ->
        [one] { $num } restr
        [two] { $num } restr
        [few] { $num } restr
        [many] { $num } a restro\xF9
       *[other] { $num } restr
    }
# byte abbreviation
bytes = e
# kibibyte abbreviation
kb = Ke
# mebibyte abbreviation
mb = Me
# gibibyte abbreviation
gb = Ge
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num }{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Ment hollek: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Eilit an ere evit ranna\xF1 ho restr
copyLinkButton = Eila\xF1 an ere
downloadTitle = Pellgarga\xF1 ar restro\xF9
downloadDescription = Dre { -send-brand } eo bet rannet ar restr-ma\xF1, gant un enrinega\xF1 penn-ouzh-penn hag un ere a ziamzer ent emgefreek.
trySendDescription = Esaeit { -send-brand } evit ranna\xF1 restro\xF9 en un doare eeun ha prevez.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] N'haller pellgas nemet { $count } restr er memes mare.
        [two] N'haller pellgas nemet { $count } restr er memes mare.
        [few] N'haller pellgas nemet { $count } restr er memes mare.
        [many] N'haller pellgas nemet { $count } a restro\xF9 er memes mare.
       *[other] N'haller pellgas nemet { $count } restr er memes mare.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Aotreet eo{ $count } diell nemetken.
        [two] Aotreet eo{ $count } ziell nemetken.
        [few] Aotreet eo{ $count } diell nemetken.
        [many] Aotreet eo{ $count } a ziello\xF9 nemetken.
       *[other] Aotreet eo{ $count } diell nemetken.
    }
expiredTitle = Diamzeret eo an ere.
notSupportedDescription = { -send-brand } n'aio ket en-dro war ar merdeer-ma\xF1. { -send-short-brand } a za en-dro gwelloc'h gant handelv diwezha\xF1 { -firefox }, ha mont a raio en-dro gant handelv bremanel lodenn vrasa\xF1 ar merdeerio\xF9.
downloadFirefox = Pellgarga\xF1 { -firefox }
legalTitle = Evezhiadenn a fed buhez prevez { -send-short-brand }
legalDateStamp = Handelv 1.0, d'an 12 a viz Meurzh 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }e { $minutes }m
addFilesButton = Diuzit ur restr da bellgas
uploadButton = Pellgas
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Riklit ha laoskit restro\xF9
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = pe klikit evit kas betek { $size }
addPassword = Gwarezi\xF1 gant ur ger-tremen
emailPlaceholder = Enankit ho chomlec'h postel
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Kennaskit evit kas betek { $size }
signInOnlyButton = Kennaska\xF1
accountBenefitTitle = Krouit ur gont { -firefox } pe kennaskit
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Rannit restro\xF9 betek { $size }
accountBenefitDownloadCount = Rannit restro\xF9 gant muioc'h a dud
accountBenefitTimeLimit =
    { $count ->
        [one] Dalc'hit an ereo\xF9 oberiant e-pad { $count } devezh
        [two] Dalc'hit an ereo\xF9 oberiant e-pad { $count } zevezh
        [few] Dalc'hit an ereo\xF9 oberiant e-pad { $count } devezh
        [many] Dalc'hit an ereo\xF9 oberiant e-pad { $count } a zevezhio\xF9
       *[other] Dalc'hit an ereo\xF9 oberiant e-pad { $count } devezh
    }
accountBenefitSync = Merit ar restro\xF9 rannet gant forzh peseurt trevnad
accountBenefitMoz = Gouzout hiroc'h a-zivout gwazerezhio\xF9 all { -mozilla }
signOut = Digennaska\xF1
okButton = Mat eo
downloadingTitle = O pellgarga\xF1
noStreamsWarning = Posupl eo ne vefe ket gouest ar merdeer-ma\xF1 da ezrinega\xF1 ur restr ken bras.
noStreamsOptionCopy = Eilit an ere evit digeri\xF1 anezha\xF1 en ur merdeer all
noStreamsOptionFirefox = Esaeit hor merdeer kareta\xF1
noStreamsOptionDownload = Kenderc'hel gant ar merdeer-ma\xF1
downloadFirefoxPromo = { -send-short-brand } a zo kinniget deoc'h gant ar { -firefox } nevez-flamm.
# the next line after the colon contains a file name
shareLinkDescription = Rannit an ere etrezek ho restr:
shareLinkButton = Ranna\xF1 an ere
# $name is the name of the file
shareMessage = Pellgarga\xF1 "{ $name }" gant { -send-brand }: ranna\xF1 restro\xF9 en un doare eeun ha prevez
trailheadPromo = Un doare a zo da warezi\xF1 ho puhez prevez. Tremenit da Firefox.
learnMore = Gouzout hiroc'h.
`;
export {
  br_default as default
};
//# sourceMappingURL=br-IVVK33XK.js.map
