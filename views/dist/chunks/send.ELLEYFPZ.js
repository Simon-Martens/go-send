import"./chunk.E3IN6YWE.js";var e=`title = Go Send
importingFile = Akter...
encryptingFile = Awgelhen...
decryptingFile = Azmek...
downloadCount =
    { $num ->
        [one] 1 usider
       *[other] { $num } isidar
    }
timespanHours =
    { $num ->
        [one] 1 usrag
       *[other] { $num } isragen
    }
copiedUrl = Yen\u0263el!
unlockInputPlaceholder = Awal uffir
unlockButtonLabel = Serre\u1E25
downloadButtonLabel = Sider
downloadFinish = Asider yemmed
fileSizeProgress = ({ $partialSize } seg { $totalSize })
sendYourFilesLink = \u0190re\u1E0D Send
errorPageHeader = Yella wayen ye\u1E0Dran!
fileTooBig = Afaylu-agi meqqer a\u1E6Das. Yessefk ad yili daw n  { $size }.
linkExpiredAlt = Ase\u0263wen yemmut
notSupportedHeader = Iminig-ik ur ittusefrak ara
notSupportedLink = Ay\u03B3er iminig inu ur yettwasefrek ara?
notSupportedOutdatedDetail = Ad nes\u1E25issef imilqem-agi n Firefox Firefox ur isefrak ara titiknulujiyin web yettwaseqdacen di Send. Yessefk ad tleqme\u1E0D iminig-ik.
updateFirefox = Leqqem Firefox
deletePopupCancel = Sefsex
deleteButtonHover = Kkes
passwordTryAgain = Yir awal uffir. \u0190re\u1E0D tikelt nni\u1E0Den.
javascriptRequired = Send yesra JavaScript
whyJavascript = Ay\u0263er Send yesra JavaScript?
enableJavascript = Ma ulac a\u0263ilif rmed JavaScript sakin \u025Bre\u1E0D tikkelt nni\u1E0Den.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }Isragen { $minutes }Tisdatin
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }Tisdatin
# A short status message shown when the user enters a long password
maxPasswordLength = Tu\u03B3zi tafellayt n wawal uffir: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Awal-agi uffir ur izmir ara ad ittwabaded

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Afessas, be\u1E6D\u1E6Du n ifuyla s wudem uslig
introDescription = { -send-brand } ad k\xB7kem-ye\u01E7\u01E7 ad teb\u1E0Du\u1E0D ifuyla iwgelhanen si \u1E6D\u1E6Derf \u0263er \u1E6D\u1E6Derf akked use\u0263wen ara yemmten s wudem awurman. Da\u0263en, ad tizmire\u1E0D ad t\u1E25erze\u1E0D\xA0ayen i tbe\u1E6D\u1E6Du\u1E0D s wudem uslig da\u0263en ad tamne\u1E0D imi agbur-ik\xB7im ur yett\u0263imi ara  i lebda.
notifyUploadEncryptDone = Afaylu-ik yewgelhen da\u0263en ihegga i tuzna
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Ad yemmet deffir { $downloadCount } ne\u0263 { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 n tsedat
       *[other] { $num } n tsedatin
    }
timespanDays =
    { $num ->
        [one] 1 n wass
       *[other] { $num } n wussan
    }
timespanWeeks =
    { $num ->
        [one] 1 n ddu\u1E5Bt
       *[other] { $num } n ledwa\u1E5B
    }
fileCount =
    { $num ->
        [one] 1 n ufaylu
       *[other] { $num } n yifuyla
    }
# byte abbreviation
bytes = B
# kibibyte abbreviation
kb = KA\u1E6C
# mebibyte abbreviation
mb = MA\u1E6C
# gibibyte abbreviation
gb = GA\u1E6C
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num }{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Tu\u0263zi s umata: { $size }
# the next line after the colon contains a file name
copyLinkDescription = N\u0263el ase\u0263wen akken ad teb\u1E0Du\u1E0D afaylu-inek
copyLinkButton = N\u0263el ase\u0263wen
downloadTitle = Sider ifuyla
downloadDescription = Afaylu-a yettwab\u1E0Da s { -send-brand } s uwgelhen s \u1E6D\u1E6Derf \u0263er \u1E6D\u1E6Derf s use\u0263wen ara yemmten s wudem awurman.
trySendDescription = \u0190re\u1E0D { -send-brand } i be\u1E0D\u1E0Du afessas n ifuyla s wudem ame\u0263tu.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Ala 1 n ufaylu i yemzren ad yali i tikkelt.
       *[other] Ala { $count } n yifuyla i yemzren ad alin i tikkelt.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Ala 1 n te\u1E5Bcibt i yettwasirgen.
       *[other] Ala { $count } n te\u1E5Bcibin i yettwasiregn.
    }
expiredTitle = Immut use\u0263wen.
notSupportedDescription = { -send-brand } ur iteddu ara s yiminig-a. { -send-short-brand } iteddu akken iwata s lqem aneggaru n { -firefox }, da\u0263en iteddu s lqem amiran n tuget n yiminigen.
downloadFirefox = Sider { -firefox }
legalTitle = Tasertit taba\u1E0Dnit n { -send-short-brand }
legalDateStamp = Lqem  1.0, azemz n 12 Me\u0263res 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }\xA0ass { $hours }\xA0srg { $minutes }\xA0tsd
addFilesButton = Fren ifuyla ad tessali\u1E0D
uploadButton = Sali
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = \u1E92u\u0263er sakin sers ifuyla
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ne\u0263 sit akken ad tazne\u1E0D arma d { $size }
addPassword = \u1E24rez s wawal uffir
emailPlaceholder = Sekcem imayl inek
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Qqen akken ad tazne\u1E0D arma d { $size }
signInOnlyButton = Qqen
accountBenefitTitle = Rnu ami\u1E0Dan { -firefox } akken ad teqqne\u1E0D
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = B\u1E0Du ifuyla arma d { $size }
accountBenefitDownloadCount = B\u1E0Du ifuyla d wugan n medden
accountBenefitTimeLimit =
    { $count ->
        [one] E\u01E7\u01E7 ise\u0263wan d urmiden arma d 1\xA0n wass
       *[other] E\u01E7\u01E7 ise\u0263wan d urmiden arma d { $count } n wassan
    }
accountBenefitSync = Sefrek ifuyla yebdan seg yal ibenk
accountBenefitMoz = Issin ugar \u0263ef yime\u1E93la-nni\u1E0Den n { -mozilla }
signOut = Ffe\u0263
okButton = IH
downloadingTitle = Azdam
noStreamsWarning = Iminig-a ur yezmir ara ad yezmek afaylu meqqren.
noStreamsOptionCopy = N\u0263el ase\u0263wen i tulya deg yiminig-nniden
noStreamsOptionFirefox = \u0190re\u1E0D iminig-ik ufrin
noStreamsOptionDownload = Kemmel akked iminig-a
downloadFirefoxPromo = { -send-short-brand } yettwasumer i yal { -firefox } amaynut.
# the next line after the colon contains a file name
shareLinkDescription = B\u1E0Du ase\u0263wen \u0263er ufaylu-ik:
shareLinkButton = B\u1E0Du ase\u0263wen
# $name is the name of the file
shareMessage = Sider "{ $name }" s { -send-brand }: d fessas, d a\u0263elsan i be\u1E6D\u1E6Du n yifuyla.
trailheadPromo = Yella wallal n ummesten n tudert-ik tusligt. Ddu \u0263er Firefox.
learnMore = Issin ugar.
`;export{e as default};
