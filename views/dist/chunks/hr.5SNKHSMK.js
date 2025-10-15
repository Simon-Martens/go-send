var n=`title = Go Send
importingFile = Uvoz\u2026
encryptingFile = \u0160ifriranje \u2026
decryptingFile = De\u0161ifriranje \u2026
downloadCount =
    { $num ->
        [one] { $num } preuzimanje
        [few] { $num } preuzimanja
       *[other] { $num } preuzimanja
    }
timespanHours =
    { $num ->
        [one] { $num } sat
        [few] { $num } sata
       *[other] { $num } sati
    }
copiedUrl = Kopirano!
unlockInputPlaceholder = Lozinka
unlockButtonLabel = Otklju\u010Daj
downloadButtonLabel = Preuzmi
downloadFinish = Preuzimanje je zavr\u0161eno.
fileSizeProgress = ({ $partialSize } od { $totalSize })
sendYourFilesLink = Isprobaj Send
errorPageHeader = Dogodila se neka gre\u0161ka!
fileTooBig = Datoteka je prevelika za prijenos. Mora biti manja od { $size }.
linkExpiredAlt = Poveznica je istekla
notSupportedHeader = Tvoj preglednik nije podr\u017Ean.
notSupportedLink = Za\u0161to moj preglednik nije podr\u017Ean?
notSupportedOutdatedDetail = Na\u017Ealost, ovo izdanje Firefoxa ne podr\u017Eava web tehnologiju koja omogu\u0107ava Send. Morat \u0107e\u0161 a\u017Eurirati preglednik.
updateFirefox = A\u017Euriraj Firefox
deletePopupCancel = Odustani
deleteButtonHover = Obri\u0161i
passwordTryAgain = Neto\u010Dna lozinka. Poku\u0161aj ponovo.
javascriptRequired = Za Send potreban je JavaScript
whyJavascript = Za\u0161to je za Send potreban JavaScript?
enableJavascript = Aktiviraj JavaScript i poku\u0161aj ponovo.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }s { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }min
# A short status message shown when the user enters a long password
maxPasswordLength = Maksimalna duljina lozinke: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Lozinku nije mogu\u0107e postaviti

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Jednostavno i privatno dijeljenje datoteka
introDescription = { -send-brand } omogu\u0107ava dijeljenje datoteka sa \u0161ifriranjem i poveznicom koja \u0107e automatski iste\u0107i. Ovim putem, stvari koje dijeli\u0161 ostaju privatne i osigurava\u0161 se da ne ostaju zauvijek dostupne na internetu.
notifyUploadEncryptDone = Tvoja je datoteka \u0161ifrirana i spremna za slanje.
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Iste\u0107i \u0107e nakon { $downloadCount } ili { $timespan }
timespanMinutes =
    { $num ->
        [one] { $num } minuta
        [few] { $num } minute
       *[other] { $num } minuta
    }
timespanDays =
    { $num ->
        [one] { $num } dan
        [few] { $num } dana
       *[other] { $num } dana
    }
timespanWeeks =
    { $num ->
        [one] { $num } tjedan
        [few] { $num } tjedna
       *[other] { $num } tjedana
    }
fileCount =
    { $num ->
        [one] { $num } datoteka
        [few] { $num } datoteke
       *[other] { $num } datoteka
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
totalSize = Ukupna veli\u010Dina: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Kopiraj poveznicu za dijeljenje svoje datoteke:
copyLinkButton = Kopiraj poveznicu
downloadTitle = Preuzmi datoteke
downloadDescription = Ova se datoteka dijelila putem usluge { -send-brand } sa \u0161ifriranjem i poveznicom koja \u0107e automatski iste\u0107i.
trySendDescription = Probaj { -send-brand } za jednostavno i sigurno dijeljenje datoteka.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Istovremeno se mo\u017Ee prenijeti samo { $count } datoteka.
        [few] Istovremeno se mo\u017Ee prenijeti samo { $count } datoteke.
       *[other] Istovremeno se mo\u017Ee prenijeti samo { $count } datoteka.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Dozvoljena je samo { $count } arhiva.
        [few] Dozvoljene su samo { $count } arhive.
       *[other] Dozvoljeno je samo { $count } arhiva.
    }
expiredTitle = Poveznica je istekla.
notSupportedDescription = { -send-brand } ne\u0107e raditi s ovim preglednikom. { -send-short-brand } najbolje radi sa zadnjom { -firefox } verzijom i radit \u0107e s aktualnim verzijama ve\u0107ine preglednika.
downloadFirefox = Preuzmi { -firefox }
legalTitle = { -send-short-brand } politika privatnosti
legalDateStamp = Verzija 1.0, od 12. o\u017Eujka 2019. godine
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }s { $minutes }m
addFilesButton = Odaberi datoteke za prijenos
uploadButton = Prijenos
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Povuci i ispusti datoteke
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ili pritisni gumb, za slanje do { $size }
addPassword = Za\u0161titi s lozinkom
emailPlaceholder = Upi\u0161i svoju e-adresu
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Prijavi se, za slanje do { $size }
signInOnlyButton = Prijavi se
accountBenefitTitle = Otvori { -firefox } ra\u010Dun ili se prijavi
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Dijeli datoteke do { $size }
accountBenefitDownloadCount = Dijeli datoteke s vi\u0161e osoba
accountBenefitTimeLimit =
    { $count ->
        [one] Ostavi poveznice aktivnima { $count } dan
        [few] Ostavi poveznice aktivnima { $count } dana
       *[other] Ostavi poveznice aktivnima { $count } dana
    }
accountBenefitSync = Upravljaj dijeljenim datotekama s bilo kojeg ure\u0111aja
accountBenefitMoz = Saznaj vi\u0161e o drugim { -mozilla } uslugama
signOut = Odjavi se
okButton = U redu
downloadingTitle = Preuzimanje
noStreamsWarning = Ovaj preglednik mo\u017Eda ne\u0107e mo\u0107i de\u0161ifrirati datoteku ove veli\u010Dine.
noStreamsOptionCopy = Za otvaranje u drugom pregledniku, kopiraj poveznicu
noStreamsOptionFirefox = Isprobaj na\u0161 omiljeni preglednik
noStreamsOptionDownload = Nastavi s ovim preglednikom
downloadFirefoxPromo = Potpuno novi { -firefox } donosi { -send-short-brand }.
# the next line after the colon contains a file name
shareLinkDescription = Dijeli poveznicu na tvoju datoteku:
shareLinkButton = Dijeli poveznicu
# $name is the name of the file
shareMessage = Preuzmi \u201E{ $name }\u201D pomo\u0107u { -send-brand }: jednostavno i sigurno dijeljenje datoteka
trailheadPromo = Postoji na\u010Din, kako za\u0161tititi vlastitu privatnost. Pridru\u017Ei se Firefoxu.
learnMore = Saznaj vi\u0161e.
`;export{n as default};
