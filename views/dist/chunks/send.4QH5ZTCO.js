import"./chunk.E3IN6YWE.js";var n=`title = Go Send
importingFile = Ndakiin\u2026
encryptingFile = Ndasami tu'un\u2026
decryptingFile = Nchiko tu'un\u2026
downloadCount =
    { $num ->
        [one] 1 snu\xFA
       *[other] { $num } snu\xFA
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } horas
    }
copiedUrl = \xA1Tsa ndatavi \xF1a!
unlockInputPlaceholder = Tu'un se\xE8
unlockButtonLabel = Kuna
downloadButtonLabel = Snu\xF9
downloadFinish = Ntsinu snui
fileSizeProgress = ({ $partialSize } \xF1a { $totalSize })
sendYourFilesLink = Kuachu'un Send
errorPageHeader = \xA1Yee \xF1a va'a!
fileTooBig = Kanu tutu yo. Tsini \xF1u'u koi tana { $size }.
linkExpiredAlt = Ntoo enlace
notSupportedHeader = Kue ku kuni p\xE1gina.
notSupportedLink = \xBFChanu kue ku kuncheu\xF1a?
notSupportedOutdatedDetail = Firefox kue ku kuni p\xE1gina web takua kuachu'un Send. tsini\xF1u'u ndu tsa'a navegador.
updateFirefox = Ndu tsa'a Firefox
deletePopupCancel = Kunchatu
deleteButtonHover = Sto\xF2
passwordTryAgain = Kue vaa ni chau sivi siki. Chai tuku.
javascriptRequired = Send tsini\xF1ui JavaScript
whyJavascript = \xBFChanu Send tsini\xF1ui JavaScript?
enableJavascript = Sa\xE1 \xF1a mani katsi JavaScript ch\xE1 kitsa tuku.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Kua tu'un see: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Ma ku ntanii tu'un see

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Stucha kue tutu ku
introDescription = { -send-brand } ku stuchaku tutu se\xE9 tsi inkana tsi iin enlace \xF1a nt\xF3o mituin. Sa'an ku kunka va'a \xF1a stuchaku cha ma ku kunchee na kue tutu ku.
notifyUploadEncryptDone = Tsa inka va'a tutu ku tsa ku stuchaku \xF1a
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Ku kunkai mancha { $downloadCount } a { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minuto
       *[other] { $num } minutos
    }
timespanDays =
    { $num ->
        [one] 1 kii
       *[other] { $num } kii
    }
timespanWeeks =
    { $num ->
        [one] 1 semana
       *[other] { $num } semanas
    }
fileCount =
    { $num ->
        [one] 1 tutu
       *[other] { $num } tutu
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
totalSize = Kua: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Ndatava enlace takua stuchaku tut\xFA.
copyLinkButton = Ndatava enlace
downloadTitle = Snu\xFA tutu
downloadDescription = Tutu yo stuchaku \xF1a tsi { -send-brand } inka si'i ch\xE1 ku nto'o mituin.
trySendDescription = Kuachu'un { -send-brand } takua stuchaku nchi tutu niku
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Ku skau 1 tutu ni.
       *[other] Mitu'un { $count }tutu ku skau.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] 1 tutu ni ku.
       *[other] Mitu'un { $count } tutu ni ku.
    }
expiredTitle = Koo enlace inka
notSupportedDescription = { -send-brand } ma ku Kuachu'un navegador yo. { -send-short-brand } Sachu'in va'a la  versi\xF3n da ntii { -firefox }, sachu'un tsi  versi\xF3n tsa'a su inka kue navegador.
downloadFirefox = Snu\xFA { -firefox }
legalTitle = Tu'un privacidad { -send-short-brand }
legalDateStamp = Versi\xF3n 1.0 del 12 de marzo de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Katsi tutu ku skau
uploadButton = Skaa
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Xita cha sia kue tutu
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = katavi takua stuchaku \xF1a mancha { $size }
addPassword = Inka vai tsi tu'un se\xE9
emailPlaceholder = Chaa korreo ku
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = kitsa takua kuachu'una mancha { $size }
signInOnlyButton = Kitsaa
accountBenefitTitle = Saa iin kuenta \xF1a { -firefox } a kitsa
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Stucha tutu mancha { $size }
accountBenefitDownloadCount = Stucha tutu tsi kuaka nivi
accountBenefitTimeLimit =
    { $count ->
        [one] Ku kunka tutu ku mancha 1 kii
       *[other] Ku kunka tutu ku mancha { $count } kii
    }
accountBenefitSync = Stucha tutu ts\xED nchi kaa ndusu niku
accountBenefitMoz = Kavi tut\xFA tsa { -mozilla }
signOut = Kee
okButton = Va\xE1
downloadingTitle = Snu\xEC
noStreamsWarning = Ku \xF1a navegador yo ma ku mini iin tut\xFA kanu.
noStreamsOptionCopy = Ndatava enlace takua kunu ts\xED inka navegador
noStreamsOptionFirefox = Kuachu'un navegador \xF1a va'a nu ntia
noStreamsOptionDownload = Kunka tsi navegador yo
downloadFirefoxPromo = { -send-short-brand } snai \xF1a tsaa { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Stucha enlace tutu ku:
shareLinkButton = Stucha Enlace
# $name is the name of the file
shareMessage = Snuu \xAB{ $name }\xBB tsi { -send-brand }: kue nchichi
trailheadPromo = Ku china vau \xF1a chau. Kita'an tsi Firefox.
learnMore = Skua'a kuakaa.
`;export{n as default};
