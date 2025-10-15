var n=`title = Go Send
importingFile = Tajin nijik\u2026
encryptingFile = Tajin new\xE4x rusik'ixik\u2026
decryptingFile = Tajin netam\xE4x rusik'ixik...
downloadCount =
    { $num ->
        [one] 1 qasan\xEFk
       *[other] { $num } taq qasan\xEFk
    }
timespanHours =
    { $num ->
        [one] 1 ramaj
       *[other] { $num } taq ramaj
    }
copiedUrl = \xA1Xwachib'\xEBx!
unlockInputPlaceholder = Ewan tzij
unlockButtonLabel = Titzij chik
downloadButtonLabel = Tiqas\xE4x
downloadFinish = Xtz'aq\xE4t qasan\xEFk
fileSizeProgress = ({ $partialSize } richin { $totalSize })
sendYourFilesLink = Titojtob'\xEBx Send
errorPageHeader = \xA1K'o ri man \xFCtz ta xub'\xE4n!
fileTooBig = Yalan n\xEFm re yakb'\xE4l re' richin nijotob'\xE4x. K'o ta chi man nik'o ta chi re ri { $size }.
linkExpiredAlt = Xk'is ruq'ijul ri ximonel
notSupportedHeader = Man koch'el ta ri awokik'amaya'l.
notSupportedLink = \xBFAchike ruma man nikoch' taq ri wokik'amaya'l?
notSupportedOutdatedDetail = K'ayew ruma re ruw\xE4ch Firefox re' man nuk\xF6ch' ta ri ajk'amaya'l na'ob'\xE4l nrajo' ri Send. Rajowaxik nak'\xEBx ri awokik'amaya'l.
updateFirefox = Tik'ex ri Firefox
deletePopupCancel = Tiq'at
deleteButtonHover = Tiyuj
passwordTryAgain = Itzel ri ewan tzij. Tatojtob'ej chik.
javascriptRequired = K'atzinel JavaScript chi re ri Send
whyJavascript = \xBFAchike ruma toq ri Send nrajo' JavaScript?
enableJavascript = Titz'ij JavaScript richin nitojtob'\xEBx chik.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }r { $minutes }ch
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }ch
# A short status message shown when the user enters a long password
maxPasswordLength = N\xEFm raq\xE4n ewan tzij: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Man tikirel ta ninuk' re ewan tzij re'

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Titaq
-firefox = Firefox
-mozilla = Mozilla
introTitle = Kijunamaxik relik chuqa' ichinan yakb'\xE4l
introDescription = { -send-brand } nuya' q'ij chawe ye'akomonij taq yakb'\xE4l ri ewan kisik'ixik chijun chuqa' jun ximonel ri nik'is ruq'ijul pa ruyonil. Ke ri' nawichinaj ronojel ri nakomonij chuqa' yajike' chi ronojel ri  taq awachinaq man jumul ta kek'oje' pa k'amab'ey.
notifyUploadEncryptDone = Ewan chik rusik'ixik ri ayakb'al chuqa' \xFCtz chik richin nitaq
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Nik'is ruq'ij chi rij { $downloadCount } o { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 ch'utiramaj
       *[other] { $num } taq ch'utiramaj
    }
timespanDays =
    { $num ->
        [one] 1 q'ij
       *[other] { $num } taq q'ij
    }
timespanWeeks =
    { $num ->
        [one] 1 wuqq'ij
       *[other] { $num } taq wuqq'ij
    }
fileCount =
    { $num ->
        [one] 1 yakb'\xE4l
       *[other] { $num } taq yakb'\xE4l
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
totalSize = Ronojel runimilem: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Tawachib'ej ri ximonel richin nakomonij ri ayakb'al:
copyLinkButton = Tiwachib'\xEBx ximonel
downloadTitle = Keqas\xE4x taq yakb'\xE4l
downloadDescription = Xkomon\xEFx re yakb'\xE4l re' pa { -send-brand } rik'in chijun ewan rusik'ixik chuqa' nik'is ruq'ijul pa ruyonil.
trySendDescription = Tatojtob'ej { -send-brand } richin chanin chuqa' jik\xEFl ye'akomonij taq yakb'\xE4l.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Xa xe 1 yakb'\xE4l tikirel nijotob'\xE4x pa ri ramaj.
       *[other] Xa xe { $count } taq yakb'\xE4l tikirel yejotob'\xE4x pa ri ramaj.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Xa xe 1 yakb'\xE4l niya' q'ij chi re.
       *[other] Xa xe { $count } taq yakb'\xE4l niya' q'ij chi ke.
    }
expiredTitle = Xk'is yan ruq'ij re ximonel re'.
notSupportedDescription = Man xtisam\xE4j ta ri { -send-brand } rik'in re okik'amaya'l re'. Nisam\xE4j \xFCtz ri { -send-short-brand } rik'in ri ruk'isib'\xE4l ruw\xE4ch { -firefox }, chuqa' xtisam\xE4j rik'in ri ruw\xE4ch k'o wakami pa ronojel okik'amaya'l.
downloadFirefox = Tiqas\xE4x { -firefox }
legalTitle = Rutzijol Richinanem { -send-short-brand }
legalDateStamp = Ruw\xE4ch 1.0, ruq'ijul marso 12, 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }q { $hours }r { $minutes }ch'
addFilesButton = Kecha' taq yakb'\xE4l richin yejotob'\xE4x
uploadButton = Tijotob'\xE4x
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Keqirir\xEBx chuqa' ke'osq'op\xEFx taq yakb'\xE4l
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o tapitz'a' richin nat\xE4q k'a { $size }
addPassword = Tichaj\xEFx rik'in ewan tzij
emailPlaceholder = Tatz'ib'aj ataqoya'l
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Tatikirisaj molojri'\xEFl richin nat\xE4q k'a { $size }
signInOnlyButton = Titikiris\xE4x molojri'\xEFl
accountBenefitTitle = Tatz'uku' jun { -firefox } Rub'i' Ataqoy'al o Tatikirisaj molojri'\xEFl
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Ke'akomonij taq yakb'\xE4l k'a { $size }
accountBenefitDownloadCount = Ke'akomonij taq yakb'\xE4l kik'in ch'aqa' chik winaqi'
accountBenefitTimeLimit =
    { $count ->
        [one] Ke' atzija' ri taq ximonel chi 1 q'ij
       *[other] Ke'atzija' ri taq ximonel chi { $count } taq q'ij
    }
accountBenefitSync = Ke'anuk'samajij komonin taq yakb'\xE4l pa xab'achike okisab'\xE4l
accountBenefitMoz = Tawetamaj chij ch'aqa' chik { -mozilla } taq samaj
signOut = Titz'ap\xEFx molojri'\xEFl
okButton = \xDCTZ
downloadingTitle = Niqas\xE4x
noStreamsWarning = Rik'in jub'a' re okik'amaya'l re' man nitik\xEFr ta nretamaj rusik'ixik nima'q taq yakb'\xE4l.
noStreamsOptionCopy = Tiwachib'\xEBx ri ximonel richin nijaq pa jun chik okik'amaya'l
noStreamsOptionFirefox = Tatojtob'ej ri jeb'\xEBl qokik'amaya'l
noStreamsOptionDownload = Kisam\xE4j na rik'in re okik'amaya'l re'
downloadFirefoxPromo = Ja ri k'ak'a' { -firefox } nus\xFCj ri { -send-short-brand } chawe.
# the next line after the colon contains a file name
shareLinkDescription = Nakomonij ri ximonel rik'in ri awokisab'al:
shareLinkButton = Tikomon\xEFx ximonel
# $name is the name of the file
shareMessage = Tiqas\xE4x "{ $name }" rik'in { -send-brand }: man k'ayew ta chuqa' \xFCtz kikomonik ri yakb'\xE4l
trailheadPromo = K'o jun rub'anikil richin nachajij ri awichinanem. Tatunu' awi' rik'in ri Firefox.
learnMore = Tetam\xE4x ch'aqa' chik.
`;export{n as default};
