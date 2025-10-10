import"./chunk.E3IN6YWE.js";var e=`title = Go Send
importingFile = Importimine...
encryptingFile = Kr\xFCptimine\u2026
decryptingFile = Dekr\xFCptimine...
downloadCount =
    { $num ->
        [one] \xFCht allalaadimist
       *[other] { $num } allalaadimist
    }
timespanHours =
    { $num ->
        [one] 1 tunni
       *[other] { $num } tunni
    }
copiedUrl = Kopeeritud!
unlockInputPlaceholder = Parool
unlockButtonLabel = Ava
downloadButtonLabel = Laadi alla
downloadFinish = Allalaadimine l\xF5petati
fileSizeProgress = ({ $partialSize }/{ $totalSize })
sendYourFilesLink = Proovi Send'i
errorPageHeader = Midagi l\xE4ks valesti!
fileTooBig = Fail on \xFCleslaadimiseks liiga suur. See peaks olema v\xE4iksem kui { $size }.
linkExpiredAlt = Link on aegunud
notSupportedHeader = Sinu brauser pole toetatud.
notSupportedLink = Miks mu brauser toetatud pole?
notSupportedOutdatedDetail = Kahjuks ei toeta see Firefoxi versioon veebitehnoloogiaid, mis teevad Sendi toimimise v\xF5imalikuks. Sa pead oma brauserit uuendama.
updateFirefox = Uuenda Firefox
deletePopupCancel = Loobu
deleteButtonHover = Kustuta
passwordTryAgain = Vale parool. Palun proovi uuesti.
javascriptRequired = Send'i kasutamiseks tuleb JavaScript lubada
whyJavascript = Miks Send JavaScripti vajab?
enableJavascript = Palun luba JavaScript ja proovi uuesti.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }t { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimaalne parooli pikkus: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Parooli muutmine eba\xF5nnestus

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Lihtne ja privaatne failijagamine
introDescription = { -send-brand } v\xF5imaldab sul faile jagada otspunktkr\xFCpteerimise ning automaatselt aeguva lingiga. Nii saad jagatava privaatsena hoida ja kindlustada, et su asjad igavesti internetti vedelema ei j\xE4\xE4.
notifyUploadEncryptDone = Sinu fail on kr\xFCptitud ja saatmiseks valmis
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Aegub peale { $downloadCount } v\xF5i { $timespan } j\xE4rel
timespanMinutes =
    { $num ->
        [one] 1 minuti
       *[other] { $num } minuti
    }
timespanDays =
    { $num ->
        [one] 1 p\xE4eva
       *[other] { $num } p\xE4eva
    }
timespanWeeks =
    { $num ->
        [one] 1 n\xE4dala
       *[other] { $num } n\xE4dala
    }
fileCount =
    { $num ->
        [one] 1 fail
       *[other] { $num } faili
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
totalSize = Kogusuurus: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Faili jagamiseks kopeeri link:
copyLinkButton = Kopeeri link
downloadTitle = Failide allalaadimine
downloadDescription = See fail jagati teenuse { -send-brand } kaudu otspunktkr\xFCpteeritult ja automaatselt aeguva lingiga.
trySendDescription = Proovi lihtsaks ja turvaliseks failijagamiseks { -send-brand } teenust.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Korraga saab \xFCles laadida vaid 1 faili.
       *[other] Korraga saab \xFCles laadida vaid { $count } faili.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Vaid 1 arhiveerimine on lubatud.
       *[other] Vaid { $count } arhiveerimist on lubatud.
    }
expiredTitle = Link on aegunud.
notSupportedDescription = { -send-brand } ei t\xF6\xF6ta selle veebilehitsejaga. K\xF5ige paremini t\xF6\xF6tab { -send-short-brand } uusima { -firefox }iga ja t\xF6\xF6tab ka enamikes teistes uuendatud brauserites.
downloadFirefox = Laadi { -firefox } alla
legalTitle = { -send-short-brand } privaatsusteade
legalDateStamp = Versioon 1.0, alates 12. m\xE4rts 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }p { $hours }t { $minutes }m
addFilesButton = Vali failid \xFCleslaadimiseks
uploadButton = Laadi \xFCles
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Lohista failid siia
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = v\xF5i kl\xF5psa kuni { $size } suuruste failide saatmiseks
addPassword = Kaitse parooliga
emailPlaceholder = Sisesta e-posti aadress
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Logi sisse ning saad saata kuni { $size } suuruseid faile
signInOnlyButton = Logi sisse
accountBenefitTitle = Loo { -firefox }i konto v\xF5i logi sisse
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Jaga kuni { $size } suuruseid faile
accountBenefitDownloadCount = Jaga faile enamate inimestega
accountBenefitTimeLimit =
    { $count ->
        [one] Hoia linke aktiivsena 1 p\xE4ev
       *[other] Hoia linke aktiivsena kuni { $count } p\xE4eva
    }
accountBenefitSync = Jagatud faile saad hallata mis tahes seadmes
accountBenefitMoz = Rohkem teavet teistest { -mozilla } teenustest
signOut = Logi v\xE4lja
okButton = Olgu
downloadingTitle = Allalaadimine
noStreamsWarning = Sinu veebilehitseja ei pruugi suuta nii suurt faili dekr\xFCptida.
noStreamsOptionCopy = Kopeeri link teises brauseris avamiseks
noStreamsOptionFirefox = Proovi meie lemmikbrauserit
noStreamsOptionDownload = J\xE4tka selle brauseriga
downloadFirefoxPromo = { -send-short-brand } toob sinuni uhiuus { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Jaga linki failile:
shareLinkButton = Jaga linki
# $name is the name of the file
shareMessage = Laadi \u201C{ $name }\u201D alla teenusega { -send-brand }, mis pakub lihtsat ja turvalist failijagamist
trailheadPromo = Oma privaatsust on v\xF5imalik kaitsta. Liitu Firefoxiga.
learnMore = Rohkem teavet.
`;export{e as default};
