import "./chunk-IFG75HHC.js";

// locales/meh.ftl
var meh_default = `title = Go Send
importingFile = Nasia\xB4a\u2026
encryptingFile = Encriptando...
decryptingFile = Desencriptando\u2026
downloadCount =
    { $num ->
       *[other] { $num } nxinuun
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } horas
    }
copiedUrl = Nt\u0268\u0268n
unlockInputPlaceholder = Contrase\xF1a
unlockButtonLabel = Nkas\u0268
downloadButtonLabel = Xinuu
downloadFinish = Nn\u0268\xB4\u0268 xinuu
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Ni\xB4i Send
errorPageHeader = \xA1Iyo iin ntu nkene va\xB4a!
fileTooBig = Archivo ya\xB4a ka\xB4nu. Nejia chunku\xB4va { $size }
linkExpiredAlt = Nn\u0268\xB4\u0268 enlace
notSupportedHeader = Ntu \xEDyo ti\xF1u nuu ka\u0331a\u0331 n\xE1nuku ya\xB4a.
notSupportedLink = \xBFNavi ntu sati\xF1u nuu ka\u0331a\u0331 n\xE1nuku ya\xB4a?
notSupportedOutdatedDetail = Tuni Firefox ya\xB4a ntu sati\xF1u vii jii Send. Nejika xinunu a j\xED\xEDa ka\u0331a\u0331 n\xE1nuku.
updateFirefox = Naxi\xB4\xF1\xE1 Firefox
deletePopupCancel = Nkuvi-ka
deleteButtonHover = Xita
passwordTryAgain = Contrase\xF1a ntu vatu. Nachu\xB4un tuku.
javascriptRequired = Send ni\xB4i JavaScript
whyJavascript = \xBFNavi Send ni\xB4i JavaScript?
enableJavascript = Kua\xB4a jia\xB4a JavaScript jee nachu\xB4un tuku.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Naja ka\xB4nu koo contrase\xF1a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Ntu nkuvi s\xE1\xB4\xE1 contrase\xF1a

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Kua\xB4a daa archivo \xF1ama jee yu\xB4u
introDescription = { -send-brand } taji jia\xB4anu archivos jii cifrado uvi nuu jee iin enlace n\u0268\xB4\u0268. Sukuan kuvi kumi yu\xB4unu daa archivo jia\xB4anu jee kuninu nkino daa ya\xB4a kue\xB4e kuiya \xEDchi nuu.
notifyUploadEncryptDone = Archivo noo\xB4o \xEDyo cifrado jee kuvi chu\xB4un \xEDchi
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = N\u0268'\u0268 dee n\xF1a\xB4a { $downloadCount } a xiin { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minuto
       *[other] { $num } minutos
    }
timespanDays =
    { $num ->
        [one] 1 d\xEDa
       *[other] { $num } d\xEDas
    }
timespanWeeks =
    { $num ->
        [one] 1 semana
       *[other] { $num } semanas
    }
fileCount =
    { $num ->
        [one] 1 archivo
       *[other] { $num } archivos
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
totalSize = Ka\xB4nu: { $size }
# the next line after the colon contains a file name
copyLinkDescription = T\u0268\u0268n enlace jee kua\xB4a archivo:
copyLinkButton = T\u0268\u0268n enlacae
downloadTitle = Xinuu archivo
downloadDescription = Archivo ya\xB4a nsajia { -send-brand } j\xED\xED cifrado punto a punto jee iin enlace naa.
trySendDescription = Nas\xE1\xB4\xE1 jii { -send-brand } kua\xB4a \xF1ama jee vatu.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Ntuxini 1 archivo kuvi ska.
       *[other] Ntuxini { $count } archivos kuvi ska.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Ntu xini 1 archivo \xEDyo
       *[other] Ntu xini { $count } archivos \xEDyo
    }
expiredTitle = Nn\u0268'\u0268 link ya\xB4a.
notSupportedDescription = { -send-brand } nsati\xF1u jii ka\u0331a\u0331 n\xE1nuku ya\xB4a. { -send-short-brand } sati\xF1u va\xB4a jii tuni \xEDchi yata { -firefox }, jee sati\xF1u va\xB4a jii tuni \xEDyo nta\xF1u\xB4u kuaiyo daa ka\u0331a\u0331 n\xE1nuku.
downloadFirefox = Xinuun { -firefox }
legalTitle = Tu\xB4un xitu a kumiji noo\xB4o { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0 del 12 de marzo de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Kaji archivos ska
uploadButton = Ska
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Staka jee s\xEDa  daa archivo
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = a xiin kuaxin saa chu\xB4un \xEDchi nee { $size }
addPassword = Iyo yu\xB4u jii contrase\xF1a
emailPlaceholder = Chu\xB4un email noo\xB4o
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Kajie\xB4e sesi\xF3n saa chu\xB4un \xEDchi nee { $size }
signInOnlyButton = Kajie\xB4e sesi\xF3n
accountBenefitTitle = S\xE1\xB4\xE1 iin cuenta { -firefox } a xiin kajie\xB4e sesi\xF3n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Kua\xB4a archivo ka\xB4nu { $size }
accountBenefitDownloadCount = Kua\xB4a archivos jii inka \xF1iv\u0268
accountBenefitTimeLimit =
    { $count ->
        [one] Kuteku enlaces 1 kiv\u0268
       *[other] Kuteku daa enlaces { $count } kiv\u0268
    }
accountBenefitSync = Teti\xF1u archivos jia\xB4anu ntaka ka\u0331a\u0331
accountBenefitMoz = Ka\xB4vi kue\xB4eka jiee inka ti\xF1u { -mozilla }
signOut = Kas\u0268 sesi\xF3n
okButton = Kuvi
downloadingTitle = Xinuu
noStreamsWarning = Kuvi ka\u0331a\u0331 n\xE1naku ya\xB4a nxituvi a vaji nuu iin archivo ka\xB4nu.
noStreamsOptionCopy = T\u0268\u0268n enlace jee s\xEDne nuu inka ka\u0331a\u0331 n\xE1nuku
noStreamsOptionFirefox = Ni\xB4i ka\u0331a\u0331 n\xE1nuku va\xB4a
noStreamsOptionDownload = Kaka jii ka\u0331a\u0331 n\xE1nuku ya\xB4a
downloadFirefoxPromo = { -send-short-brand } taji j\xED\xEDa { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Kua\xB4a enlace archivo noo\xB4o
shareLinkButton = Kua\xB4a link
# $name is the name of the file
shareMessage = Xinuu \u201C{ $name }\u201D jii { -send-brand }: ntu viji
trailheadPromo = Iyo iin kuvi kumi privacidad noo\xB4o. Nayonika Firefox.
learnMore = Ka\xB4vi kue\xB4eka

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
  meh_default as default
};
//# sourceMappingURL=meh-4RQCOCAF.js.map
