// locales/sk.ftl
var sk_default = `title = Go Send
importingFile = Importuje sa\u2026
encryptingFile = \u0160ifruje sa\u2026
decryptingFile = De\u0161ifruje sa\u2026
downloadCount =
    { $num ->
        [one] 1 prevzat\xED
        [few] { $num } prevzatiach
       *[other] { $num } prevzatiach
    }
timespanHours =
    { $num ->
        [one] 1 hodine
        [few] { $num } hodin\xE1ch
       *[other] { $num } hodin\xE1ch
    }
copiedUrl = Skop\xEDrovan\xE9!
unlockInputPlaceholder = Heslo
unlockButtonLabel = Odomkn\xFA\u0165
downloadButtonLabel = Prevzia\u0165
downloadFinish = Preberanie bolo dokon\u010Den\xE9
fileSizeProgress = ({ $partialSize } z { $totalSize })
sendYourFilesLink = Vysk\xFA\u0161ajte Send
errorPageHeader = Vyskytol sa probl\xE9m.
fileTooBig = S\xFAbor je pr\xEDli\u0161 ve\u013Ek\xFD. Mal by by\u0165 men\u0161\xED ne\u017E { $size }.
linkExpiredAlt = Platnos\u0165 odkazu vypr\u0161ala
notSupportedHeader = V\xE1\u0161 prehliada\u010D nie je podporovan\xFD.
notSupportedLink = Pre\u010Do nie je m\xF4j prehliada\u010D podporovan\xFD?
notSupportedOutdatedDetail = \u017Dia\u013E, t\xE1to verzia Firefoxu nepodporuje webov\xFA technol\xF3giu, ktor\xE1 poh\xE1\u0148a Send. Budete musie\u0165 aktualizova\u0165 svoj prehliada\u010D.
updateFirefox = Aktualizova\u0165 Firefox
deletePopupCancel = Zru\u0161i\u0165
deleteButtonHover = Odstr\xE1ni\u0165
passwordTryAgain = Nespr\xE1vne heslo. Sk\xFAste to znova.
javascriptRequired = Send vy\u017Eaduje JavaScript
whyJavascript = Pre\u010Do Send vy\u017Eaduje JavaScript?
enableJavascript = Pros\xEDm, povo\u013Ete JavaScript a sk\xFAste to znova.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } hod. { $minutes } min.
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } min.
# A short status message shown when the user enters a long password
maxPasswordLength = Maxim\xE1lna d\u013A\u017Eka hesla: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Heslo ne\u0161lo nastavi\u0165

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Jednoduch\xE9 a s\xFAkromn\xE9 zdie\u013Eanie s\xFAborov
introDescription = S { -send-brand(case: "ins") } s\xFA zdie\u013Ean\xE9 s\xFAbory \u0161ifrovan\xE9 end-to-end, tak\u017Ee ani my nevieme, \u010Do zdie\u013Eate. Platnos\u0165 odkazu je navy\u0161e obmedzen\xE1. S\xFAbory tak m\xF4\u017Eete zdie\u013Ea\u0165 s\xFAkromne a s istotou, \u017Ee neostan\xFA na internete naveky.
notifyUploadEncryptDone = V\xE1\u0161 s\xFAbor je za\u0161ifrovan\xFD a pripraven\xFD na odoslanie
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Platnos\u0165 odkazu vypr\u0161\xED po { $downloadCount } alebo po { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 min\xFAte
        [few] { $num } min\xFAtach
       *[other] { $num } min\xFAtach
    }
timespanDays =
    { $num ->
        [one] 1 dni
        [few] { $num } d\u0148och
       *[other] { $num } d\u0148och
    }
timespanWeeks =
    { $num ->
        [one] 1 t\xFD\u017Edni
        [few] { $num } t\xFD\u017Ed\u0148och
       *[other] { $num } t\xFD\u017Ed\u0148och
    }
fileCount =
    { $num ->
        [one] 1 s\xFAbor
        [few] { $num } s\xFAbory
       *[other] { $num } s\xFAborov
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
fileSize = { $num } { $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Celkov\xE1 ve\u013Ekos\u0165: { $size }
# the next line after the colon contains a file name
copyLinkDescription = S\xFAbor m\xF4\u017Eete zdie\u013Ea\u0165 pomocou tohto odkazu:
copyLinkButton = Kop\xEDrova\u0165 odkaz
downloadTitle = Prevzia\u0165 s\xFAbory
downloadDescription = Tento s\xFAbor bol zdie\u013Ean\xFD prostredn\xEDctvom slu\u017Eby { -send-brand }, ktor\xE1 poskytuje end-to-end \u0161ifrovanie a odkazy s obmedzenou platnos\u0165ou.
trySendDescription = Vysk\xFA\u0161ajte jednoduch\xE9 a bezpe\u010Dn\xE9 zdie\u013Eanie s\xFAborov so slu\u017Ebou { -send-brand }
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Naraz mo\u017Eno nahr\xE1va\u0165 len 1 s\xFAbor.
        [few] Naraz mo\u017Eno nahr\xE1va\u0165 len { $count } s\xFAbory.
       *[other] Naraz mo\u017Eno nahr\xE1va\u0165 len { $count } s\xFAborov.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Povolen\xFD je najviac 1 arch\xEDv.
        [few] Povolen\xE9 s\xFA najviac { $count } arch\xEDvy.
       *[other] Povolen\xFDch je najviac { $count } arch\xEDvov.
    }
expiredTitle = Platnos\u0165 odkazu vypr\u0161ala.
notSupportedDescription = { -send-brand } nebude v tomto prehliada\u010Di fungova\u0165. { -send-short-brand } najlep\u0161ie funguje v najnov\u0161ej verzii { -firefox(case: "gen") } alebo aktu\xE1lnych verzi\xE1ch najpou\u017E\xEDvanej\u0161\xEDch prehliada\u010Dov.
downloadFirefox = Prevzia\u0165 { -firefox }
legalTitle = Z\xE1sady ochrany s\xFAkromia slu\u017Eby { -send-short-brand }
legalDateStamp = Verzia 1.0, z 12. marca 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } d { $hours } h { $minutes } min
addFilesButton = Vyberte s\xFAbory pre nahratie
uploadButton = Nahra\u0165
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Pretiahnut\xEDm s\xFAboru alebo kliknut\xEDm sem
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = m\xF4\u017Eete posla\u0165 a\u017E { $size }
addPassword = Chr\xE1ni\u0165 heslom
emailPlaceholder = Zadajte e-mailov\xFA adresu
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Pre odoslanie s\xFAborov s ve\u013Ekos\u0165ou a\u017E { $size }, sa, pros\xEDm, prihl\xE1ste
signInOnlyButton = Prihl\xE1si\u0165 sa
accountBenefitTitle = Vytvorte si \xFA\u010Det { -firefox } alebo sa prihl\xE1ste
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Zdie\u013Eanie s\xFAborov s ve\u013Ekos\u0165ou a\u017E { $size }
accountBenefitDownloadCount = Zdie\u013Eanie s\xFAborov s viacer\xFDmi \u013Eu\u010Fmi
accountBenefitTimeLimit =
    { $count ->
        [one] Odkazy platn\xE9 a\u017E 1 de\u0148
        [few] Odkazy platn\xE9 a\u017E { $count } dni
       *[other] Odkazy platn\xE9 a\u017E { $count } dn\xED
    }
accountBenefitSync = Spr\xE1va zdie\u013Ean\xFDch s\xFAborov z ak\xE9hoko\u013Evek zariadenia
accountBenefitMoz = \u010Eal\u0161ie inform\xE1cie o \u010Fal\u0161\xEDch slu\u017Eb\xE1ch od { -mozilla(case: "gen") }
signOut = Odhl\xE1si\u0165 sa
okButton = OK
downloadingTitle = Preber\xE1 sa
noStreamsWarning = Tento prehliada\u010D nemus\xED by\u0165 schopn\xFD de\u0161ifrova\u0165 takto ve\u013Ek\xFD s\xFAbor.
noStreamsOptionCopy = Skop\xEDrova\u0165 odkaz pre otvorenie v inom prehliada\u010Di
noStreamsOptionFirefox = Vysk\xFA\u0161ajte n\xE1\u0161 ob\u013E\xFAben\xFD prehliada\u010D
noStreamsOptionDownload = Pokra\u010Dova\u0165 v tomto prehliada\u010Di
downloadFirefoxPromo = { -send-short-brand } v\xE1m prin\xE1\u0161a najnov\u0161\xED { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Zdie\u013Eajte odkaz na s\xFAbor:
shareLinkButton = Zdie\u013Ea\u0165 odkaz
# $name is the name of the file
shareMessage = Prevezmite si s\xFAbor \u201E{ $name }\u201C so slu\u017Ebou { -send-brand } - jednoduch\xE9 a bezpe\u010Dn\xE9 zdie\u013Eanie s\xFAborov
trailheadPromo = Existuje sp\xF4sob, ako chr\xE1ni\u0165 va\u0161e s\xFAkromie. Prihl\xE1ste sa do Firefoxu.
learnMore = \u010Eal\u0161ie inform\xE1cie.
`;
export {
  sk_default as default
};
//# sourceMappingURL=sk-OZRFOL3K.js.map
