var n=`title = Go Send
importingFile = \u6B63\u5728\u5BFC\u5165\u2026
encryptingFile = \u6B63\u5728\u52A0\u5BC6\u2026
decryptingFile = \u6B63\u5728\u89E3\u5BC6\u2026
downloadCount = { $num ->
        [one] 1 \u6B21\u4E0B\u8F7D
       *[other] { $num } \u6B21\u4E0B\u8F7D
    }
timespanHours = { $num ->
        [one] 1 \u5C0F\u65F6
       *[other] { $num } \u5C0F\u65F6
    }
copiedUrl = \u5DF2\u590D\u5236\uFF01
unlockInputPlaceholder = \u5BC6\u7801
unlockButtonLabel = \u89E3\u9501
downloadButtonLabel = \u4E0B\u8F7D
downloadFinish = \u4E0B\u8F7D\u5B8C\u6210
fileSizeProgress = ({ $partialSize } / { $totalSize })
sendYourFilesLink = \u8BD5\u8BD5 Send
errorPageHeader = \u6211\u4EEC\u9047\u5230\u9519\u8BEF\u3002
fileTooBig = \u6B64\u6587\u4EF6\u592A\u5927\u3002\u6587\u4EF6\u5927\u5C0F\u4E0A\u9650\u4E3A { $size }\u3002
linkExpiredAlt = \u94FE\u63A5\u5DF2\u8FC7\u671F
notSupportedHeader = \u4E0D\u652F\u6301\u60A8\u7684\u6D4F\u89C8\u5668\u3002
notSupportedLink = \u4E3A\u4EC0\u4E48\u4E0D\u652F\u6301\u6211\u7684\u6D4F\u89C8\u5668\uFF1F
notSupportedOutdatedDetail = \u5F88\u53EF\u60DC\uFF0C\u6B64\u7248\u672C\u7684 Firefox \u4E0D\u652F\u6301 Send \u6240\u4F7F\u7528\u7684 Web \u6280\u672F\u3002\u60A8\u9700\u8981\u66F4\u65B0\u6D4F\u89C8\u5668\u624D\u80FD\u4F7F\u7528\u5B83\u3002
updateFirefox = \u66F4\u65B0 Firefox
deletePopupCancel = \u53D6\u6D88
deleteButtonHover = \u5220\u9664
footerText = \u4E0D\u9644\u5C5E\u4E8E Mozilla \u6216 Firefox\u3002
footerLinkDonate = \u6350\u52A9
footerLinkCli = \u547D\u4EE4\u884C
footerLinkDmca = DMCA
footerLinkSource = \u6E90\u4EE3\u7801
passwordTryAgain = \u5BC6\u7801\u4E0D\u6B63\u786E\u3002\u8BF7\u91CD\u8BD5\u3002
javascriptRequired = Send \u9700\u8981 JavaScript
whyJavascript = \u4E3A\u4EC0\u4E48 Send \u9700\u8981 JavaScript\uFF1F
enableJavascript = \u8BF7\u542F\u7528 JavaScript \u5E76\u91CD\u8BD5\u3002
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } \u5C0F\u65F6 { $minutes } \u5206\u949F
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } \u5206\u949F
# A short status message shown when the user enters a long password
maxPasswordLength = \u6700\u5927\u5BC6\u7801\u957F\u5EA6\uFF1A{ $length }
# A short status message shown when there was an error setting the password
passwordSetError = \u672A\u80FD\u8BBE\u7F6E\u6B64\u5BC6\u7801

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = \u7B80\u5355\u3001\u79C1\u5BC6\u7684\u6587\u4EF6\u5206\u4EAB\u670D\u52A1
introDescription = \u4F7F\u7528 { -send-brand } \u7AEF\u5230\u7AEF\u52A0\u5BC6\u5206\u4EAB\u6587\u4EF6\uFF0C\u94FE\u63A5\u5230\u671F\u5373\u711A\u3002\u5206\u4EAB\u66F4\u79C1\u5BC6\uFF0C\u6587\u4EF6\u5230\u671F\u771F\u6B63\u65E0\u75D5\u8FF9\u3002
notifyUploadEncryptDone = \u60A8\u7684\u6587\u4EF6\u5DF2\u52A0\u5BC6\uFF0C\u73B0\u5728\u53EF\u4EE5\u53D1\u9001
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = { $downloadCount }\u6216 { $timespan }\u540E\u8FC7\u671F
timespanMinutes =
    { $num ->
        [one] 1 \u5206\u949F
       *[other] { $num } \u5206\u949F
    }
timespanDays =
    { $num ->
        [one] 1 \u5929
       *[other] { $num } \u5929
    }
timespanWeeks =
    { $num ->
        [one] 1 \u5468
       *[other] { $num } \u5468
    }
fileCount =
    { $num ->
        [one] 1 \u4E2A\u6587\u4EF6
       *[other] { $num } \u4E2A\u6587\u4EF6
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
totalSize = \u603B\u5927\u5C0F\uFF1A{ $size }
# the next line after the colon contains a file name
copyLinkDescription = \u590D\u5236\u94FE\u63A5\u4EE5\u5206\u4EAB\u6587\u4EF6\uFF1A
copyLinkButton = \u590D\u5236\u94FE\u63A5
downloadTitle = \u4E0B\u8F7D\u6587\u4EF6
downloadDescription = \u6B64\u6587\u4EF6\u901A\u8FC7\u7AEF\u5230\u7AEF\u52A0\u5BC6\u7684 { -send-brand } \u4E0E\u60A8\u5206\u4EAB\uFF0C\u94FE\u63A5\u5230\u671F\u5373\u711A\u3002
trySendDescription = \u8BD5\u8BD5 { -send-brand }\uFF0C\u7B80\u5355\u3001\u79C1\u5BC6\u7684\u6587\u4EF6\u5206\u4EAB\u670D\u52A1\u3002
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] \u4E00\u6B21\u53EA\u53EF\u4E0A\u4F20 1 \u4E2A\u6587\u4EF6\u3002
       *[other] \u4E00\u6B21\u53EA\u53EF\u4E0A\u4F20 { $count } \u4E2A\u6587\u4EF6\u3002
    }
# count will always be > 10
tooManyArchives =
    { $count ->
       *[other] \u53EA\u53EF\u4E0A\u4F20 { $count } \u4E2A\u538B\u7F29\u6587\u4EF6\u3002
    }
expiredTitle = \u6B64\u94FE\u63A5\u5DF2\u8FC7\u671F\u3002
notSupportedDescription = { -send-brand } \u65E0\u6CD5\u5728\u6B64\u6D4F\u89C8\u5668\u4E0A\u6B63\u5E38\u5DE5\u4F5C\u3002{ -send-short-brand } \u4E0E\u6700\u65B0\u7248\u672C { -firefox } \u914D\u5408\u4F7F\u7528\u4F53\u9A8C\u6700\u4F73\uFF0C\u4E5F\u9002\u7528\u4E8E\u76EE\u524D\u7684\u5927\u591A\u6570\u6D4F\u89C8\u5668\u3002
downloadFirefox = \u4E0B\u8F7D { -firefox }
legalTitle = { -send-short-brand } \u9690\u79C1\u58F0\u660E
legalDateStamp = \u7248\u672C 1.0\uFF0C\u4E8E 2019\u5E743\u670812\u65E5
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } \u5929 { $hours } \u5C0F\u65F6 { $minutes } \u5206\u949F
addFilesButton = \u9009\u62E9\u8981\u4E0A\u4F20\u7684\u6587\u4EF6
uploadButton = \u4E0A\u4F20
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = \u62D6\u653E\u6587\u4EF6
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = \u6216\u70B9\u6B64\u4F20\u9001\u6700\u5927 { $size } \u7684\u6587\u4EF6
addPassword = \u5BC6\u7801\u4FDD\u62A4
emailPlaceholder = \u8BF7\u8F93\u5165\u60A8\u7684\u7535\u5B50\u90AE\u4EF6\u5730\u5740
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = \u767B\u5F55\u4EE5\u4F20\u9001\u6700\u5927 { $size } \u6587\u4EF6
signInOnlyButton = \u767B\u5F55
accountBenefitTitle = \u521B\u5EFA\u4E00\u4E2A { -firefox } \u8D26\u6237\u6216\u767B\u5F55
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = \u5206\u4EAB\u6700\u5927 { $size } \u6587\u4EF6
accountBenefitDownloadCount = \u53EF\u4EE5\u4E0E\u66F4\u591A\u4EBA\u5206\u4EAB
accountBenefitTimeLimit =
    { $count ->
        [one] \u94FE\u63A5\u6709\u6548\u671F\u5EF6\u81F3 1 \u5929
       *[other] \u94FE\u63A5\u6709\u6548\u671F\u5EF6\u81F3 { $count } \u5929
    }
accountBenefitSync = \u4EFB\u4F55\u8BBE\u5907\u4E0A\u90FD\u80FD\u7BA1\u7406\u5206\u4EAB\u7684\u6587\u4EF6
accountBenefitMoz = \u4E86\u89E3\u5176\u4ED6 { -mozilla } \u670D\u52A1
signOut = \u9000\u51FA
okButton = \u786E\u5B9A
downloadingTitle = \u6B63\u5728\u4E0B\u8F7D
noStreamsWarning = \u6B64\u6D4F\u89C8\u5668\u53EF\u80FD\u65E0\u6CD5\u89E3\u5BC6\u8FD9\u4E48\u5927\u7684\u6587\u4EF6\u3002
noStreamsOptionCopy = \u590D\u5236\u94FE\u63A5\u4EE5\u5728\u5176\u4ED6\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00
noStreamsOptionFirefox = \u8BD5\u8BD5\u5927\u5BB6\u6700\u7231\u7684\u6D4F\u89C8\u5668
noStreamsOptionDownload = \u4F7F\u7528\u6B64\u6D4F\u89C8\u5668\u7EE7\u7EED
downloadFirefoxPromo = { -send-short-brand } \u7531\u7115\u7136\u4E00\u65B0\u7684 { -firefox } \u4E3A\u60A8\u5949\u4E0A\u3002
# the next line after the colon contains a file name
shareLinkDescription = \u60A8\u7684\u6587\u4EF6\u94FE\u63A5\uFF1A
shareLinkButton = \u5206\u4EAB\u94FE\u63A5
# $name is the name of the file
shareMessage = \u4F7F\u7528 { -send-brand } \u4E0B\u8F7D\u201C{ $name }\u201D\uFF1A\u7B80\u5355\u3001\u5B89\u5168\u7684\u6587\u4EF6\u5206\u4EAB\u670D\u52A1
learnMore = \u8BE6\u7EC6\u4E86\u89E3\u3002
`;export{n as default};
