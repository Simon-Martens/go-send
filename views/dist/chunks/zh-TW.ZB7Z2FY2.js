var n=`title = Go Send
importingFile = \u532F\u5165\u4E2D\u2026
encryptingFile = \u52A0\u5BC6\u4E2D\u2026
decryptingFile = \u89E3\u5BC6\u4E2D\u2026
downloadCount = { $num ->
        [one] 1 \u6B21\u4E0B\u8F09
       *[other] { $num } \u6B21\u4E0B\u8F09
    }
timespanHours = { $num ->
        [one] 1 \u5C0F\u6642
       *[other] { $num } \u5C0F\u6642
    }
copiedUrl = \u5DF2\u8907\u88FD\uFF01
unlockInputPlaceholder = \u5BC6\u78BC
unlockButtonLabel = \u89E3\u9396
downloadButtonLabel = \u4E0B\u8F09
downloadFinish = \u4E0B\u8F09\u5B8C\u6210
fileSizeProgress = \uFF08{ $partialSize }\uFF0C\u5171 { $totalSize }\uFF09
sendYourFilesLink = \u8A66\u7528 Send
errorPageHeader = \u6709\u4E9B\u6771\u897F\u4E0D\u5C0D\u52C1\uFF01
fileTooBig = \u6A94\u6848\u592A\u5927\u7121\u6CD5\u4E0A\u50B3\u3002\u6A94\u6848\u5927\u5C0F\u9650\u5236\u70BA { $size }\u3002
linkExpiredAlt = \u93C8\u7D50\u5DF2\u904E\u671F
notSupportedHeader = \u4E0D\u652F\u63F4\u60A8\u7684\u700F\u89BD\u5668\u3002
notSupportedLink = \u70BA\u4EC0\u9EBC\u6211\u7684\u700F\u89BD\u5668\u4E0D\u652F\u63F4\uFF1F
notSupportedOutdatedDetail = \u5F88\u53EF\u60DC\uFF0C\u6B64\u7248\u672C\u7684 Firefox \u4E0D\u652F\u63F4 Send \u6240\u9700\u7684 Web \u6280\u8853\u3002\u8ACB\u66F4\u65B0\u700F\u89BD\u5668\u5F8C\u518D\u4F7F\u7528\u3002
updateFirefox = \u66F4\u65B0 Firefox
deletePopupCancel = \u53D6\u6D88
deleteButtonHover = \u522A\u9664
footerText = \u4E0D\u96B8\u5C6C\u65BC Mozilla \u6216 Firefox\u3002
footerLinkDonate = \u6350\u52A9
footerLinkCli = \u547D\u4EE4\u5217
footerLinkDmca = DMCA
footerLinkSource = \u539F\u59CB\u78BC
passwordTryAgain = \u5BC6\u78BC\u4E0D\u6B63\u78BA\uFF0C\u8ACB\u518D\u8A66\u4E00\u6B21\u3002
javascriptRequired = Send \u9700\u8981\u958B\u555F JavaScript \u529F\u80FD
whyJavascript = \u70BA\u4EC0\u9EBC Send \u9700\u8981 JavaScript \u624D\u80FD\u4F7F\u7528\uFF1F
enableJavascript = \u8ACB\u958B\u555F JavaScript \u529F\u80FD\u5F8C\u518D\u8A66\u4E00\u6B21\u3002
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } \u6642 { $minutes } \u5206
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } \u5206\u9418
# A short status message shown when the user enters a long password
maxPasswordLength = \u6700\u5927\u5BC6\u78BC\u9577\u5EA6: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = \u7121\u6CD5\u8A2D\u5B9A\u6B64\u5BC6\u78BC

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla

introTitle = \u7C21\u55AE\u800C\u79C1\u5BC6\u7684\u6A94\u6848\u5171\u4EAB\u670D\u52D9
introDescription = { -send-brand } \u8B93\u60A8\u53EF\u900F\u904E\u9EDE\u5C0D\u9EDE\u52A0\u5BC6\u7684\u65B9\u5F0F\u4F86\u5206\u4EAB\u6A94\u6848\uFF0C\u4E26\u63D0\u4F9B\u6703\u81EA\u52D5\u5931\u6548\u7684\u93C8\u7D50\u3002\u9019\u6A23\u4E00\u4F86\u5C31\u53EF\u4EE5\u4FDD\u7559\u5206\u4EAB\u6642\u7684\u96B1\u79C1\uFF0C\u4E5F\u78BA\u4FDD\u6A94\u6848\u4E0D\u6703\u6C38\u4E45\u4FDD\u5B58\u65BC\u7DB2\u8DEF\u4E0A\u3002
notifyUploadEncryptDone = \u5DF2\u52A0\u5BC6\u60A8\u7684\u6A94\u6848\uFF0C\u53EF\u4EE5\u50B3\u9001
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = { $downloadCount } \u6216 { $timespan } \u5F8C\u5931\u6548
timespanMinutes = { $num ->
        [one] 1 \u5206\u9418
       *[other] { $num } \u5206\u9418
    }
timespanDays = { $num ->
        [one] 1 \u5929
       *[other] { $num } \u5929
    }
timespanWeeks = { $num ->
        [one] 1 \u9031
       *[other] { $num } \u9031
    }
fileCount = { $num ->
    [one] 1 \u500B\u6A94\u6848
   *[other] { $num } \u500B\u6A94\u6848
}
# byte abbreviation
bytes = \u4F4D\u5143\u7D44
# kibibyte abbreviation
kb = KB
# mebibyte abbreviation
mb = MB
# gibibyte abbreviation
gb = GB
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num } { $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = \u7E3D\u5927\u5C0F: { $size }
# the next line after the colon contains a file name
copyLinkDescription = \u8907\u88FD\u93C8\u7D50\u5373\u53EF\u5206\u4EAB\u60A8\u7684\u6A94\u6848:
copyLinkButton = \u8907\u88FD\u93C8\u7D50
downloadTitle = \u4E0B\u8F09\u6A94\u6848
downloadDescription = \u6B64\u6A94\u6848\u662F\u900F\u904E { -send-brand } \u9032\u884C\u5206\u4EAB\uFF0C\u4EE5\u9EDE\u5C0D\u9EDE\u52A0\u5BC6\u7684\u65B9\u5F0F\u4F86\u5206\u4EAB\u6A94\u6848\uFF0C\u4E26\u63D0\u4F9B\u6703\u81EA\u52D5\u5931\u6548\u7684\u93C8\u7D50\u3002
trySendDescription = \u5FEB\u8A66\u8A66 { -send-brand }\uFF0C\u7C21\u55AE\u5B89\u5168\u7684\u6A94\u6848\u5206\u4EAB\u6A5F\u5236\u3002
# count will always be > 10
tooManyFiles = { $count ->
     [one] \u4E00\u6B21\u50C5\u80FD\u4E0A\u50B3 1 \u500B\u6A94\u6848\u3002
    *[other] \u4E00\u6B21\u50C5\u80FD\u4E0A\u50B3 { $count } \u500B\u6A94\u6848\u3002
}
# count will always be > 10
tooManyArchives = { $count ->
     [one] \u50C5\u5141\u8A31 1 \u500B\u58D3\u7E2E\u6A94\u3002
    *[other] \u50C5\u5141\u8A31 { $count } \u500B\u58D3\u7E2E\u6A94\u3002
}
expiredTitle = \u6B64\u93C8\u7D50\u5DF2\u7D93\u5931\u6548\u3002
notSupportedDescription = \u7121\u6CD5\u65BC\u6B64\u700F\u89BD\u5668\u4F7F\u7528 { -send-brand }\u3002\u5728\u6700\u65B0\u7248\u7684 { -firefox } \u4E2D\u4F7F\u7528 { -send-short-brand } \u6703\u6709\u6700\u4F73\u6548\u679C\uFF0C\u4E5F\u53EF\u5728\u5927\u90E8\u5206\u700F\u89BD\u5668\u7684\u6700\u65B0\u7248\u672C\u7576\u4E2D\u4F7F\u7528\u3002
downloadFirefox = \u4E0B\u8F09 { -firefox }
legalTitle = { -send-short-brand } \u96B1\u79C1\u6B0A\u516C\u544A
legalDateStamp = 1.0 \u7248\uFF0C2019 \u5E74 3 \u6708 12 \u65E5\u751F\u6548
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } \u5929 { $hours } \u5C0F\u6642 { $minutes } \u5206\u9418
addFilesButton = \u9078\u64C7\u8981\u4E0A\u50B3\u7684\u6A94\u6848
uploadButton = \u4E0A\u50B3
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = \u62D6\u653E\u6A94\u6848\u5230\u6B64\u8655
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = \u6216\u9EDE\u64CA\u5373\u53EF\u50B3\u9001\u6700\u5927 { $size } \u7684\u6A94\u6848
addPassword = \u4F7F\u7528\u5BC6\u78BC\u4FDD\u8B77
emailPlaceholder = \u8F38\u5165\u60A8\u7684\u96FB\u5B50\u90F5\u4EF6\u5730\u5740
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = \u767B\u5165\u5F8C\u5373\u53EF\u50B3\u9001\u6700\u5927 { $size } \u7684\u6A94\u6848
signInOnlyButton = \u767B\u5165
accountBenefitTitle = \u8A3B\u518A { -firefox } \u5E33\u865F\u6216\u767B\u5165
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = \u5206\u4EAB\u6700\u5927 { $size } \u7684\u6A94\u6848
accountBenefitDownloadCount = \u5206\u4EAB\u6A94\u6848\u7D66\u66F4\u591A\u4EBA
accountBenefitTimeLimit =
    { $count ->
       *[other] \u5C07\u6A94\u6848\u93C8\u7D50\u4FDD\u7559 { $count } \u5929\u6709\u6548
    }
accountBenefitSync = \u5F9E\u4EFB\u4F55\u88DD\u7F6E\u7BA1\u7406\u5206\u4EAB\u7684\u6A94\u6848
accountBenefitMoz = \u4E86\u89E3\u5176\u4ED6 { -mozilla } \u670D\u52D9\u7684\u66F4\u591A\u8CC7\u8A0A
signOut = \u767B\u51FA
okButton = \u78BA\u5B9A
downloadingTitle = \u4E0B\u8F09\u4E2D
noStreamsWarning = \u6B64\u700F\u89BD\u5668\u7121\u6CD5\u89E3\u5BC6\u9019\u9EBC\u5927\u7684\u6A94\u6848\u3002
noStreamsOptionCopy = \u8907\u88FD\u93C8\u7D50\uFF0C\u7528\u5176\u4ED6\u700F\u89BD\u5668\u958B\u555F
noStreamsOptionFirefox = \u8A66\u8A66\u6211\u5011\u6700\u611B\u7684\u700F\u89BD\u5668
noStreamsOptionDownload = \u7E7C\u7E8C\u4F7F\u7528\u76EE\u524D\u7684\u700F\u89BD\u5668
downloadFirefoxPromo = { -send-short-brand } \u662F\u7531\u5168\u65B0\u7684 { -firefox } \u63D0\u4F9B\u3002
# the next line after the colon contains a file name
shareLinkDescription = \u60A8\u7684\u6A94\u6848\u93C8\u7D50:
shareLinkButton = \u5206\u4EAB\u93C8\u7D50
# $name is the name of the file
shareMessage = \u4F7F\u7528 { -send-brand } \u4E0B\u8F09\u300C{ $name }\u300D: \u7C21\u55AE\u5B89\u5168\u7684\u6A94\u6848\u5206\u4EAB\u6A5F\u5236
learnMore = \u4E86\u89E3\u66F4\u591A\u3002
`;export{n as default};
