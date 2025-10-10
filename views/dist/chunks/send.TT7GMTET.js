import"./chunk.E3IN6YWE.js";var n=`title = Go Send
importingFile = \u0130\xE7e aktar\u0131l\u0131yor\u2026
encryptingFile = \u015Eifreleniyor\u2026
decryptingFile = \u015Eifre \xE7\xF6z\xFCl\xFCyor\u2026
downloadCount = { $num } indirme
timespanHours =
    { $num ->
        [one] 1 saat
       *[other] { $num } saat
    }
copiedUrl = Kopyaland\u0131!
unlockInputPlaceholder = Parola
unlockButtonLabel = Kilidi a\xE7
downloadButtonLabel = \u0130ndir
downloadFinish = \u0130ndirme tamamland\u0131
fileSizeProgress = ({ $partialSize } / { $totalSize })
sendYourFilesLink = Send\u2019i deneyin
errorPageHeader = Bir \u015Feyler ters gitti!
fileTooBig = Dosyan\u0131z \xE7ok b\xFCy\xFCk. En fazla { $size } boyutunda olmal\u0131.
linkExpiredAlt = Ba\u011Flant\u0131 zaman a\u015F\u0131m\u0131na u\u011Fram\u0131\u015F
notSupportedHeader = Taray\u0131c\u0131n\u0131z desteklenmiyor.
notSupportedLink = Taray\u0131c\u0131m neden desteklenmiyor?
notSupportedOutdatedDetail = Kulland\u0131\u011F\u0131n\u0131z Firefox s\xFCr\xFCm\xFC Send i\xE7in gereken web teknolojilerini desteklemiyor. Taray\u0131c\u0131n\u0131z\u0131 g\xFCncellemeniz gerekiyor.
updateFirefox = Firefox\u2019u g\xFCncelle
deletePopupCancel = Vazge\xE7
deleteButtonHover = Sil
passwordTryAgain = Yanl\u0131\u015F parola. Yeniden deneyin.
javascriptRequired = Send i\xE7in JavaScript gerekir
whyJavascript = Send neden JavaScript kullan\u0131yor?
enableJavascript = L\xFCtfen JavaScript'i etkinle\u015Ftirip yeniden deneyin.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } sa { $minutes } dk
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } dk
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimum parola uzunlu\u011Fu: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Parola ayarlanamad\u0131

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Basit ve gizli dosya payla\u015F\u0131m\u0131
introDescription = { -send-brand } ile dosyalar\u0131n\u0131z\u0131 u\xE7tan uca \u015Fifreleme ve otomatik olarak silinen bir ba\u011Flant\u0131yla payla\u015F\u0131n. B\xF6ylece \xF6zel dosyalar\u0131n\u0131z g\xFCvenle saklan\u0131r, bir s\xFCre sonra kendi kendine silinir.
notifyUploadEncryptDone = Dosyan\u0131z \u015Fifrelendi ve g\xF6nderilmeye haz\u0131r
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = { $downloadCount } veya { $timespan } sonra silinecek
timespanMinutes =
    { $num ->
        [one] 1 dakika
       *[other] { $num } dakika
    }
timespanDays =
    { $num ->
        [one] 1 g\xFCn
       *[other] { $num } g\xFCn
    }
timespanWeeks =
    { $num ->
        [one] 1 hafta
       *[other] { $num } hafta
    }
fileCount =
    { $num ->
        [one] 1 dosya
       *[other] { $num } dosya
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
fileSize = { $num } { $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Toplam boyut: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Dosyan\u0131z\u0131 payla\u015Fmak i\xE7in ba\u011Flant\u0131y\u0131 kopyalay\u0131n:
copyLinkButton = Ba\u011Flant\u0131y\u0131 kopyala
downloadTitle = Dosyalar\u0131 indir
downloadDescription = Bu dosya { -send-brand } \xFCzerinden payla\u015F\u0131ld\u0131. U\xE7tan uca \u015Fifreleme ve kendili\u011Finden silinen ba\u011Flant\u0131 korumas\u0131 { -send-brand }\u2019de.
trySendDescription = Basit ve g\xFCvenli dosya payla\u015F\u0131m\u0131 i\xE7in { -send-brand }\u2019i deneyin.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Bir kerede en fazla 1 dosya y\xFCkleyebilirsiniz.
       *[other] Bir kerede en fazla { $count } dosya y\xFCkleyebilirsiniz.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] En fazla 1 ar\u015Five izin veriliyor.
       *[other] En fazla { $count } ar\u015Five izin veriliyor.
    }
expiredTitle = Bu ba\u011Flant\u0131n\u0131n s\xFCresi doldu.
notSupportedDescription = { -send-brand } bu taray\u0131c\u0131y\u0131 desteklemiyor. { -send-short-brand } en iyi \u015Fekilde { -firefox }\u2019un son s\xFCr\xFCm\xFCyle ve \xE7o\u011Fu taray\u0131c\u0131n\u0131n g\xFCncel s\xFCr\xFCm\xFCyle \xE7al\u0131\u015F\u0131r.
downloadFirefox = { -firefox }\u2019u indir
legalTitle = { -send-short-brand } Gizlilik Bildirimi
legalDateStamp = S\xFCr\xFCm 1.0, 12 Mart 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } g { $hours } sa { $minutes } dk
addFilesButton = Y\xFCklenecek dosyalar\u0131 se\xE7in
uploadButton = Y\xFCkle
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Dosyalar\u0131 s\xFCr\xFCkleyip b\u0131rakarak
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = veya buraya t\u0131klayarak { $size }\u2019ye kadar dosyalar\u0131n\u0131z\u0131 g\xF6nderebilirsiniz
addPassword = Parola korumas\u0131 ekle
emailPlaceholder = E-posta adresinizi yaz\u0131n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = { $size }\u2019ye kadar dosya g\xF6ndermek i\xE7in giri\u015F yap\u0131n
signInOnlyButton = Giri\u015F yap
accountBenefitTitle = { -firefox } Hesab\u0131 a\xE7\u0131n veya giri\u015F yap\u0131n
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = { $size } boyutlu dosyalar\u0131 payla\u015Fma
accountBenefitDownloadCount = Daha fazla ki\u015Fiyle dosya payla\u015Fma
accountBenefitTimeLimit =
    { $count ->
        [one] Ba\u011Flant\u0131lar\u0131 1 g\xFCne kadar aktif tutma
       *[other] Ba\u011Flant\u0131lar\u0131 { $count } g\xFCne kadar aktif tutma
    }
accountBenefitSync = Payla\u015Ft\u0131\u011F\u0131n\u0131z dosyalar\u0131 ba\u015Fka cihazlardan y\xF6netebilme
accountBenefitMoz = Di\u011Fer { -mozilla } servisleri hakk\u0131nda bilgi alma
signOut = \xC7\u0131k\u0131\u015F yap
okButton = Tamam
downloadingTitle = \u0130ndiriliyor
noStreamsWarning = Bu taray\u0131c\u0131 bu kadar b\xFCy\xFCk bir dosyan\u0131n \u015Fifresini \xE7\xF6zemeyebilir.
noStreamsOptionCopy = Ba\u011Flant\u0131y\u0131 ba\u015Fka bir taray\u0131c\u0131da a\xE7mak i\xE7in kopyala
noStreamsOptionFirefox = En sevdi\u011Fimiz taray\u0131c\u0131y\u0131 deneyin
noStreamsOptionDownload = Bu taray\u0131c\u0131yla devam edin
downloadFirefoxPromo = { -send-short-brand }, yepyeni { -firefox } taraf\u0131ndan sunulmaktad\u0131r.
# the next line after the colon contains a file name
shareLinkDescription = Dosyan\u0131z\u0131n ba\u011Flant\u0131s\u0131n\u0131 payla\u015F\u0131n:
shareLinkButton = Ba\u011Flant\u0131y\u0131 payla\u015F
# $name is the name of the file
shareMessage = \u201C{ $name }\u201D dosyas\u0131n\u0131 { -send-brand } ile indirin: basit ve g\xFCvenli dosya payla\u015F\u0131m\u0131
trailheadPromo = Gizlili\u011Finizi koruman\u0131n bir yolu var. Firefox\u2019a kat\u0131l\u0131n.
learnMore = Daha fazla bilgi al\u0131n.
`;export{n as default};
