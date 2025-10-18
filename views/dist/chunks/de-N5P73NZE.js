// locales/de.ftl
var de_default = `title = Go Send
importingFile = Wird importiert\u2026
encryptingFile = Wird verschl\xFCsselt\u2026
decryptingFile = Wird entschl\xFCsselt\u2026
downloadCount =
    { $num ->
        [one] einem Download
       *[other] { $num } Downloads
    }
timespanHours =
    { $num ->
        [one] einer Stunde
       *[other] { $num } Stunden
    }
copiedUrl = Kopiert!
unlockInputPlaceholder = Passwort
unlockButtonLabel = Entsperren
downloadButtonLabel = Herunterladen
downloadFinish = Download abgeschlossen
fileSizeProgress = ({ $partialSize } von { $totalSize })
sendYourFilesLink = Startseite
errorPageHeader = Ein Fehler ist aufgetreten!
fileTooBig = Die Datei ist zu gro\xDF zum Hochladen. Sie sollte maximal { $size } gro\xDF sein.
linkExpiredAlt = Link abgelaufen
notSupportedHeader = Ihr Browser wird nicht unterst\xFCtzt.
notSupportedLink = Warum wird mein Browser nicht unterst\xFCtzt?
notSupportedOutdatedDetail = Leider unterst\xFCtzt diese Firefox-Version die Web-Technologie nicht, auf der Send basiert. Sie m\xFCssen Ihren Browser aktualisieren.
updateFirefox = Firefox aktualisieren
deletePopupCancel = Abbrechen
deleteButtonHover = L\xF6schen
passwordTryAgain = Falsches Passwort. Versuchen Sie es nochmal.
javascriptRequired = Send ben\xF6tigt JavaScript
whyJavascript = Warum ben\xF6tigt Send JavaScript?
enableJavascript = Bitte aktivieren Sie JavaScript und versuchen Sie es erneut.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Maximale Passwortl\xE4nge: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Dieses Passwort konnte nicht eingerichtet werden

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Einfach und privat Dateien versenden
introDescription = Mit { -send-brand } k\xF6nnen Sie Dateien sicher mit anderen teilen \u2013 mit Ende-zu-Ende-Verschl\xFCsselung und einem Freigabe-Link, der automatisch abl\xE4uft. So bleiben Ihre geteilten Daten privat und Sie k\xF6nnen sicherstellen, dass Ihre Daten nicht f\xFCr immer im Web herumschwirren.
notifyUploadEncryptDone = Ihre Datei wurde verschl\xFCsselt
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = L\xE4uft nach { $downloadCount } oder { $timespan } ab
timespanMinutes =
    { $num ->
        [one] 1 Minute
       *[other] { $num } Minuten
    }
timespanDays =
    { $num ->
        [one] 1 Tag
       *[other] { $num } Tage
    }
timespanWeeks =
    { $num ->
        [one] 1 Woche
       *[other] { $num } Wochen
    }
fileCount =
    { $num ->
        [one] 1 Datei
       *[other] { $num } Dateien
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
totalSize = Gesamtgr\xF6\xDFe: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Diesen Link kopieren, um Ihre Datei zu teilen:
copyLinkButton = Link kopieren
downloadTitle = Dateien herunterladen
downloadDescription =  Diese Datei ist Ende-zu-Ende verschl\xFCsselt.
trySendDescription = Probieren Sie { -send-brand } aus, um einfach und sicher Dateien zu versenden.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Es kann maximal eine Datei auf einmal hochgeladen werden.
       *[other] Es k\xF6nnen maximal { $count } Dateien auf einmal hochgeladen werden.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Es ist nur ein  Archiv erlaubt.
       *[other] Es sind nur { $count } Archive erlaubt.
    }
expiredTitle = Dieser Link ist abgelaufen.
notSupportedDescription = { -send-brand } funktioniert nicht mit diesem Browser. { -send-short-brand } funktioniert am besten mit der neuesten Version von { -firefox } und funktioniert mit der aktuellen Version der meisten Browser.
downloadFirefox = { -firefox } herunterladen
legalTitle = Datenschutzerkl\xE4rung zu { -send-short-brand }
legalDateStamp = Version 1.0, Stand 12. M\xE4rz 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Dateien zum Hochladen ausw\xE4hlen
uploadButton = Hochladen
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Dateien per Drag & Drop einf\xFCgen
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = oder klicken, um bis zu { $size } zu senden
addPassword = Mit Passwort sch\xFCtzen
emailPlaceholder = E-Mail-Adresse eingeben
archiveNameLabel = Archivname
archiveNameHint = Der Name, den Empf\xE4nger beim Herunterladen sehen
archiveNameInvalidChars = Dateiname darf nicht enthalten: < > : " / \\ | ? *
archiveNameInvalidEnd = Dateiname darf nicht mit einem Punkt oder Leerzeichen enden
archiveNameReserved = Dieser Dateiname ist vom System reserviert
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = melden Sie sich an, um Dateien bis { $size } zu senden
signInOnlyButton = Anmelden
accountBenefitTitle = Erstellen Sie ein { -firefox }-Konto oder melde Sie sich an
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Dateien bis zu { $size } teilen
accountBenefitDownloadCount = Teile Dateien mit weiteren Leuten
accountBenefitTimeLimit =
    { $count ->
        [one] Link bis zu einen Tag lang aktiv halten
       *[other] Link bis zu { $count } Tage lang aktiv halten
    }
accountBenefitSync = Geteilte Dateien von anderen Ger\xE4ten aus verwalten
accountBenefitMoz = Mehr \xFCber andere { -mozilla }-Dienste erfahren
signOut = Abmelden
okButton = OK
downloadingTitle = Wird heruntergeladen\u2026
noStreamsWarning = Dieser Browser kann eine so gro\xDFe Datei m\xF6glicherweise nicht entschl\xFCsseln.
noStreamsOptionCopy = Kopieren Sie den Link, um ihn in einem anderen Browser zu \xF6ffnen
noStreamsOptionFirefox = Probieren Sie unseren Lieblingsbrowser aus
noStreamsOptionDownload = Mit diesem Browser weitermachen
downloadFirefoxPromo = { -send-short-brand } wird Ihnen pr\xE4sentiert vom brandneuen { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Teilen Sie den Link zu Ihrer Datei:
shareLinkButton = Link teilen
# $name is the name of the file
shareMessage = Laden Sie \u201E{ $name }\u201C mit { -send-brand } herunter: einfaches, sicheres Teilen von Dateien
trailheadPromo = Es gibt einen Weg, deine Privatsph\xE4re zu sch\xFCtzen. Komm zu Firefox.
learnMore = Mehr erfahren.

sponsoredByThunderbird = Gesponsert von Thunderbird

## Registration strings

registerAdminTitle = Administrator registrieren
registerUserTitle = Benutzer registrieren
registerAdminDescription = Erstellen Sie Ihr Administrator-Konto
registerUserDescription = Erstellen Sie Ihr Benutzerkonto
registerNameLabel = Name
registerNamePlaceholder = Ihr Name
registerEmailLabel = E-Mail
registerEmailPlaceholder = ihre@email.de
registerPasswordLabel = Passwort
registerPasswordHint = Mindestens 10 Zeichen
registerPasswordConfirmLabel = Passwort best\xE4tigen
registerSubmitButton = Konto erstellen
registerSuccessTitle = Konto erfolgreich erstellt
registerSuccessMessage = Willkommen, { $name }! Ihr Administrator-Konto wurde erstellt.
registerSuccessButton = Zum Hochladen
registerErrorPasswordsMismatch = Die Passw\xF6rter stimmen nicht \xFCberein
registerErrorMissingToken = Ung\xFCltiger Registrierungslink
registerErrorGeneric = Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.
registerSubmitting = Konto wird erstellt\u2026

authErrorInvalidEmail = Bitte geben Sie eine g\xFCltige E-Mail-Adresse ein
authErrorPasswordLength = Das Passwort muss mindestens 10 Zeichen lang sein
authErrorCryptoUnsupported = Ihr Browser unterst\xFCtzt die erforderlichen Kryptografie-APIs nicht.

## Login strings

loginTitle = Anmeldung
loginDescription = Geben Sie Ihre Zugangsdaten ein, um fortzufahren
loginEmailLabel = E-Mail
loginPasswordLabel = Passwort
loginSubmitButton = Anmelden
loginSubmitting = Anmeldung l\xE4uft\u2026
loginErrorChallenge = Anmeldeanforderung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.
loginErrorGeneric = Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.
`;
export {
  de_default as default
};
//# sourceMappingURL=de-N5P73NZE.js.map
