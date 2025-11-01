import"./chunk.XOPNHUSF.js";var n=`title = Go Send
importingFile = Importuje so...
encryptingFile = Zaklu\u010Duje so...
decryptingFile = De\u0161ifruje so...
downloadCount =
    { $num ->
        [one] 1 s\u0107ehnjenje
        [two] { $num } s\u0107ehnjeni
        [few] { $num } s\u0107ehnjenja
       *[other] { $num } s\u0107ehnjenjow
    }
timespanHours =
    { $num ->
        [one] 1 hod\u017Aina
        [two] { $num } hod\u017Ainje
        [few] { $num } hod\u017Ainy
       *[other] { $num } hod\u017Ain
    }
copiedUrl = Kop\u011Browany!
unlockInputPlaceholder = Hes\u0142o
unlockButtonLabel = Wotewr\u011B\u0107
downloadButtonLabel = S\u0107ahny\u0107
downloadFinish = S\u0107ehnjenje dok\xF3n\u010Dene
fileSizeProgress = ({ $partialSize } z { $totalSize })
sendYourFilesLink = Send wupruwowa\u0107
errorPageHeader = N\u011B\u0161to je so nimokuli\u0142o!
fileTooBig = Tuta dataja je p\u0159ewulka za nahra\u0107e. M\u011B\u0142a mje\u0144\u0161a ha\u010D { $size } by\u0107.
linkExpiredAlt = Wotkaz je spadnjeny
notSupportedHeader = Wa\u0161 wobhladowak so njepodp\u011Bruje.
notSupportedLink = \u010Cehodla so m\xF3j wobhladowak njepodp\u011Bruje?
notSupportedOutdatedDetail = Bohu\u017Eel tuta wersija Firefox webtechnologiju njepodp\u011Bruje, na kotrej\u017E Send bazuje. Dyrbi\u0107e sw\xF3j wobhladowak aktualizowa\u0107.
updateFirefox = Firefox aktualizowa\u0107
deletePopupCancel = P\u0159etorhny\u0107
deleteButtonHover = Zha\u0161e\u0107
passwordTryAgain = Wopa\u010Dne hes\u0142o. Pro\u0161u spytaj\u0107e hi\u0161\u0107e raz.
javascriptRequired = Send JavaScript trjeba
whyJavascript = \u010Cehodla Send JavaScript trjeba?
enableJavascript = Pro\u0161u zm\xF3\u017E\u0144\u0107e JavaScript a spytaj\u0107e hi\u0161\u0107e raz.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } hod\u017A. { $minutes } mje\u0144.
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } mje\u0144.
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimalna do\u0142hos\u0107 hes\u0142a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Tute hes\u0142o njeda so nastaji\u0107

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Jednore, priwatne datajowe d\u017A\u011Blenje
introDescription = { -send-brand } wam zm\xF3\u017Enja, dataje ze zaklu\u010Dowanjom k\xF3nc do k\xF3nca a wotkazom d\u017A\u011Bli\u0107, kotry\u017E awtomatisce spadnje. Tak m\xF3\u017Ee\u0107e d\u017A\u011Bleny wobsah priwatny d\u017Aer\u017Ee\u0107 a zaw\u011Bs\u0107i\u0107, zo wa\u0161e daty online na p\u0159eco njew\xF3stanu.
notifyUploadEncryptDone = Wa\u0161a dataja je zaklu\u010Dowana a hotowa za s\u0142anje
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Spadnje po { $downloadCount } abo { $timespan }
timespanMinutes =
    { $num ->
        [one] { $num } mje\u0144\u0161ina
        [two] { $num } mje\u0144\u0161inje
        [few] { $num } mje\u0144\u0161iny
       *[other] { $num } mje\u0144\u0161in
    }
timespanDays =
    { $num ->
        [one] { $num } d\u017Ae\u0144
        [two] { $num } dnjej
        [few] { $num } dny
       *[other] { $num } dnjow
    }
timespanWeeks =
    { $num ->
        [one] { $num } tyd\u017Ae\u0144
        [two] { $num } njed\u017Aeli
        [few] { $num } njed\u017Aele
       *[other] { $num } njed\u017Ael
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
totalSize = Cy\u0142kowna wulkos\u0107: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kop\u011Bruj\u0107e wotkaz, zo by\u0161\u0107e swoju dataju d\u017A\u011Bli\u0142:
copyLinkButton = Wotkaz kop\u011Browa\u0107
downloadTitle = Dataje s\u0107ahny\u0107
downloadDescription = Tuta dataja je so p\u0159ez { -send-brand } ze zaklu\u010Dowanjom k\xF3nc do k\xF3nca a wotkazom d\u017A\u011Bli\u0142a, kotry\u017E awtomatisce spadnje.
trySendDescription = Spytaj\u0107e { -send-brand } za jednore, w\u011Bste datajowe d\u017A\u011Blenje.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Jeno\u017E { $count } dataja da so na jedne dobo nahra\u0107.
        [two] Jeno\u017E { $count } dataji datej so na jedne dobo nahra\u0107.
        [few] Jeno\u017E { $count } dataje dad\u017Aa so na jedne dobo nahra\u0107.
       *[other] Jeno\u017E { $count } datajow da so na jedne dobo nahra\u0107.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Jeno\u017E { $count } archiw je dowoleny.
        [two] Jeno\u017E { $count } archiwaj stej dowolenej.
        [few] Jeno\u017E { $count } archiwy su dowolene.
       *[other] Jeno\u017E { $count } archiwow je dowolene.
    }
expiredTitle = Tut\xF3n wotkaz je spadnjeny.
notSupportedDescription = { -send-brand } z tutym wobhladowakom njefunguje. { -send-short-brand } najl\u011Bpje z najnow\u0161ej wersiju { -firefox } funguje, a funguje z aktualnej wersiju najwjace wobhladowakow.
downloadFirefox = { -firefox } sc\xE1hny\u0107
legalTitle = Zd\u017A\u011Blenka priwatnos\u0107e { -send-short-brand }
legalDateStamp = Wersija 1.0 wot 12. m\u011Brca 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Dataje za nahrawanje wubra\u0107
uploadButton = Nahra\u0107
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = \u0106eh\u0144\u0107e a wotk\u0142ad\u017A\u0107e dataje
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = abo klik\u0144\u0107e, zo by\u0161\u0107e do { $size } p\xF3s\u0142a\u0142
addPassword = Z hes\u0142om \u0161kita\u0107
emailPlaceholder = Zapodaj\u0107e swoju e-mejlowu adresu
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = P\u0159izjew\u0107e so, zo by\u0161\u0107e do { $size } p\xF3s\u0142a\u0142
signInOnlyButton = P\u0159izjewi\u0107
accountBenefitTitle = Za\u0142o\u017E\u0107e konto { -firefox } abo p\u0159izjew\u0107e so
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Dataje do { $size } d\u017A\u011Bli\u0107
accountBenefitDownloadCount = Dataje z wjace lud\u017Aimi d\u017A\u011Bli\u0107
accountBenefitTimeLimit =
    { $count ->
        [one] Wotkazy do { $count } dnja aktiwne d\u017Aer\u017Ee\u0107
        [two] Wotkazy do { $count } dnjow aktiwne d\u017Aer\u017Ee\u0107
        [few] Wotkazy do { $count } dnjow aktiwne d\u017Aer\u017Ee\u0107
       *[other] Wotkazy do { $count } dnjow aktiwne d\u017Aer\u017Ee\u0107
    }
accountBenefitSync = D\u017A\u011Blene dataje z n\u011Bkajkeho grata rjadowa\u0107
accountBenefitMoz = ZHo\u0144\u0107e wjace wo druhich s\u0142u\u017Ebach { -mozilla }
signOut = Wotzjewi\u0107
okButton = W porjadku
downloadingTitle = S\u0107ahuje so
noStreamsWarning = Tut\xF3n wobhladowak njem\xF3h\u0142 tajku wulku dataju de\u0161ifrowa\u0107.
noStreamsOptionCopy = Kop\u011Bruj\u0107e wotkaz, zo by\u0161\u0107e j\xF3n w druhim wobhladowaku wo\u010Dini\u0142
noStreamsOptionFirefox = Wupruwuj\u0107e na\u0161 najlub\u0161i wobhladowak
noStreamsOptionDownload = Z tutym wobhladowakom pokro\u010Dowa\u0107
downloadFirefoxPromo = { -send-short-brand } so wam p\u0159ez cyle nowy { -firefox } p\u0159injese.
# the next line after the colon contains a file name
shareLinkDescription = D\u017A\u011Bl\u0107e wotkaz k swojej dataji:
shareLinkButton = Wotkaz d\u017A\u011Bli\u0107
# $name is the name of the file
shareMessage = S\u0107eh\u0144\u0107e \u201E{ $name }\u201C z { -send-brand }: jednore, w\u011Bste d\u017A\u011Blenje datajow
trailheadPromo = Je m\xF3\u017Enos\u0107, wa\u0161u priwatnos\u0107 \u0161kita\u0107. P\u0159i\u0144d\u017A\u0107e k Firefox.
learnMore = Dal\u0161e informacije.

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
