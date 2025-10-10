import"./chunk.E3IN6YWE.js";var n=`title = Go Send
importingFile = \u0110ang nh\u1EADp...
encryptingFile = \u0110ang m\xE3 h\xF3a...
decryptingFile = \u0110ang gi\u1EA3i m\xE3...
downloadCount =
    { $num ->
       *[other] { $num } l\u01B0\u1EE3t t\u1EA3i
    }
timespanHours =
    { $num ->
       *[other] { $num } gi\u1EDD
    }
copiedUrl = \u0110\xE3 sao ch\xE9p!
unlockInputPlaceholder = M\u1EADt kh\u1EA9u
unlockButtonLabel = M\u1EDF kh\xF3a
downloadButtonLabel = T\u1EA3i xu\u1ED1ng
downloadFinish = T\u1EA3i xu\u1ED1ng ho\xE0n t\u1EA5t
fileSizeProgress = ({ $partialSize } trong { $totalSize })
sendYourFilesLink = D\xF9ng th\u1EED Send
errorPageHeader = C\xF3 g\xEC \u0111\xF3 kh\xF4ng \u1ED5n!
fileTooBig = T\u1EADp tin n\xE0y qu\xE1 l\u1EDBn \u0111\u1EC3 t\u1EA3i l\xEAn. K\xEDch th\u01B0\u1EDBc t\u1EADp tin ph\u1EA3i nh\u1ECF h\u01A1n { $size }.
linkExpiredAlt = Li\xEAn k\u1EBFt \u0111\xE3 h\u1EBFt h\u1EA1n
notSupportedHeader = Tr\xECnh duy\u1EC7t c\u1EE7a b\u1EA1n kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3.
notSupportedLink = T\u1EA1i sao tr\xECnh duy\u1EC7t c\u1EE7a t\xF4i kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3?
notSupportedOutdatedDetail = Th\u1EADt kh\xF4ng may l\xE0 phi\xEAn b\u1EA3n Firefox n\xE0y kh\xF4ng h\u1ED7 tr\u1EE3 c\xF4ng ngh\u1EC7 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng trong Send. B\u1EA1n c\u1EA7n c\u1EADp nh\u1EADt tr\xECnh duy\u1EC7t c\u1EE7a b\u1EA1n.
updateFirefox = C\u1EADp nh\u1EADt Firefox
deletePopupCancel = H\u1EE7y b\u1ECF
deleteButtonHover = X\xF3a
passwordTryAgain = Sai m\u1EADt kh\u1EA9u. Vui l\xF2ng th\u1EED l\u1EA1i.
javascriptRequired = Send c\u1EA7n JavaScript
whyJavascript = T\u1EA1i sao Send c\u1EA7n JavaScript?
enableJavascript = Vui l\xF2ng k\xEDch ho\u1EA1t JavaScript v\xE0 th\u1EED l\u1EA1i.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } gi\u1EDD { $minutes } ph\xFAt
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } ph\xFAt
# A short status message shown when the user enters a long password
maxPasswordLength = \u0110\u1ED9 d\xE0i m\u1EADt kh\u1EA9u t\u1ED1i \u0111a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Kh\xF4ng th\u1EC3 \u0111\u1EB7t m\u1EADt kh\u1EA9u n\xE0y

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Chia s\u1EBB t\u1EADp tin \u0111\u01A1n gi\u1EA3n, ri\xEAng t\u01B0
introDescription = { -send-brand } cho ph\xE9p b\u1EA1n chia s\u1EBB c\xE1c t\u1EADp tin v\u1EDBi m\xE3 h\xF3a \u0111\u1EA7u cu\u1ED1i v\xE0 m\u1ED9t li\xEAn k\u1EBFt t\u1EF1 \u0111\u1ED9ng h\u1EBFt h\u1EA1n. V\xEC v\u1EADy, b\u1EA1n c\xF3 th\u1EC3 gi\u1EEF nh\u1EEFng g\xEC b\u1EA1n chia s\u1EBB ri\xEAng t\u01B0 v\xE0 \u0111\u1EA3m b\u1EA3o d\u1EEF li\u1EC7u c\u1EE7a b\u1EA1n kh\xF4ng tr\u1EF1c tuy\u1EBFn v\u0129nh vi\u1EC5n.
notifyUploadEncryptDone = T\u1EADp tin c\u1EE7a b\u1EA1n \u0111\u01B0\u1EE3c m\xE3 h\xF3a v\xE0 s\u1EB5n s\xE0ng \u0111\u1EC3 g\u1EEDi
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = H\u1EBFt h\u1EA1n sau { $downloadCount } ho\u1EB7c { $timespan }
timespanMinutes =
    { $num ->
       *[other] { $num } ph\xFAt
    }
timespanDays =
    { $num ->
       *[other] { $num } ng\xE0y
    }
timespanWeeks =
    { $num ->
       *[other] { $num } tu\u1EA7n
    }
fileCount =
    { $num ->
       *[other] { $num } t\u1EADp tin
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
totalSize = T\u1ED5ng k\xEDch th\u01B0\u1EDBc: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Sao ch\xE9p li\xEAn k\u1EBFt \u0111\u1EC3 chia s\u1EBB t\u1EADp tin c\u1EE7a b\u1EA1n:
copyLinkButton = Sao ch\xE9p li\xEAn k\u1EBFt
downloadTitle = T\u1EA3i xu\u1ED1ng t\u1EADp tin
downloadDescription = T\u1EADp tin n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c chia s\u1EBB qua { -send-brand } v\u1EDBi m\xE3 h\xF3a \u0111\u1EA7u cu\u1ED1i v\xE0 li\xEAn k\u1EBFt t\u1EF1 \u0111\u1ED9ng h\u1EBFt h\u1EA1n.
trySendDescription = H\xE3y th\u1EED { -send-brand } \u0111\u1EC3 chia s\u1EBB t\u1EADp tin \u0111\u01A1n gi\u1EA3n, an to\xE0n.
# count will always be > 10
tooManyFiles =
    { $count ->
       *[other] Ch\u1EC9 { $count } t\u1EADp tin c\xF3 th\u1EC3 t\u1EA3i l\xEAn m\u1ED7i l\u1EA7n.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
       *[other] Ch\u1EC9 cho ph\xE9p { $count } l\u01B0u tr\u1EEF.
    }
expiredTitle = Li\xEAn k\u1EBFt n\xE0y \u0111\xE3 h\u1EBFt h\u1EA1n.
notSupportedDescription = { -send-brand } s\u1EBD kh\xF4ng ho\u1EA1t \u0111\u1ED9ng v\u1EDBi tr\xECnh duy\u1EC7t n\xE0y. { -send-short-brand } ho\u1EA1t \u0111\u1ED9ng t\u1ED1t nh\u1EA5t v\u1EDBi phi\xEAn b\u1EA3n { -firefox } m\u1EDBi nh\u1EA5t v\xE0 s\u1EBD ho\u1EA1t \u0111\u1ED9ng v\u1EDBi phi\xEAn b\u1EA3n hi\u1EC7n t\u1EA1i c\u1EE7a h\u1EA7u h\u1EBFt c\xE1c tr\xECnh duy\u1EC7t.
downloadFirefox = T\u1EA3i xu\u1ED1ng { -firefox }
legalTitle = Th\xF4ng b\xE1o b\u1EA3o m\u1EADt { -send-short-brand }
legalDateStamp = Phi\xEAn b\u1EA3n 1.0, ng\xE0y 12 th\xE1ng 3 n\u0103m 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } ng\xE0y { $hours } gi\u1EDD { $minutes } ph\xFAt
addFilesButton = Ch\u1ECDn t\u1EADp tin \u0111\u1EC3 t\u1EA3i l\xEAn
uploadButton = T\u1EA3i l\xEAn
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = K\xE9o v\xE0 th\u1EA3 t\u1EADp tin
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ho\u1EB7c nh\u1EA5p \u0111\u1EC3 g\u1EEDi t\u1ED1i \u0111a { $size }
addPassword = B\u1EA3o v\u1EC7 b\u1EB1ng m\u1EADt kh\u1EA9u
emailPlaceholder = Nh\u1EADp email c\u1EE7a b\u1EA1n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = \u0110\u0103ng nh\u1EADp \u0111\u1EC3 g\u1EEDi t\u1ED1i \u0111a { $size }
signInOnlyButton = \u0110\u0103ng nh\u1EADp
accountBenefitTitle = T\u1EA1o t\xE0i kho\u1EA3n { -firefox } ho\u1EB7c \u0111\u0103ng nh\u1EADp
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Chia s\u1EBB t\u1EADp tin l\xEAn t\u1EDBi { $size }
accountBenefitDownloadCount = Chia s\u1EBB t\u1EADp tin v\u1EDBi nhi\u1EC1u ng\u01B0\u1EDDi h\u01A1n
accountBenefitTimeLimit =
    { $count ->
       *[other] Gi\u1EEF li\xEAn k\u1EBFt ho\u1EA1t \u0111\u1ED9ng t\u1ED1i \u0111a { $count } ng\xE0y
    }
accountBenefitSync = Qu\u1EA3n l\xFD t\u1EADp tin \u0111\u01B0\u1EE3c chia s\u1EBB t\u1EEB m\u1ECDi thi\u1EBFt b\u1ECB
accountBenefitMoz = T\xECm hi\u1EC3u v\u1EC1 c\xE1c d\u1ECBch v\u1EE5 kh\xE1c c\u1EE7a { -mozilla }
signOut = \u0110\u0103ng xu\u1EA5t
okButton = OK
downloadingTitle = \u0110ang ta\u0309i xu\xF4\u0301ng
noStreamsWarning = Tr\xECnh duy\u1EC7t n\xE0y c\xF3 kh\u1EA3 n\u0103ng kh\xF4ng th\u1EC3 gi\u1EA3i m\xE3 m\u1ED9t t\u1EADp tin l\u1EDBn n\xE0y.
noStreamsOptionCopy = Sao ch\xE9p li\xEAn k\u1EBFt \u0111\u1EC3 m\u1EDF trong m\u1ED9t tr\xECnh duy\u1EC7t kh\xE1c
noStreamsOptionFirefox = H\xE3y d\xF9ng th\u1EED tr\xECnh duy\u1EC7t y\xEAu th\xEDch c\u1EE7a ch\xFAng t\xF4i
noStreamsOptionDownload = Ti\u1EBFp t\u1EE5c v\u1EDBi tr\xECnh duy\u1EC7t n\xE0y
downloadFirefoxPromo = { -send-short-brand } \u0111\u01B0\u1EE3c mang \u0111\u1EBFn cho b\u1EA1n b\u1EDFi { -firefox } ho\xE0n to\xE0n m\u1EDBi.
# the next line after the colon contains a file name
shareLinkDescription = Chia s\u1EBB li\xEAn k\u1EBFt \u0111\u1EBFn t\u1EADp tin c\u1EE7a b\u1EA1n:
shareLinkButton = Chia s\u1EBB li\xEAn k\u1EBFt
# $name is the name of the file
shareMessage = T\u1EA3i xu\u1ED1ng \u201C{ $name }\u201C v\u1EDBi { -send-brand }: chia s\u1EBB t\u1EADp tin \u0111\u01A1n gi\u1EA3n, an to\xE0n
trailheadPromo = \u0110\xE2y l\xE0 m\u1ED9t c\xE1ch \u0111\u1EC3 b\u1EA3o v\u1EC7 s\u1EF1 ri\xEAng t\u01B0 c\u1EE7a b\u1EA1n. Tham gia Firefox.
learnMore = T\xECm hi\u1EC3u th\xEAm.
`;export{n as default};
