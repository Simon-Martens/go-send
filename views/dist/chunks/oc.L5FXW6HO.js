var e=`title = Go Send
importingFile = Importacion\u2026
encryptingFile = Chiframent\u2026
decryptingFile = Deschiframent\u2026
downloadCount =
    { $num ->
        [one] 1\u202Ftelecargament
       *[other] { $num }\u202Ftelecargaments
    }
timespanHours =
    { $num ->
        [one] 1\u202Fora
       *[other] { $num }\u202Foras
    }
copiedUrl = Copiat\u202F!
unlockInputPlaceholder = Senhal
unlockButtonLabel = Desverrolhar
downloadButtonLabel = Telecargar
downloadFinish = Telecargament acabat
fileSizeProgress = ({ $partialSize } sus { $totalSize })
sendYourFilesLink = Ensajar Send
errorPageHeader = I a quic\xF2m que truca.
fileTooBig = Aqueste fichi\xE8r es tr\xF2p gr\xF2s per l\u2019enviar. Sa talha deu \xE8sser inferiora a { $size }.
linkExpiredAlt = Lo ligam a expirat
notSupportedHeader = V\xF2stre navegador es pas compatible.
notSupportedLink = Perqu\xE9 mon navegador es pas compatible ?
notSupportedOutdatedDetail = Aquesta version de Firefox es pas compatibla amb la tecnologia web amb la quala fonciona Send. Vos cal metre a jorn lo navegador.
updateFirefox = Metre a jorn Firefox
deletePopupCancel = Anullar
deleteButtonHover = Suprimir
passwordTryAgain = Senhal incorr\xE8cte. Tornatz ensajar.
javascriptRequired = Send reques\xEDs JavaScript
whyJavascript = Perque Send reques\xEDs JavaScript ?
enableJavascript = Volgatz activar lo JavaScript e ensajatz tornamai.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }\xA0h { $minutes }\xA0min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }\xA0min
# A short status message shown when the user enters a long password
maxPasswordLength = Talha maximala del senhal\xA0: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Aqueste senhal a pas pogut \xE8sser definit

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Partatge simple e privat de fichi\xE8rs
introDescription = { -send-brand } vos permet de partejar de fichi\xE8r amb un chiframent del cap a la fin e un ligam qu\u2019expira automaticament. Atal pod\xE8tz gardar  privat \xE7\xF2 que partejatz e vos assegurar que demorar\xE0 pas en linha per totjorn.
notifyUploadEncryptDone = V\xF2stre fichi\xE8r es chifrat e pr\xE8st per mandad\xEDs
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expira apr\xE8p { $downloadCount } o { $timespan }
timespanMinutes =
    { $num ->
        [one] 1\u202Fminuta
       *[other] { $num }\u202Fminutas
    }
timespanDays =
    { $num ->
        [one] 1\u202Fjorn
       *[other] { $num }\u202Fjorns
    }
timespanWeeks =
    { $num ->
        [one] 1\u202Fsetmana
       *[other] { $num }\u202Fsetmanas
    }
fileCount =
    { $num ->
        [one] 1\u202Ffichi\xE8r
       *[other] { $num }\u202Ffichi\xE8rs
    }
# byte abbreviation
bytes = o
# kibibyte abbreviation
kb = Ko
# mebibyte abbreviation
mb = Mo
# gibibyte abbreviation
gb = Go
# localized number and byte abbreviation. example "2.5MB"
fileSize = { $num }\xA0{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Talha totala\xA0: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copiatz lo ligam per partejar v\xF2stre fichi\xE8r\xA0:
copyLinkButton = Copiar lo ligam
downloadTitle = Telecargar los fichi\xE8rs
downloadDescription = Aqueste fichi\xE8r fogu\xE8t partejat via { -send-brand } amb chiframent del cap a la fin e un ligam qu\u2019expira automaticament.
trySendDescription = Ensajatz { -send-brand } per un partiment de fichi\xE8rs simple e segur.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] \xD2m p\xF2t pas qu\u2019enviar 1 fichi\xE8r al c\xF2p.
       *[other] \xD2m p\xF2t pas qu\u2019enviar { $count } fichi\xE8rs al c\xF2p.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Pas qu\u2019un archiu es autorizat.
       *[other] Pas que { $count } archius son autorizats.
    }
expiredTitle = Aqueste ligam a expirat.
notSupportedDescription = { -send-brand } foncionar\xE0 pas amb aqueste navegador. { -send-short-brand } fonciona melhor amb la darri\xE8ra version de { -firefox } e foncionar\xE0 amb la version mai recenta de la m\xE0ger part dels navegadors.
downloadFirefox = Telecargar { -firefox }
legalTitle = Av\xEDs de confidencialitat de { -send-short-brand }
legalDateStamp = Version 1.0 del 12 de mar\xE7 de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }\xA0j { $hours }\xA0h { $minutes }\xA0min
addFilesButton = Seleccionatz los fichi\xE8rs de mandar
uploadButton = Enviar
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Lisatz-depausatz de fichi\xE8rs
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = o clicatz per enviar fins a { $size }
addPassword = Protegir amb un senhal
emailPlaceholder = Picatz v\xF2stra adre\xE7a electronica
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Connectatz-vos per enviar fins a { $size }
signInOnlyButton = Connexion
accountBenefitTitle = Creatz un compte { -firefox } o connectatz-vos
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Partejatz de fichi\xE8rs fins a { $size }
accountBenefitDownloadCount = Partejatz de fichi\xE8rs amb mai de personas
accountBenefitTimeLimit =
    { $count ->
        [one] Manten\xE8tz los ligams actius fins a 1 jorn
       *[other] Manten\xE8tz los ligams actius fins a { $count } jorns
    }
accountBenefitSync = Geriss\xE8tz los fichi\xE8rs partejats de qualque si\xE1 periferic estant
accountBenefitMoz = Apren\xE8tz-ne mai suls autres servicis { -mozilla }
signOut = Desconnexion
okButton = D'ac\xF2rd
downloadingTitle = Telecargament
noStreamsWarning = P\xF2t arribar qu\u2019aqueste navegador p\xF2sca pas deschifrar un fichi\xE8r tan gr\xF2s.
noStreamsOptionCopy = Copiatz lo ligam per lo dobrir dins un autre navegador
noStreamsOptionFirefox = Ensajatz n\xF2stre navegador preferit
noStreamsOptionDownload = Contunhar amb aqueste navegador
downloadFirefoxPromo = Lo n\xF2u { -firefox } vos proves\xEDs { -send-short-brand }.
# the next line after the colon contains a file name
shareLinkDescription = Partejatz lo ligam cap a v\xF2stre fichi\xE8r :
shareLinkButton = Partejar lo ligam
# $name is the name of the file
shareMessage = Telecargar \xAB\xA0{ $name }\xA0\xBB amb { -send-brand }\xA0: un biais simple e segur de partejar de fichi\xE8rs.
trailheadPromo = Exist\xEDs un biais de protegir v\xF2stra vida privada. Rejonh\xE8tz Firefox.
learnMore = Ne saber mai.
`;export{e as default};
