import "./chunk-IFG75HHC.js";

// locales/lt.ftl
var lt_default = `title = Go Send
importingFile = Importuojama\u2026
encryptingFile = \u0160ifruojama\u2026
decryptingFile = I\u0161\u0161ifruojama\u2026
downloadCount =
    { $num ->
        [one] { $num } kart\u0105
        [few] { $num } kartus
       *[other] { $num } kart\u0173
    }
timespanHours =
    { $num ->
        [one] { $num } valandos
        [few] { $num } valand\u0173
       *[other] { $num } valand\u0173
    }
copiedUrl = Nukopijuota!
unlockInputPlaceholder = Slapta\u017Eodis
unlockButtonLabel = Atrakinti
downloadButtonLabel = Parsisi\u0173sti
downloadFinish = Parsiuntimas baigtas
fileSizeProgress = ({ $partialSize } i\u0161 { $totalSize })
sendYourFilesLink = I\u0161bandyti \u201ESend\u201C
errorPageHeader = Nutiko ka\u017Ekas negero!
fileTooBig = Pasirinktas failas yra per didelis, kad j\u012F b\u016Bt\u0173 galima \u012Fkelti. Failo dydis netur\u0117t\u0173 vir\u0161yti { $size }
linkExpiredAlt = Saitas nebegalioja
notSupportedHeader = J\u016Bs\u0173 nar\u0161ykl\u0117 nepalaikoma.
notSupportedLink = Kod\u0117l mano nar\u0161ykl\u0117 nepalaikoma?
notSupportedOutdatedDetail = Deja, \u0161ioje \u201EFirefox\u201C nar\u0161ykl\u0117s laidoje nepalaikoma \u201ESend\u201C veikti reikalinga technologija. Jeigu norite naudotis \u0161ia paslauga, tur\u0117site atnaujinti savo nar\u0161ykl\u0119.
updateFirefox = Atnaujinti \u201EFirefox\u201C
deletePopupCancel = Atsisakyti
deleteButtonHover = \u0160alinti
passwordTryAgain = Slapta\u017Eodis netinka. Bandykite dar kart\u0105.
javascriptRequired = \u201ESend\u201C veikimui b\u016Btina \u012Fgalinti \u201EJavaScript\u201C palaikym\u0105
whyJavascript = Kod\u0117l \u201ESend\u201C neveikia i\u0161jungus \u201EJavaScript\u201C?
enableJavascript = \u012Egalinkit \u201EJavaScript\u201C ir bandykite dar kart\u0105.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }\xA0val. { $minutes }\xA0min.
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }\xA0min.
# A short status message shown when the user enters a long password
maxPasswordLength = Did\u017Eiausias leistinas slapta\u017Eod\u017Eio ilgis: { $length }\xA0simb.
# A short status message shown when there was an error setting the password
passwordSetError = Slapta\u017Eod\u017Eio nustatyti nepavyko

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla =
    { $case ->
       *[nominative] Mozilla
        [genitive] Mozillos
        [dative] Mozillai
        [accusative] Mozill\u0105
        [instrumental] Mozilla
        [locative] Mozilloje
    }
introTitle = Paprastas ir privatus dalijimasis failais
introDescription = \u201E{ -send-brand }\u201C suteikia galimyb\u0119 dalintis failais, pasitelkiant abipus\u012F \u0161ifravim\u0105 ir riboto galiojimo saitus. Tai padeda pasidalintus failus i\u0161laikyti priva\u010Diais ir u\u017Etikrina, jog trumpam \u012Fkelti failai neliks pasiekiami internete am\u017Einai.
notifyUploadEncryptDone = Failas u\u017E\u0161ifruotas ir parengtas i\u0161siuntimui
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Nustos galioti parsisiuntus { $downloadCount } arba po { $timespan }
timespanMinutes =
    { $num ->
        [one] { $num } minut\u0117s
        [few] { $num } minu\u010Di\u0173
       *[other] { $num } minu\u010Di\u0173
    }
timespanDays =
    { $num ->
        [one] { $num } dienos
        [few] { $num } dien\u0173
       *[other] { $num } dien\u0173
    }
timespanWeeks =
    { $num ->
        [one] { $num } savait\u0117s
        [few] { $num } savai\u010Di\u0173
       *[other] { $num } savai\u010Di\u0173
    }
fileCount =
    { $num ->
        [one] { $num } failas
        [few] { $num } failai
       *[other] { $num } fail\u0173
    }
# byte abbreviation
bytes = B
# kibibyte abbreviation
kb = kB
# mebibyte abbreviation
mb = MB
# gibibyte abbreviation
gb = GB
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num }\xA0{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Bendras dydis: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Nukopijuokite sait\u0105, jeigu norite pasidalinti failu:
copyLinkButton = Kopijuoti sait\u0105
downloadTitle = Parsisi\u0173sti failus
downloadDescription = \u0160iuo failu pasidalinta per \u201E{ -send-brand }\u201C, pasitelkiant abipus\u012F \u0161ifravim\u0105 ir riboto galiojimo sait\u0105.
trySendDescription = I\u0161bandykite \u201E{ -send-brand }\u201C paprastam ir saugiam dalijimuisi failais.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Vienu metu galima \u012Fkelti ne daugiau kaip { $count } fail\u0105.
        [few] Vienu metu galima \u012Fkelti ne daugiau kaip { $count } failus.
       *[other] Vienu metu galima \u012Fkelti ne daugiau kaip { $count } fail\u0173.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Leid\u017Eiama tur\u0117ti iki ne daugiau kaip { $count } archyv\u0105.
        [few] Leid\u017Eiama tur\u0117ti iki ne daugiau kaip { $count } archyvus.
       *[other] Leid\u017Eiama tur\u0117ti iki ne daugiau kaip { $count } archyv\u0173.
    }
expiredTitle = \u0160is saitas nebegalioja.
notSupportedDescription = \u201E{ -send-brand }\u201C su \u0161ia nar\u0161ykle neveikia. \u201E{ -send-short-brand }\u201C geriausiai veikia su paskiausia \u201E{ -firefox }\u201C laida, o taip pat veikia su daugumos kit\u0173 nar\u0161ykli\u0173 paskiausiomis laidomis.
downloadFirefox = Parsisi\u0173sti \u201E{ -firefox }\u201C
legalTitle = \u201E{ -send-short-brand }\u201C privatumo prane\u0161imas
legalDateStamp = 1.0 versija, 2019 m. kovo 12 d
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }\xA0d. { $hours }\xA0val. { $minutes }\xA0min.
addFilesButton = Rinktis failus \u012Fk\u0117limui
uploadButton = \u012Ekelti
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = U\u017Etempkite ir numeskite failus \u010Dia
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = arba spustel\u0117kite mygtuk\u0105 ir dalinkit\u0117s failais iki { $size }
addPassword = Apsaugoti slapta\u017Eod\u017Eiu
emailPlaceholder = \u012Eveskite savo el.\xA0pa\u0161to adres\u0105
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Prisijunkite, jeigu norite si\u0173sti iki { $size }
signInOnlyButton = Prisijungti
accountBenefitTitle = Susikurkite \u201E{ -firefox }\u201C paskyr\u0105 arba prisijunkite
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Dalinkit\u0117s iki { $size } dyd\u017Eio failais
accountBenefitDownloadCount = Dalinkit\u0117s su daugiau \u017Emoni\u0173
accountBenefitTimeLimit =
    { $count ->
        [one] I\u0161laikykite saitus galiojan\u010Diais iki { $count } dienos.
        [few] I\u0161laikykite saitus galiojan\u010Diais iki { $count } dien\u0173.
       *[other] I\u0161laikykite saitus galiojan\u010Diais iki { $count } dien\u0173.
    }
accountBenefitSync = Tvarkykite failus, kuriais dalijat\u0117s, i\u0161 bet kurio \u012Frenginio
accountBenefitMoz = Su\u017Einokite apie kitas \u201E{ -mozilla(case: "genitive") }\u201C paslaugas
signOut = Atsijungti
okButton = Gerai
downloadingTitle = Parsiun\u010Diama
noStreamsWarning = j\u016Bs\u0173 nar\u0161yklei gali nepavykti i\u0161\u0161ifruoti tokio didelio failo.
noStreamsOptionCopy = Nukopijuokite sait\u0105 ir atverkite j\u012F kita nar\u0161ykle
noStreamsOptionFirefox = I\u0161bandykite m\u016Bs\u0173 m\u0117gstamiausi\u0105 nar\u0161ykl\u0119
noStreamsOptionDownload = T\u0119sti naudojantis \u0161ia nar\u0161ykle
downloadFirefoxPromo = \u201E{ -send-short-brand }\u201C jums atkeliauja i\u0161 naujosios \u201E{ -firefox }\u201C.
# the next line after the colon contains a file name
shareLinkDescription = Pasidalinkite saitu \u012F j\u016Bs\u0173 fail\u0105:
shareLinkButton = Dalintis saitu
# $name is the name of the file
shareMessage = Atsisi\u0173skite \u201E{ $name }\u201C su \u201E{ -send-brand }\u201C: paprastas, saugus dalinimasis failais
trailheadPromo = Yra b\u016Bdas apsaugoti j\u016Bs\u0173 privatum\u0105. Naudokite \u201EFirefox\u201C.
learnMore = Su\u017Einoti daugiau.
`;
export {
  lt_default as default
};
//# sourceMappingURL=lt-4LNKOM3L.js.map
