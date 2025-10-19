import "./chunk-IFG75HHC.js";

// locales/hus.ftl
var hus_default = `title = Go Send
importingFile = k'wajat i chiy\xE1l...
encryptingFile = K'wajat i tsinat dhey\xE1l...
decryptingFile = K'wajat i exal ki wila'...
downloadCount =
    { $num ->
       *[other] 1 pa'badh { $num } pa'badh
    }
timespanHours =
    { $num ->
       *[other] 1 hora { $num } hora
    }
copiedUrl = Letsbadh...
unlockInputPlaceholder = Tsinat japixtal
unlockButtonLabel = Ka japiy
downloadButtonLabel = Ka pa'ba'
downloadFinish = Tala' pa'iyits
fileSizeProgress = { $partialSize } xi ti { $totalSize }
sendYourFilesLink = Ka eyendha' Send
errorPageHeader = \xA1Yab kalej alwa'!
fileTooBig = Tekedh pulik axi a le' ka kadh'ba', kwa'al kin alemna' { $size }
linkExpiredAlt = Yabats u awil ki ela'
notSupportedHeader = Yab u awil ka japiyat k'al axi NAVEGADOR
notSupportedLink = \xBFJale' ti u NAVEGADOR yab in japiyal?
notSupportedOutdatedDetail = Yab u awil ka eyendha' Send kom an NAVEGADOR Firefox biyalits. Ka Pa'ba' axi it.
updateFirefox = Ka itmedha' Firefox
deletePopupCancel = Ka kuba'
deleteButtonHover = Ka pakuw
passwordTryAgain = Yab ja' an tsinat japixtal\xE1b. Ka exa' junil.
javascriptRequired = Send in yejenchal JavaScript
whyJavascript = \xBFJale' Send in yejenchal JavaScript?
enableJavascript = Ka lek'wtsiy JavaScript ani ka exa' junil.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = In puw\xE9l an tsinat japixtal\xE1b pel: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Axi tsinat japixtal\xE1b yab u awil ka eyendha'

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Yab k'ibat, a tsinat t'ojlabil u awil ka buk'uw
introDescription = { -send-brand } in t'aj\xE1l abal ka buk'uw a t'ojlabil po ax\xE9' tsinat abal an atikl\xE1b axi tat yab a le' kin tsu'uw yab kin ejtow, aniyej an enlace abal ka pa'ba' an t'ojl\xE1b u tal\xE9l kwet\xE9m. Antsan patal axi ka abna' u awil ka buk'uw tsinat ani antsan jayej axi ka buk'uw yab u jilk'onal ets'ey ti \xE9btsolom (internet).
notifyUploadEncryptDone = A t'ojlabil xo' tsinadhits ani u awilits ka abna'
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Ne'ets ka taliy ti { $downloadCount } o ti { $timespan }
timespanMinutes =
    { $num ->
       *[other] 1 minuto { $num }
    }
timespanDays =
    { $num ->
       *[other] 1 k'ich\xE1j { $num } k'ichajchik
    }
timespanWeeks =
    { $num ->
       *[other] 1 semana { $num } i semanachik
    }
fileCount =
    { $num ->
       *[other] 1 t'ojl\xE1b { $num } t'ojlabchik
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
totalSize = In puw\xE9l an t'ojl\xE1b: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Ka k'ot'biy an enlace abal ka ejtow ka buk'uw a t'ojlabil:
copyLinkButton = ka k'ot'biy an enlace
downloadTitle = Ka pa'ba' an t'ojl\xE1b
downloadDescription = Axi t'ojl\xE1b aban k'al in tolmixtal an { -send-brand } ani tsinat, aniyej in tsap an enlace u tal\xE9l kwet\xE9m.
trySendDescription = Ka eyendha' { -send-brand } abal ka abna' a t'ojlabil, yab k'ibat ani k'anidh.
# count will always be > 10
tooManyFiles =
    { $count ->
       *[other]
            Expidh u awil ka k'adhba' 1 i t'ojl\xE1b
            Expidh u awil ka k'adhba' { $count } i t'ojl\xE1b.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
       *[other]
            Expidh u awil 1 i t'ojl\xE1b.
            Expidh u awil { $count } i t'ojl\xE1b.
    }
expiredTitle = An enlace tal\xEDts in tsap.
notSupportedDescription = { -send-brand } yab u t'ojnal al axi navegador. { -send-short-brand } u t'ojnal alwa' k'al an { -firefox } axi it, ani ne'ets ka t'ojon alwa' k'al an it navegadorchik.
downloadFirefox = Ka pa'ba' { -firefox }
legalTitle = Tin kwentaj an "Tsinaxtal\xE1b a k'al" { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0 ani t'ajadh ti Marzo 12 ti tamub 2019.
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } k'ich\xE1j { $hours } hora { $minutes } minuto
addFilesButton = Ka takuy an t'ojl\xE1b axi ne'ets ka k'adhba'
uploadButton = Ka k'adhba'
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Ka kina' a t'ojlabil ani ka walka' te'
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o ka t'aja' an clic abal ka abna' ma { $size }
addPassword = Ka k'aniy k'al j\xFAn i tsinat japixtal\xE1b
emailPlaceholder = Ka punuw a abnax dhuchlab Correo Electr\xF3nico.
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Kit otsits abal ka ejtow ka abna' ma { $size }
signInOnlyButton = Kit otsits
accountBenefitTitle = Ka ts'ejka' j\xFAn a it k'al (cuenta) { -firefox } o kit otsits max a kwa'alits j\xFAn.
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Ka buk'uw a t'ojlabil, ma { $size }
accountBenefitDownloadCount = Ka buk'uw a t'ojlabil k'al pil i atiklabchik
accountBenefitTimeLimit =
    { $count ->
       *[other]
            Ka ko'oy an enlace ma 1 a k'ich\xE1j
            Ka ko'oy an enlacechik ma { $count } a k'ich\xE1hchik
    }
accountBenefitSync = Ka ejtow tit t'ojnal k'al t'ojlabil al jawakitsk'ij tum eyendhabn\xE9l
accountBenefitMoz = Ka exla' jant'oj ti pidh\xE1l { -mozilla }
signOut = Kit kalej
okButton = Ka bats'uw
downloadingTitle = K'wajat ti pa'\xEDl
noStreamsWarning = Wal\xE1m axi navegador yab ne'ets kin ejtow kin japiy j\xFAn i t'ojl\xE1b tekedh pulik.
noStreamsOptionCopy = Ka k'ot'biy an enlace abal ka japiy al pil i navegador
noStreamsOptionFirefox = Ka eyendha' i navegador
noStreamsOptionDownload = yab kit kalej al axi navegador
downloadFirefoxPromo = An it { -firefox } ti pidh\xE1l { -send-short-brand }
# the next line after the colon contains a file name
shareLinkDescription = Ka abna' an enlace al an eyendhan\xE9l:
shareLinkButton = Ka abna' an enlace
# $name is the name of the file
shareMessage = Ka pa'ba' \u201C{ $name }\u201D k'al { -send-brand }: ka abna' a t'ojlabil, yab k'ibat ani k'anidh
trailheadPromo = U awil ka k'aniy axi tat a k'al. Kit tamkun k'al Firefox.
learnMore = Ka ajiy m\xE1s.
`;
export {
  hus_default as default
};
//# sourceMappingURL=hus-UX2NXYSJ.js.map
