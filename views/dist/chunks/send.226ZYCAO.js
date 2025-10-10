import"./chunk.E3IN6YWE.js";var n=`title = Go Send
importingFile = Importowanie\u2026
encryptingFile = Szyfrowanie\u2026
decryptingFile = Odszyfrowywanie\u2026
downloadCount =
    { $num ->
        [one] 1 pobraniu
        [few] { $num } pobraniach
       *[many] { $num } pobraniach
    }
timespanHours =
    { $num ->
        [one] godzinie
        [few] { $num } godzinach
       *[many] { $num } godzinach
    }
copiedUrl = Skopiowano
unlockInputPlaceholder = Has\u0142o
unlockButtonLabel = Odblokuj
downloadButtonLabel = Pobierz
downloadFinish = Uko\u0144czono pobieranie
fileSizeProgress = ({ $partialSize } z\xA0{ $totalSize })
sendYourFilesLink = Wypr\xF3buj Send
errorPageHeader = Co\u015B si\u0119 nie uda\u0142o.
fileTooBig = Ten plik jest za du\u017Cy, aby go wys\u0142a\u0107. Musi by\u0107 mniejszy ni\u017C { $size }
linkExpiredAlt = Odno\u015Bnik wygas\u0142
notSupportedHeader = U\u017Cywana przegl\u0105darka nie jest obs\u0142ugiwana.
notSupportedLink = Dlaczego ta przegl\u0105darka nie jest obs\u0142ugiwana?
notSupportedOutdatedDetail = Ta wersja Firefoksa nie obs\u0142uguje technologii internetowej, kt\xF3ra nap\u0119dza Send. Nale\u017Cy uaktualni\u0107 przegl\u0105dark\u0119.
updateFirefox = Uaktualnij Firefoksa
deletePopupCancel = Anuluj
deleteButtonHover = Usu\u0144
passwordTryAgain = Niepoprawne has\u0142o. Spr\xF3buj ponownie.
javascriptRequired = Send wymaga j\u0119zyka JavaScript
whyJavascript = Dlaczego Send wymaga j\u0119zyka JavaScript?
enableJavascript = W\u0142\u0105cz obs\u0142ug\u0119 j\u0119zyka JavaScript i\xA0spr\xF3buj ponownie.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }\xA0godz. { $minutes }\xA0min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }\xA0min
# A short status message shown when the user enters a long password
maxPasswordLength = Maksymalna d\u0142ugo\u015B\u0107 has\u0142a: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Nie mo\u017Cna ustawi\u0107 tego has\u0142a

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Proste, prywatne udost\u0119pnianie plik\xF3w
introDescription = { -send-brand } umo\u017Cliwia udost\u0119pnianie plik\xF3w za pomoc\u0105 szyfrowania typu \u201Eend-to-end\u201D i\xA0odno\u015Bnik\xF3w, kt\xF3re automatycznie wygasaj\u0105. Dzi\u0119ki temu mo\u017Cesz mie\u0107 pewno\u015B\u0107, \u017Ce to co udost\u0119pniasz jest bezpieczne i\xA0nie pozostanie w\xA0Internecie na zawsze.
notifyUploadEncryptDone = Plik jest zaszyfrowany i\xA0gotowy do wys\u0142ania
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Wygasa po { $downloadCount } lub { $timespan }
timespanMinutes =
    { $num ->
        [one] minucie
        [few] { $num } minutach
       *[many] { $num } minutach
    }
timespanDays =
    { $num ->
        [one] dniu
        [few] { $num } dniach
       *[many] { $num } dniach
    }
timespanWeeks =
    { $num ->
        [one] tygodniu
        [few] { $num } tygodniach
       *[many] { $num } tygodniach
    }
fileCount =
    { $num ->
        [one] 1 plik
        [few] { $num } pliki
       *[many] { $num } plik\xF3w
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
fileSize = { $num }\xA0{ $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Ca\u0142kowity rozmiar: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Skopiuj odno\u015Bnik, aby udost\u0119pni\u0107 plik:
copyLinkButton = Kopiuj odno\u015Bnik
downloadTitle = Pobierz pliki
downloadDescription = Ten plik zosta\u0142 udost\u0119pniony przez { -send-brand } za pomoc\u0105 szyfrowania typu \u201Eend-to-end\u201D i\xA0odno\u015Bnika, kt\xF3ry automatycznie wygasa.
trySendDescription = Wypr\xF3buj { -send-brand }, aby prosto i\xA0bezpiecznie udost\u0119pnia\u0107 pliki.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Jednocze\u015Bnie mo\u017Cna wysy\u0142a\u0107 tylko jeden plik.
        [few] Jednocze\u015Bnie mo\u017Cna wysy\u0142a\u0107 tylko { $count } pliki.
       *[many] Jednocze\u015Bnie mo\u017Cna wysy\u0142a\u0107 tylko { $count } plik\xF3w.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Dozwolone jest tylko jedno archiwum.
        [few] Dozwolone s\u0105 tylko { $count } archiwa.
       *[many] Dozwolonych jest tylko { $count } archiw\xF3w.
    }
expiredTitle = Ten odno\u015Bnik wygas\u0142.
notSupportedDescription = { -send-brand } nie b\u0119dzie dzia\u0142a\u0107 w\xA0tej przegl\u0105darce. { -send-short-brand } najlepiej dzia\u0142a w\xA0najnowszej wersji przegl\u0105darki { -firefox }, ale b\u0119dzie dzia\u0142a\u0107 tak\u017Ce w\xA0aktualnych wersjach wi\u0119kszo\u015Bci przegl\u0105darek.
downloadFirefox = Pobierz przegl\u0105dark\u0119 { -firefox }
legalTitle = Zasady ochrony prywatno\u015Bci serwisu { -send-short-brand }
legalDateStamp = Wersja 1.0 z\xA012 marca 2019\xA0r.
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }\xA0d. { $hours }\xA0godz. { $minutes }\xA0min
addFilesButton = Wybierz pliki do wys\u0142ania
uploadButton = Wy\u015Blij
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Przeci\u0105gnij pliki
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = lub kliknij, aby wys\u0142a\u0107 do { $size }
addPassword = Chro\u0144 has\u0142em
emailPlaceholder = Wpisz adres e-mail
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Zaloguj si\u0119, aby wys\u0142a\u0107 do { $size }
signInOnlyButton = Zaloguj si\u0119
accountBenefitTitle = Utw\xF3rz konto { -firefox } lub zaloguj si\u0119
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Udost\u0119pniaj pliki do { $size }
accountBenefitDownloadCount = Udost\u0119pniaj pliki wi\u0119kszej liczbie os\xF3b
accountBenefitTimeLimit =
    { $count ->
        [one] Odno\u015Bniki aktywne przez jeden dzie\u0144
        [few] Odno\u015Bniki aktywne przez { $count } dni
       *[many] Odno\u015Bniki aktywne przez { $count } dni
    }
accountBenefitSync = Zarz\u0105dzaj udost\u0119pnionymi plikami z\xA0ka\u017Cdego urz\u0105dzenia
accountBenefitMoz = Poznaj inne serwisy organizacji { -mozilla }
signOut = Wyloguj si\u0119
okButton = OK
downloadingTitle = Pobieranie
noStreamsWarning = Ta przegl\u0105darka mo\u017Ce nie by\u0107 w\xA0stanie odszyfrowa\u0107 tak du\u017Cego pliku.
noStreamsOptionCopy = Skopiuj odno\u015Bnik, aby otworzy\u0107 w\xA0innej przegl\u0105darce
noStreamsOptionFirefox = Wypr\xF3buj nasz\u0105 ulubion\u0105 przegl\u0105dark\u0119
noStreamsOptionDownload = Kontynuuj za pomoc\u0105 tej przegl\u0105darki
downloadFirefoxPromo = { -send-short-brand } jest oferowany przez zupe\u0142nie now\u0105 przegl\u0105dark\u0119 { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Udost\u0119pnij odno\u015Bnik do pliku:
shareLinkButton = Udost\u0119pnij odno\u015Bnik
# $name is the name of the file
shareMessage = Pobierz \u201E{ $name }\u201D za pomoc\u0105 { -send-brand }: prostego i\xA0bezpiecznego udost\u0119pniania plik\xF3w
trailheadPromo = Jest spos\xF3b na ochron\u0119 swojej prywatno\u015Bci. Do\u0142\u0105cz do Firefoksa.
learnMore = Wi\u0119cej informacji.
`;export{n as default};
