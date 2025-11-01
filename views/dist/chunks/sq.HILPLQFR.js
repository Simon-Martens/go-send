import"./chunk.XOPNHUSF.js";var n=`title = Go Send
importingFile = Po importohet\u2026
encryptingFile = Po fsheht\xEBzohet\u2026
decryptingFile = Po shfsheht\xEBzohet\u2026
downloadCount =
    { $num ->
        [one] 1 shkarkimi
       *[other] { $num } shkarkimesh
    }
timespanHours =
    { $num ->
        [one] 1 ore
       *[other] { $num } or\xEBsh
    }
copiedUrl = U kopjua!
unlockInputPlaceholder = Fjal\xEBkalim
unlockButtonLabel = Zhbllokoje
downloadButtonLabel = Shkarkoje
downloadFinish = Shkarkim i Plot\xEBsuar
fileSizeProgress = ({ $partialSize } nga { $totalSize }) gjithsej
sendYourFilesLink = Provoni Send
errorPageHeader = Di\xE7 shkoi ters!
fileTooBig = Kjo kartel\xEB \xEBsht\xEB shum\xEB e madhe p\xEBr ngarkim. Do t\xEB duhej t\xEB ishte m\xEB pak se { $size }.
linkExpiredAlt = Lidhja skadoi
notSupportedHeader = Shfletuesi juaj nuk mbulohet.
notSupportedLink = Pse nuk mbulohet ky shfletues?
notSupportedOutdatedDetail = Mjerisht, ky version i Firefox-it nuk e mbulon teknologjin\xEB web mbi t\xEB cil\xEBn bazohet Send. Do t\u2019ju duhet t\xEB p\xEBrdit\xEBsoni shfletuesin tuaj.
updateFirefox = P\xEBrdit\xEBsojeni Firefox-in
deletePopupCancel = Anuloje
deleteButtonHover = Fshije
passwordTryAgain = Fjal\xEBkalim i pasakt\xEB. Riprovoni.
javascriptRequired = Send lyp JavaScript
whyJavascript = \xC7\u2019i duhet Send-it JavaScript-i?
enableJavascript = Ju lutemi, aktivizoni JavaScript-in dhe riprovoni.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Gjat\xEBsi maksimum fjal\xEBkalimi: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Ky fjal\xEBkalim s\u2019u caktua dot

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Ndarje e thjesht\xEB, private, kartelash me t\xEB tjer\xEBt
introDescription = { -send-brand } ju lejon t\xEB ndani kartela me t\xEB tjer\xEBt, me fsheht\xEBzim skaj-m\xEB-skaj dhe me nj\xEB lidhje q\xEB skadon automatikisht. K\xEBshtu mund ta mbani private at\xEB q\xEB ndani me t\xEB tjer\xEB dhe t\xEB garantoni q\xEB gj\xEBrat tuaja s\u2019do t\xEB q\xEBndrojn\xEB n\xEB linj\xEB p\xEBrgjithmon\xEB.
notifyUploadEncryptDone = Kartela juaj \xEBsht\xEB fsheht\xEBzuar dhe gati p\xEBr d\xEBrgim
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Skadon pas { $downloadCount } ose { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minut\xEB
       *[other] { $num } minuta
    }
timespanDays =
    { $num ->
        [one] 1 dit\xEB
       *[other] { $num } dit\xEB
    }
timespanWeeks =
    { $num ->
        [one] 1 jav\xEB
       *[other] { $num } jav\xEB
    }
fileCount =
    { $num ->
        [one] 1 kartel\xEB
       *[other] { $num } kartela
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
totalSize = Madh\xEBsia gjithsej: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kopjoni lidhjen p\xEBr dh\xEBnien e kartel\xEBs tuaj:
copyLinkButton = Kopjoje lidhjen
downloadTitle = Shkarkoni kartela
downloadDescription = Kjo kartel\xEB u nda me t\xEB tjer\xEBt p\xEBrmes { -send-brand }, me fsheht\xEBzim skaj-m\xEB-skaj dhe nj\xEB lidhje q\xEB skadon automatikisht.
trySendDescription = Provoni { -send-brand }, p\xEBr ndarje t\xEB thjesht\xEB, t\xEB parrezik, kartelash me t\xEB tjer\xEBt.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Mund t\xEB ngarkohet vet\xEBm 1 kartel\xEB n\xEB her\xEB.
       *[other] Mund t\xEB ngarkohen vet\xEBm { $count } kartela n\xEB her\xEB.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Lejohet vet\xEBm 1 arkiv.
       *[other] Lejohen vet\xEBm { $count } arkiva.
    }
expiredTitle = Kjo lidhje ka skaduar.
notSupportedDescription = { -send-brand } s\u2019do t\xEB funksionoj\xEB me k\xEBt\xEB shfletues. { -send-short-brand } funksionin m\xEB mir\xEB me versionin m\xEB t\xEB ri t\xEB { -firefox }, dhe do t\xEB funksionoj\xEB me versionin e tanish\xEBm t\xEB shumic\xEBs s\xEB shfletuesve.
downloadFirefox = Shkarkoni { -firefox }
legalTitle = Njoftim Privat\xEBsie P\xEBr { -send-short-brand }
legalDateStamp = Version 1.0, daton 12 mars, 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = P\xEBrzgjidhni kartela p\xEBr ngarkim
uploadButton = Ngarkoje
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = T\xEBrhiqni dhe lini kartela
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ose klikoni q\xEB t\xEB d\xEBrgohen deri n\xEB { $size }
addPassword = Mbrojini me fjal\xEBkalim
emailPlaceholder = Jepni email-in tuaj
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = B\xEBni hyrjen q\xEB t\xEB d\xEBrgoni deri m\xEB { $size }
signInOnlyButton = Hyni
accountBenefitTitle = Krijoni nj\xEB Llogari { -firefox } ose b\xEBni hyrjen n\xEB nj\xEB t\xEB till\xEB
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Ndani me t\xEB tjer\xEBt kartela deri { $size }
accountBenefitDownloadCount = Ndani kartela me m\xEB tep\xEBr persona
accountBenefitTimeLimit =
    { $count ->
        [one] Mbaji aktive lidhjet p\xEBr deri 1 dit\xEB
       *[other] Mbaji aktive lidhjet p\xEBr deri { $count } dit\xEB
    }
accountBenefitSync = Administroni nga \xE7far\xEBdo pajisje kartela t\xEB p\xEBrbashk\xEBta
accountBenefitMoz = M\xEBsoni m\xEB tep\xEBr rreth sh\xEBrbimesh { -mozilla }
signOut = Dilni
okButton = OK
downloadingTitle = Shkarkim
noStreamsWarning = Ky shfletues mund t\xEB mos jet\xEB n\xEB gjendje t\xEB shfsheht\xEBzoj\xEB nj\xEB kartel\xEB kaq t\xEB madhe.
noStreamsOptionCopy = Kopjoje lidhjen p\xEBr ta hapur n\xEB nj\xEB tjet\xEBr shfletues
noStreamsOptionFirefox = Provoni shfletuesin ton\xEB t\xEB parap\xEBlqyer
noStreamsOptionDownload = Vazhdo me k\xEBt\xEB shfletues
downloadFirefoxPromo = { -send-short-brand } ju vjen nga { -firefox }-i i ri fringo.
# the next line after the colon contains a file name
shareLinkDescription = Ndani me t\xEB tjer\xEBt lidhjen p\xEBr te kartela juaj:
shareLinkButton = Ndani me t\xEB tjer\xEBt lidhjen
# $name is the name of the file
shareMessage = Shkarkojeni \u201C{ $name }\u201D me { -send-brand }: shk\xEBmbim kartelash dhe thjesht dhe pa rrezik
trailheadPromo = Ka nj\xEB rrug\xEB p\xEBr t\xEB mbrojtur privat\xEBsin\xEB tuaj. B\xEBhuni pjes\xEB e Firefox-it.
learnMore = M\xEBsoni m\xEB tep\xEBr.

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
`;export{n as default};
