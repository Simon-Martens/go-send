var n=`title = Go Send
importingFile = Import\u011Brujo se...
encryptingFile = Kod\u011Brujo se...
decryptingFile = De\u0161ifr\u011Brujo se...
downloadCount =
    { $num ->
        [one] 1 ze\u015B\u011Bgnjenje
        [two] { $num } ze\u015B\u011Bgnjeni
        [few] { $num } ze\u015B\u011Bgnjenja
       *[other] { $num } ze\u015B\u011Bgnjenjow
    }
timespanHours =
    { $num ->
        [one] 1 g\xF3\u017Aina
        [two] { $num } g\xF3\u017Ainje
        [few] { $num } g\xF3\u017Ainy
       *[other] { $num } g\xF3\u017Ain
    }
copiedUrl = Kop\u011Browany!
unlockInputPlaceholder = Gronid\u0142o
unlockButtonLabel = W\xF3tw\xF3ri\u015B
downloadButtonLabel = Ze\u015B\u011Bgnu\u015B
downloadFinish = Ze\u015B\u011Bgnjenje dok\xF3\u0144cone
fileSizeProgress = ({ $partialSize } z { $totalSize })
sendYourFilesLink = Send wopyta\u015B
errorPageHeader = N\u011Bco njejo se ra\u017Ai\u0142o!
fileTooBig = To\u015B ta dataja jo p\u015Bewjelika za nagra\u015Be. M\u011B\u0142a mje\u0144\u0161a ako { $size } by\u015B.
linkExpiredAlt = W\xF3tkaz spadnjony
notSupportedHeader = Wa\u0161 wobgl\u011Bdowak se njep\xF3dp\u011Bra.
notSupportedLink = Cogodla se m\xF3j wobgl\u011Bdowak njep\xF3dp\u011Bra?
notSupportedOutdatedDetail = B\xF3\u017Eko to\u015B ta wersija Firefox webtechnologiju njep\xF3dp\u011Bra, na k\xF3tarej\u017E Send baz\u011Brujo. Musy\u015Bo sw\xF3j wobgl\u011Bdowak aktualiz\u011Browa\u015B.
updateFirefox = Firefox aktualiz\u011Browa\u015B
deletePopupCancel = P\u015Betergnu\u015B
deleteButtonHover = Wula\u0161owa\u015B
passwordTryAgain = Wopacne gronid\u0142o. Wopytaj\u015Bo hy\u0161\u0107i raz.
javascriptRequired = Send JavaScript trjeba
whyJavascript = Cogodla Send JavaScript trjeba?
enableJavascript = P\u0161osym zm\xF3\u017Eni\u015Bo JavaScript a wopytaj\u015Bo hy\u0161\u0107i raz.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } g\xF3\u017A. { $minutes } min.
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } min.
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimalna d\u0142ujkos\u0107 gronid\u0142a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = To\u015B to gronid\u0142o njedajo se nastaji\u015B

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Jadnore, priwatne datajowe \u017A\u011Blenje
introDescription = { -send-brand } wam zm\xF3\u017Enja, dataje z kod\u011Browanim k\xF3\u0144c do k\xF3\u0144ca a w\xF3tkazom \u017A\u011Bli\u015B, k\xF3tary\u017E awtomatiski spadnjo. Tak m\xF3\u017Eo\u015Bo \u017A\u011Blone wop\u015Bimje\u015Be priwatne \u017Aar\u017Ea\u015B a zaw\u011Bs\u0107i\u015B, a\u017E wa\u0161e daty online na p\u015Becej njew\xF3stanu.
notifyUploadEncryptDone = Wa\u0161a dataja jo skod\u011Browana za s\u0142anje
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Spadnjo p\xF3 { $downloadCount } abo { $timespan }
timespanMinutes =
    { $num ->
        [one] { $num } minuta
        [two] { $num } minu\u015Be
        [few] { $num } minuty
       *[other] { $num } minutow
    }
timespanDays =
    { $num ->
        [one] { $num } \u017Ae\u0144
        [two] { $num } dnja
        [few] { $num } dny
       *[other] { $num } dnjow
    }
timespanWeeks =
    { $num ->
        [one] { $num } ty\u017Ae\u0144
        [two] { $num } ty\u017Aenja
        [few] { $num } ty\u017Aenje
       *[other] { $num } ty\u017Aenjow
    }
fileCount =
    { $num ->
        [one] { $num } dataja
        [two] { $num } dataji
        [few] { $num } dataje
       *[other] { $num } datajow
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
totalSize = Ce\u0142kowna wjelikos\u0107: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kop\u011Bruj\u015Bo w\xF3tkaz, aby sw\xF3ju dataju \u017A\u011Bli\u0142:
copyLinkButton = W\xF3tkaz kop\u011Browa\u015B
downloadTitle = Dataje ze\u015B\u011Bgnu\u015B
downloadDescription = To\u015B ta dataja jo se p\u015Bez { -send-brand } z kod\u011Browanim k\xF3\u0144c do k\xF3\u0144ca a w\xF3tkazom \u017A\u011Bli\u0142a, k\xF3tary\u017E awtomatiski spadnjo.
trySendDescription = Wopytaj\u015Bo { -send-brand } za jadnore, w\u011Bste datajowe \u017A\u011Blenje.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Jano { $count } dataja dajo se naraz nagra\u015B.
        [two] Jano { $count } dataji dajotej se naraz nagra\u015B.
        [few] Jano { $count } dataje daju se naraz nagra\u015B.
       *[other] Jano { $count } datajow dajo se naraz nagra\u015B.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Jano { $count } archiw jo dow\xF3lony.
        [two] Jano { $count } archiwa stej dow\xF3lonej.
        [few] Jano { $count } archiwy su dow\xF3lone.
       *[other] Jano { $count } archiwow jo dow\xF3lone.
    }
expiredTitle = To\u015B ten w\xF3tkaz jo spadnjony.
notSupportedDescription = { -send-brand } z to\u015B tym wobgl\u011Bdowakom njefunkcion\u011Brujo. { -send-short-brand } nejl\u011Bpjej z nejnow\u0161eju wersiju { -firefox } funkcion\u011Brujo, a funkcion\u011Brujo z aktualneju wersiju nejw\u011Bcej wobgl\u011Bdowakow.
downloadFirefox = { -firefox } ze\u015B\u011Bgnu\u015B
legalTitle = Pow\u011B\u017Ae\u0144ka priwatnos\u0107i { -send-short-brand }
legalDateStamp = Wersija 1.0 w\xF3t 12. m\u011Brca 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }\u017A { $hours }g { $minutes }m
addFilesButton = Dataje za nagrawanje wubra\u015B
uploadButton = Nagra\u015B
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = \u015A\u011Bgni\u015Bo a w\xF3tpo\u0142o\u017E\u0107o dataje
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = abo klikni\u015Bo, aby do { $size } p\xF3s\u0142a\u0142
addPassword = Z gronid\u0142om \u0161\u0107ita\u015B
emailPlaceholder = Zap\xF3daj\u015Bo sw\xF3ju e-mailowu adresu
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = P\u015Bizjaw\u015Bo se, aby do { $size } p\xF3s\u0142a\u0142
signInOnlyButton = P\u015Bizjawi\u015B
accountBenefitTitle = Za\u0142o\u017E\u0107o konto { -firefox } abo p\u015Bizjaw\u015Bo se
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Dataje do { $size } \u017A\u011Bli\u015B
accountBenefitDownloadCount = Dataje z w\u011Bcej lu\u017Aimi \u017A\u011Bli\u015B
accountBenefitTimeLimit =
    { $count ->
        [one] W\xF3tkaze do { $count } dnja aktiwne \u017Aar\u017Ea\u015B
        [two] W\xF3tkaze do { $count } dnjowu aktiwne \u017Aar\u017Ea\u015B
        [few] W\xF3tkaze do { $count } dnjow aktiwne \u017Aar\u017Ea\u015B
       *[other] W\xF3tkaze do { $count } dnjow aktiwne \u017Aar\u017Ea\u015B
    }
accountBenefitSync = \u0179\u011Blone dataje z n\u011Bkakego r\u011Bda zastoja\u015B
accountBenefitMoz = Zg\xF3\u0144\u015Bo w\u011Bcej w\xF3 drugich s\u0142u\u017Ebach { -mozilla }
signOut = W\xF3tzjawi\u015B
okButton = W p\xF3r\u011B\u017Ae
downloadingTitle = Ze\u015B\u011Bgujo se
noStreamsWarning = To\u015B ten wobgl\u011Bdowak njam\xF3ga\u0142 taku wjeliku dataju de\u0161ifr\u011Browa\u015B.
noStreamsOptionCopy = Kop\u011Bruj\u015Bo w\xF3tkaz, aby jen w drugim wobgl\u011Bdowaku w\xF3cyni\u0142
noStreamsOptionFirefox = Wopytaj\u015Bo na\u0161 nejlub\u0161y wobgl\u011Bdowak
noStreamsOptionDownload = Z to\u015B tym wobgl\u011Bdowakom p\xF3k\u0161acowa\u015B
downloadFirefoxPromo = { -send-short-brand } se wam p\u015Bez cele nowy { -firefox } p\u015Binjaso.
# the next line after the colon contains a file name
shareLinkDescription = \u0179\u011Bl\u015Bo w\xF3tkaz k sw\xF3jej dataji:
shareLinkButton = W\xF3tkaz \u017A\u011Bli\u015B
# $name is the name of the file
shareMessage = Ze\u015B\u011Bgni\u015Bo \u201E{ $name }\u201C z { -send-brand }: jadnore, w\u011Bste \u017A\u011Blenje datajow
trailheadPromo = Jo m\xF3\u017Enos\u0107, wa\u0161u priwatnos\u0107 \u0161\u0107ita\u015B. P\u015Bi\u017A\u0107o k Firefox.
learnMore = Dal\u0161ne informacije.
`;export{n as default};
