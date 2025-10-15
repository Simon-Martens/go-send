var n=`title = Go Send
importingFile = \u30A4\u30F3\u30DD\u30FC\u30C8\u4E2D...
encryptingFile = \u6697\u53F7\u5316\u4E2D...
decryptingFile = \u5FA9\u53F7\u5316\u4E2D...
downloadCount =
    { $num ->
       *[other] { $num } \u56DE\u306E\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9
    }
timespanHours =
    { $num ->
       *[other] { $num } \u6642\u9593
    }
copiedUrl = \u30B3\u30D4\u30FC\u5B8C\u4E86\uFF01
unlockInputPlaceholder = \u30D1\u30B9\u30EF\u30FC\u30C9
unlockButtonLabel = \u30ED\u30C3\u30AF\u89E3\u9664
downloadButtonLabel = \u30C0\u30A6\u30F3\u30ED\u30FC\u30C9
downloadFinish = \u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B8C\u4E86
fileSizeProgress = ({ $partialSize } / { $totalSize })
sendYourFilesLink = Send \u3092\u8A66\u3059
errorPageHeader = \u4F55\u304B\u554F\u984C\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002
fileTooBig = \u3053\u306E\u30D5\u30A1\u30A4\u30EB\u306F\u5927\u304D\u3059\u304E\u308B\u305F\u3081\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3067\u304D\u307E\u305B\u3093\u3002\u4E0A\u9650\u306F { $size } \u3067\u3059\u3002
linkExpiredAlt = \u30EA\u30F3\u30AF\u671F\u9650\u5207\u308C
notSupportedHeader = \u304A\u4F7F\u3044\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u306B\u306F\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002
notSupportedLink = \u306A\u305C\u79C1\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u306B\u306F\u5BFE\u5FDC\u3057\u3066\u3044\u306A\u3044\u306E\u3067\u3057\u3087\u3046\u304B\uFF1F
notSupportedOutdatedDetail = \u6B8B\u5FF5\u306A\u304C\u3089\u304A\u4F7F\u3044\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u306E Firefox \u306F Send \u304C\u6D3B\u7528\u3057\u3066\u3044\u308B\u30A6\u30A7\u30D6\u6280\u8853\u306B\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\u3002\u30D6\u30E9\u30A6\u30B6\u30FC\u3092\u66F4\u65B0\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002
updateFirefox = Firefox \u3092\u66F4\u65B0
deletePopupCancel = \u30AD\u30E3\u30F3\u30BB\u30EB
deleteButtonHover = \u524A\u9664
passwordTryAgain = \u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u518D\u5EA6\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002
javascriptRequired = Send \u3092\u4F7F\u3046\u306B\u306F JavaScript \u304C\u5FC5\u8981\u3067\u3059
whyJavascript = Send \u304C JavaScript \u3092\u5FC5\u8981\u3068\u3059\u308B\u7406\u7531
enableJavascript = JavaScript \u3092\u6709\u52B9\u306B\u3057\u3066\u518D\u5EA6\u8A66\u3057\u3066\u304F\u3060\u3055\u3044\u3002
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } \u6642\u9593 { $minutes } \u5206
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } \u5206
# A short status message shown when the user enters a long password
maxPasswordLength = \u30D1\u30B9\u30EF\u30FC\u30C9\u6700\u9577\u6587\u5B57\u6570: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = \u3053\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u306F\u8A2D\u5B9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = \u7C21\u5358\u306B\u3001\u30D7\u30E9\u30A4\u30D9\u30FC\u30C8\u306B\u30D5\u30A1\u30A4\u30EB\u5171\u6709
introDescription = { -send-brand } \u3067\u306F\u3001\u6697\u53F7\u5316\u3057\u3066\u30D5\u30A1\u30A4\u30EB\u5171\u6709\u3067\u304D\u3001\u30EA\u30F3\u30AF\u306F\u81EA\u52D5\u7684\u306B\u671F\u9650\u5207\u308C\u306B\u306A\u308A\u307E\u3059\u3002\u305D\u306E\u305F\u3081\u3001\u5171\u6709\u3059\u308B\u3082\u306E\u3092\u30D7\u30E9\u30A4\u30D9\u30FC\u30C8\u306B\u4FDD\u7BA1\u3067\u304D\u3001\u30AA\u30F3\u30E9\u30A4\u30F3\u4E0A\u306B\u6C38\u9060\u306B\u6B8B\u3055\u306A\u3044\u3088\u3046\u306B\u3067\u304D\u307E\u3059\u3002
notifyUploadEncryptDone = \u30D5\u30A1\u30A4\u30EB\u304C\u6697\u53F7\u5316\u3055\u308C\u3001\u9001\u4FE1\u3059\u308B\u6E96\u5099\u304C\u3067\u304D\u307E\u3057\u305F
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = \u6709\u52B9\u671F\u9593: { $downloadCount } \u307E\u305F\u306F { $timespan }
timespanMinutes =
    { $num ->
       *[other] { $num } \u5206
    }
timespanDays =
    { $num ->
       *[other] { $num } \u65E5
    }
timespanWeeks =
    { $num ->
       *[other] { $num } \u9031\u9593
    }
fileCount =
    { $num ->
       *[other] { $num } \u30D5\u30A1\u30A4\u30EB
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
totalSize = \u5408\u8A08\u30B5\u30A4\u30BA: { $size }
# the next line after the colon contains a file name
copyLinkDescription = \u30EA\u30F3\u30AF\u3092\u30B3\u30D4\u30FC\u3057\u3066\u30D5\u30A1\u30A4\u30EB\u3092\u5171\u6709:
copyLinkButton = \u30EA\u30F3\u30AF\u3092\u30B3\u30D4\u30FC
downloadTitle = \u30D5\u30A1\u30A4\u30EB\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9
downloadDescription = \u3053\u306E\u30D5\u30A1\u30A4\u30EB\u306F { -send-brand } \u306B\u3088\u308A\u3001\u6697\u53F7\u5316\u3055\u308C\u3066\u5171\u6709\u3055\u308C\u307E\u3057\u305F\u3002\u30EA\u30F3\u30AF\u306F\u81EA\u52D5\u7684\u306B\u671F\u9650\u5207\u308C\u306B\u306A\u308A\u307E\u3059\u3002
trySendDescription = \u7C21\u5358\u3067\u5B89\u5168\u306A\u30D5\u30A1\u30A4\u30EB\u5171\u6709\u304C\u3067\u304D\u308B { -send-brand } \u3092\u8A66\u3057\u3066\u304F\u3060\u3055\u3044\u3002
# count will always be > 10
tooManyFiles =
    { $count ->
       *[other] \u4E00\u5EA6\u306B\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3067\u304D\u308B\u306E\u306F { $count } \u30D5\u30A1\u30A4\u30EB\u307E\u3067\u3067\u3059\u3002
    }
# count will always be > 10
tooManyArchives =
    { $count ->
       *[other] { $count } \u56DE\u307E\u3067\u3057\u304B\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3067\u304D\u307E\u305B\u3093\u3002
    }
expiredTitle = \u3053\u306E\u30EA\u30F3\u30AF\u306F\u671F\u9650\u5207\u308C\u3067\u3059\u3002
notSupportedDescription = { -send-brand } \u306F\u3001\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u3067\u306F\u52D5\u4F5C\u3057\u307E\u305B\u3093\u3002{ -send-short-brand } \u306F\u6700\u65B0\u30D0\u30FC\u30B8\u30E7\u30F3\u306E { -firefox } \u3067\u6700\u3082\u3088\u304F\u52D5\u4F5C\u3057\u3001\u305D\u306E\u4ED6\u306E\u73FE\u30D0\u30FC\u30B8\u30E7\u30F3\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u3067\u3082\u52D5\u4F5C\u3057\u307E\u3059\u3002
downloadFirefox = { -firefox } \u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9
legalTitle = { -send-short-brand } \u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u901A\u77E5
legalDateStamp = \u30D0\u30FC\u30B8\u30E7\u30F3 1.0, 2019\u5E743\u670812\u65E5\u6642\u70B9
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } \u65E5 { $hours } \u6642 { $minutes } \u5206
addFilesButton = \u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3059\u308B\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E
uploadButton = \u30A2\u30C3\u30D7\u30ED\u30FC\u30C9
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = \u30D5\u30A1\u30A4\u30EB\u3092\u30C9\u30E9\u30C3\u30B0\uFF06\u30C9\u30ED\u30C3\u30D7
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = \u307E\u305F\u306F\u3001\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u6700\u5927 { $size } \u306E\u30D5\u30A1\u30A4\u30EB\u3092\u9001\u4FE1
addPassword = \u30D1\u30B9\u30EF\u30FC\u30C9\u3067\u4FDD\u8B77
emailPlaceholder = \u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = \u30ED\u30B0\u30A4\u30F3\u3059\u308B\u3068\u6700\u5927 { $size } \u306E\u30D5\u30A1\u30A4\u30EB\u3092\u9001\u4FE1\u3067\u304D\u307E\u3059
signInOnlyButton = \u30ED\u30B0\u30A4\u30F3
accountBenefitTitle = { -firefox } \u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u4F5C\u6210\u307E\u305F\u306F\u30ED\u30B0\u30A4\u30F3
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = \u6700\u5927 { $size } \u307E\u3067\u306E\u30D5\u30A1\u30A4\u30EB\u3092\u5171\u6709
accountBenefitDownloadCount = \u3088\u308A\u591A\u304F\u306E\u4EBA\u3068\u30D5\u30A1\u30A4\u30EB\u3092\u5171\u6709
accountBenefitTimeLimit =
    { $count ->
       *[other] \u30EA\u30F3\u30AF\u3092 { $count } \u65E5\u9593\u6709\u52B9\u5316
    }
accountBenefitSync = \u69D8\u3005\u306A\u7AEF\u672B\u304B\u3089\u5171\u6709\u3057\u305F\u30D5\u30A1\u30A4\u30EB\u3092\u7BA1\u7406
accountBenefitMoz = { -mozilla } \u306E\u4ED6\u306E\u30B5\u30FC\u30D3\u30B9\u306B\u3064\u3044\u3066\u8A73\u3057\u304F\u5B66\u3076
signOut = \u30ED\u30B0\u30A2\u30A6\u30C8
okButton = OK
downloadingTitle = \u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u4E2D
noStreamsWarning = \u3053\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u306F\u3001\u3053\u306E\u5927\u304D\u3055\u306E\u30D5\u30A1\u30A4\u30EB\u3092\u5FA9\u53F7\u5316\u3067\u304D\u307E\u305B\u3093\u3002
noStreamsOptionCopy = \u30EA\u30F3\u30AF\u3092\u30B3\u30D4\u30FC\u3057\u3066\u4ED6\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u3067\u958B\u3044\u3066\u304F\u3060\u3055\u3044
noStreamsOptionFirefox = Firefox \u3092\u8A66\u3057\u3066\u307F\u308B
noStreamsOptionDownload = \u3053\u306E\u30D6\u30E9\u30A6\u30B6\u30FC\u3067\u7D9A\u3051\u308B
downloadFirefoxPromo = { -send-short-brand } \u306F\u3059\u3079\u3066\u304C\u65B0\u3057\u304F\u306A\u3063\u305F { -firefox } \u306B\u3088\u308A\u63D0\u4F9B\u3055\u308C\u3066\u3044\u307E\u3059\u3002
# the next line after the colon contains a file name
shareLinkDescription = \u30D5\u30A1\u30A4\u30EB\u3078\u306E\u30EA\u30F3\u30AF\u3092\u5171\u6709\u3057\u307E\u3057\u3087\u3046:
shareLinkButton = \u30EA\u30F3\u30AF\u3092\u5171\u6709
# $name is the name of the file
shareMessage = { -send-brand } \u3067 "{ $name }" \u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9: \u30B7\u30F3\u30D7\u30EB\u3067\u5B89\u5168\u306A\u30D5\u30A1\u30A4\u30EB\u5171\u6709
trailheadPromo = \u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u3092\u4FDD\u8B77\u3059\u308B\u65B9\u6CD5\u304C\u3042\u308A\u307E\u3059\u3002Firefox \u3092\u8A66\u3057\u3066\u304F\u3060\u3055\u3044\u3002
learnMore = \u8A73\u7D30\u60C5\u5831
`;export{n as default};
