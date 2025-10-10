import"./chunk.E3IN6YWE.js";var n=`title = Go Send
importingFile = Prob\xEDh\xE1 import\u2026
encryptingFile = Prob\xEDh\xE1 \u0161ifrov\xE1n\xED\u2026
decryptingFile = Prob\xEDh\xE1 de\u0161ifrov\xE1n\xED\u2026
downloadCount =
    { $num ->
        [one] jednom sta\u017Een\xED
        [few] { $num } sta\u017Een\xEDch
       *[other] { $num } sta\u017Een\xEDch
    }
timespanHours =
    { $num ->
        [one] hodinu
        [few] { $num } hodiny
       *[other] { $num } hodin
    }
copiedUrl = Zkop\xEDrov\xE1no!
unlockInputPlaceholder = Heslo
unlockButtonLabel = Odemknout
downloadButtonLabel = St\xE1hnout
downloadFinish = Stahov\xE1n\xED dokon\u010Deno
fileSizeProgress = ({ $partialSize } z { $totalSize })
sendYourFilesLink = Vyzkou\u0161et Send
errorPageHeader = Nastala chyba!
fileTooBig = Tento soubor je p\u0159\xEDli\u0161 velik\xFD. Velikost nahr\xE1van\xFDch soubor\u016F by nem\u011Bla p\u0159ekro\u010Dit { $size }.
linkExpiredAlt = Platnost odkazu vypr\u0161ela
notSupportedHeader = V\xE1\u0161 prohl\xED\u017Ee\u010D nen\xED podporov\xE1n.
notSupportedLink = Pro\u010D nen\xED m\u016Fj prohl\xED\u017Ee\u010D podporovan\xFD?
notSupportedOutdatedDetail = Tato verze Firefoxu bohu\u017Eel nepodporuje webovou technologii, kter\xE1 poh\xE1n\xED Send. Mus\xEDte aktualizovat sv\u016Fj prohl\xED\u017Ee\u010D.
updateFirefox = Aktualizovat Firefox
deletePopupCancel = Zru\u0161it
deleteButtonHover = Smazat
passwordTryAgain = \u0160patn\xE9 heslo. Zkuste to znovu.
javascriptRequired = Send vy\u017Eaduje povolen\xFD JavaScript
whyJavascript = Pro\u010D Send vy\u017Eaduje povolen\xFD JavaScript?
enableJavascript = Povolte JavaScript a zkuste to znovu.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } h { $minutes } m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } m
# A short status message shown when the user enters a long password
maxPasswordLength = Maxim\xE1ln\xED d\xE9lka hesla: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Toto heslo nemohlo b\xFDt nastaveno

## Send version 2 strings

-send-brand =
    { $case ->
       *[nom] Send
        [gen] Sendu
        [dat] Sendu
        [acc] Send
        [voc] Sende
        [loc] Sendu
        [ins] Sendem
    }
-send-short-brand =
    { $case ->
       *[nom] Send
        [gen] Sendu
        [dat] Sendu
        [acc] Send
        [voc] Sende
        [loc] Sendu
        [ins] Sendem
    }
-firefox =
    { $case ->
       *[nom] Firefox
        [gen] Firefoxu
        [dat] Firefoxu
        [acc] Firefox
        [voc] Firefoxe
        [loc] Firefoxu
        [ins] Firefoxem
    }
-mozilla =
    { $case ->
       *[nom] Mozilla
        [gen] Mozilly
        [dat] Mozille
        [acc] Mozillu
        [voc] Mozillo
        [loc] Mozille
        [ins] Mozillou
    }
introTitle = Jednoduch\xE9 a soukrom\xE9 sd\xEDlen\xED soubor\u016F
introDescription = Se { -send-brand(case: "ins") } jsou sd\xEDlen\xE9 soubory \u0161ifrovan\xE9 end-to-end, tak\u017Ee ani my nev\xEDme, co sd\xEDl\xEDte. Platnost odkaz\u016F je nav\xEDc omezen\xE1. Soubory tak m\u016F\u017Eete sd\xEDlet soukrom\u011B a s jistotou, \u017Ee se nez\u016Fstanou na internetu v\xE1let nav\u017Edy.
notifyUploadEncryptDone = V\xE1\u0161 soubor je za\u0161ifrovan\xFD a p\u0159ipraven k odesl\xE1n\xED
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Platnost vypr\u0161\xED po { $downloadCount } nebo za { $timespan }
timespanMinutes =
    { $num ->
        [one] jednu minutu
        [few] { $num } minuty
       *[other] { $num } minut
    }
timespanDays =
    { $num ->
        [one] jeden den
        [few] { $num } dny
       *[other] { $num } dn\xED
    }
timespanWeeks =
    { $num ->
        [one] t\xFDden
        [few] { $num } t\xFDdny
       *[other] { $num } t\xFDdn\u016F
    }
fileCount =
    { $num ->
        [one] jeden soubor
        [few] { $num } soubory
       *[other] { $num } soubor\u016F
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
totalSize = Celkov\xE1 velikost: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Soubor m\u016F\u017Eete sd\xEDlet t\xEDmto odkazem:
copyLinkButton = Zkop\xEDrovat odkaz
downloadTitle = St\xE1hnout soubory
downloadDescription = Tento soubor byl sd\xEDlen p\u0159es { -send-brand(case: "acc") } s end-to-end \u0161ifrov\xE1n\xEDm a odkazem s omezenou platnost\xED.
trySendDescription = Vyzkou\u0161ejte jednoduch\xE9 a bezpe\u010Dn\xE9 sd\xEDlen\xED soubor\u016F se { -send-brand(case: "ins") }
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Najednou lze nahr\xE1vat jen jeden soubor.
        [few] Najednou lze nahr\xE1vat jen { $count } soubory.
       *[other] Najednou lze nahr\xE1vat jen { $count } soubor\u016F.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Povolen je nejv\xFD\u0161e jeden archiv.
        [few] Povoleny jsou nejv\xFD\u0161e { $count } archivy.
       *[other] Povoleno je nejv\xFD\u0161e { $count } archiv\u016F.
    }
expiredTitle = Platnost tohoto odkazu vypr\u0161ela.
notSupportedDescription = { -send-brand } nebude v tomto prohl\xED\u017Ee\u010Di fungovat. Nejl\xE9pe { -send-short-brand } funguje v nejnov\u011Bj\u0161\xEDm { -firefox(case: "gen") } nebo aktu\xE1ln\xEDch verz\xEDch nejpou\u017E\xEDvan\u011Bj\u0161\xEDch prohl\xED\u017Ee\u010D\u016F.
downloadFirefox = St\xE1hnout { -firefox(case: "acc") }
legalTitle = Z\xE1sady { -send-short-brand(case: "acc") } pro ochranu osobn\xEDch \xFAdaj\u016F
legalDateStamp = Verze 1.0, 12. b\u0159ezna 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Vyberte soubory k nahr\xE1n\xED
uploadButton = Nahr\xE1t
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = P\u0159eta\u017Een\xEDm my\u0161\xED nebo kliknut\xEDm sem
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = m\u016F\u017Eete poslat a\u017E { $size }
addPassword = Ochr\xE1nit heslem
emailPlaceholder = Zadejte svoji e-mailovou adresu
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Pro odes\xEDl\xE1n\xED soubor\u016F o velikosti a\u017E { $size } se pros\xEDm p\u0159ihlaste
signInOnlyButton = P\u0159ihl\xE1sit se
accountBenefitTitle = Vytvo\u0159te si \xFA\u010Det { -firefox(case: "gen") } nebo se p\u0159ihlaste
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Sd\xEDlejte soubory o velikosti a\u017E { $size }
accountBenefitDownloadCount = Sd\xEDlejte soubory s v\xEDce lidmi
accountBenefitTimeLimit =
    { $count ->
        [one] Odkazy platn\xE9 a\u017E jeden den
        [few] Odkazy platn\xE9 a\u017E { $count } dny
       *[other] Odkazy platn\xE9 a\u017E { $count } dn\xED
    }
accountBenefitSync = Spr\xE1va sd\xEDlen\xFDch soubor\u016F z jak\xE9hokoliv za\u0159\xEDzen\xED
accountBenefitMoz = V\xEDce informac\xED o dal\u0161\xEDch slu\u017Eb\xE1ch od { -mozilla(case: "gen") }
signOut = Odhl\xE1sit se
okButton = OK
downloadingTitle = Stahov\xE1n\xED
noStreamsWarning = De\u0161ifrov\xE1n\xED tak velik\xE9ho souboru se v tomto prohl\xED\u017Ee\u010Di nemus\xED poda\u0159it.
noStreamsOptionCopy = Zkop\xEDrujte odkaz pro otev\u0159en\xED v jin\xE9m prohl\xED\u017Ee\u010Di
noStreamsOptionFirefox = Vyzkou\u0161ejte n\xE1\u0161 obl\xEDben\xFD prohl\xED\u017Ee\u010D
noStreamsOptionDownload = Pokra\u010Dovat v tomto prohl\xED\u017Ee\u010Di
downloadFirefoxPromo = { -send-short-brand } od aplikace { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Sd\xEDlet odkaz na soubor:
shareLinkButton = Sd\xEDlet odkaz
# $name is the name of the file
shareMessage = St\xE1hn\u011Bte si soubor \u201E{ $name }\u201C se { -send-brand(case: "ins") } - jednoduch\xE9 a bezpe\u010Dn\xE9 sd\xEDlen\xED soubor\u016F
trailheadPromo = Existuje zp\u016Fsob, jak ochr\xE1nit sv\xE9 soukrom\xED. Pou\u017E\xEDvejte Firefox.
learnMore = Zjistit v\xEDce.
`;export{n as default};
