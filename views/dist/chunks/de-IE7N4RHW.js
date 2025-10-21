import "./chunk-IFG75HHC.js";

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
uploadGuestBannerMessageGuest = Bitte denken Sie an \xF6ffentlichen Ger\xE4ten daran, sich abzumelden!
uploadGuestBannerMessageEphemeral = Dieses Ger\xE4t ist nicht vertrauensw\xFCrdig. Bitte denken Sie daran, sich abzumelden!
notifyUploadEncryptDone = Ihre Datei wurde verschl\xFCsselt
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = L\xE4uft nach { $downloadCount } oder { $timespan } ab
timespanMinutes =
    { $num ->
        [one] einer Minute
       *[other] { $num } Minuten
    }
timespanDays =
    { $num ->
        [one] einem Tag
       *[other] { $num } Tagen
    }
timespanWeeks =
    { $num ->
        [one] einer Woche
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
addFilesButton = Dateien ausw\xE4hlen
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
registerErrorNameRequired = Bitte geben Sie Ihren Namen ein
registerErrorMissingToken = Ung\xFCltiger Registrierungslink
registerErrorGeneric = Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.
registerSubmitting = Konto wird erstellt\u2026

authErrorInvalidEmail = Bitte geben Sie eine g\xFCltige E-Mail-Adresse ein
authErrorPasswordLength = Das Passwort muss mindestens 10 Zeichen lang sein
authErrorCryptoUnsupported = Ihr Browser unterst\xFCtzt die erforderlichen Kryptografie-APIs nicht.

## Settings strings

footerLinkSettings = Einstellungen
settingsDialogTitle = Einstellungen
settingsDialogDescription = Verwalten Sie Ihre Kontoeinstellungen und Teammitglieder.
settingsBackButton = Upload
settingsNavAccount = Konto
settingsNavUploadLinks = Upload-Tickets
settingsNavUsers = Benutzer
settingsAccountHeading = Konto
settingsAccountSubheading = Verwalten Sie Ihre Profildaten, Ihr Passwort und Ihre Anmeldesitzungen.
settingsAccountProfileHeading = Profil
settingsAccountProfileDescription = Aktualisieren Sie den Namen und die E-Mail-Adresse Ihres Kontos.
settingsAccountNameLabel = Name
settingsAccountEmailLabel = E-Mail
settingsAccountProfileSave = Profil speichern
settingsAccountPasswordHeading = Passwort
settingsAccountPasswordDescription = Legen Sie ein neues Passwort f\xFCr Ihr Konto fest. \xC4nderungen gelten sofort.
settingsAccountPasswordCurrentLabel = Aktuelles Passwort
settingsAccountPasswordNewLabel = Neues Passwort
settingsAccountPasswordConfirmLabel = Neues Passwort best\xE4tigen
settingsAccountPasswordSave = Passwort aktualisieren
settingsAccountPasswordHint = Passw\xF6rter m\xFCssen mindestens 10 Zeichen lang sein.
settingsAccountDangerHeading = Sitzungen & Zugriff
settingsAccountDangerDescription = L\xF6schen Sie Ihre aktuelle Sitzung oder deaktivieren Sie das Konto. Beides meldet Sie ab.
settingsAccountClearSessions = Sitzung l\xF6schen
settingsAccountDeactivate = Konto deaktivieren
settingsUsersHeading = Benutzer
settingsUsersIntro = Ihr Server ist derzeit nicht \xF6ffentlich zug\xE4nglich. Unter diesen Links k\xF6nnen neue Administratoren und Benutzer erstellt werden. Ausschlie\xDFlich Administratoren k\xF6nnen neue Benutzer einladen. Die Links sind sieben Tage g\xFCltig und k\xF6nnen nur einmal verwendet werden.
settingsUsersAdminTitle = Administrator-Anmeldelinks
settingsUsersAdminDescription = Erstellen Sie Einladungen f\xFCr Administrator-Konten.
settingsUsersUserTitle = Benutzer-Anmeldelinks
settingsUsersUserDescription = Erstellen Sie Einladungen f\xFCr Standardbenutzer.
settingsUsersActiveLinksLabel = Aktive Links
settingsUsersGenerateAdmin = Link erstellen
settingsUsersGenerateUser = Link erstellen
settingsUsersRevokeAdmin = Links widerrufen
settingsUsersRevokeUser = Links widerrufen
settingsUsersGenerating = Anmeldelink wird erstellt \u2026
settingsUsersGenerateSuccess = Anmeldelink erstellt.
settingsUsersGenerateError = Anmeldelink konnte nicht erstellt werden. Bitte versuchen Sie es erneut.
settingsUsersRevoking = Ausstehende Links werden widerrufen \u2026
settingsUsersRevokeSuccess = Ausstehende Anmeldelinks widerrufen.
settingsUsersRevokeError = Anmeldelinks konnten nicht widerrufen werden. Bitte versuchen Sie es erneut.
settingsUsersCopySuccess = Link in die Zwischenablage kopiert.
settingsUsersCopyError = Kopieren fehlgeschlagen. Bitte kopieren Sie den Link manuell.
settingsUsersOverviewError = Status der Anmeldelinks konnte nicht geladen werden.
settingsUsersQrError = QR-Code nicht verf\xFCgbar
settingsUsersDetailBack = Zur\xFCck zu den Einladungen
settingsUsersDetailHeadingAdmin = Admin-Anmeldelink
settingsUsersDetailHeadingUser = Benutzer-Anmeldelink
settingsUsersDetailDescription = Teilen Sie diesen Link. Er l\xE4uft am { $date } Uhr ab und kann nur einmal verwendet werden.
settingsUsersDetailActiveLabel = Aktive Links
settingsUsersDetailFootnote = Jeder Einladungslink funktioniert nur einmal und l\xE4uft nach sieben Tagen automatisch ab.
settingsUsersDetailCopySuccess = Link in die Zwischenablage kopiert.
settingsUsersDetailCopyError = Kopieren fehlgeschlagen. Bitte kopieren Sie den Link manuell.
settingsUsersDetailExpiresUnknown = L\xE4uft bald ab
settingsUsersListHeading = Bestehende Benutzer
settingsUsersListName = Name
settingsUsersListEmail = E-Mail
settingsUsersListPublicKeys = \xD6ffentliche Schl\xFCssel
settingsUsersListSessions = Aktive Sitzungen
settingsUsersListActions = Aktionen
settingsUsersListLoading = Benutzer werden geladen \u2026
settingsUsersListError = Benutzer konnten nicht geladen werden. Bitte versuchen Sie es erneut.
settingsUsersListEmpty = Noch keine weiteren Benutzer.
settingsUsersActionClearSessions = Sitzungen l\xF6schen
settingsUsersActionDelete = Benutzer l\xF6schen
settingsUsersActionDeleteConfirm = M\xF6chten Sie { $name } wirklich l\xF6schen? Dieser Vorgang kann nicht r\xFCckg\xE4ngig gemacht werden.
settingsUsersActionDeleteSelfError = Sie k\xF6nnen Ihr eigenes Konto nicht l\xF6schen.
settingsUsersActionDeleteSuccess = { $name } wurde gel\xF6scht.
settingsUsersActionDeleteError = Benutzer konnte nicht gel\xF6scht werden. Bitte versuchen Sie es erneut.
settingsUsersActionDeleteWorking = Benutzer wird gel\xF6scht \u2026
settingsUsersActionClearSuccess = Sitzungen von { $name } wurden gel\xF6scht.
settingsUsersActionClearError = Sitzungen konnten nicht gel\xF6scht werden. Bitte versuchen Sie es erneut.
settingsUsersActionClearWorking = Sitzungen werden gel\xF6scht \u2026
settingsUsersActionDeleteSelfTooltip = Sie k\xF6nnen Ihr eigenes Konto nicht l\xF6schen.
settingsUsersActionClearDisabledTooltip = Keine aktiven Sitzungen zum L\xF6schen.
settingsUsersActionDeactivate = Deaktivieren
settingsUsersActionActivate = Aktivieren
settingsUsersActionDeactivateWorking = Benutzer wird deaktiviert \u2026
settingsUsersActionDeactivateSuccess = { $name } wurde deaktiviert.
settingsUsersActionDeactivateError = Benutzer konnte nicht deaktiviert werden. Bitte versuchen Sie es erneut.
settingsUsersActionDeactivateSelfError = Sie k\xF6nnen Ihr eigenes Konto nicht deaktivieren.
settingsUsersActionActivateWorking = Benutzer wird aktiviert \u2026
settingsUsersActionActivateSuccess = { $name } ist wieder aktiv.
settingsUsersActionActivateError = Benutzer konnte nicht aktiviert werden. Bitte versuchen Sie es erneut.
settingsUsersRoleAdmin = Administrator
settingsUsersRoleUser = Benutzer
settingsUsersRoleGuest = Gast
settingsUsersRoleUnknown = Unbekannte Rolle
settingsUsersStatusActive = Aktiv
settingsUsersStatusInactive = Deaktiviert
settingsUsersKeySigning = Signing Key
settingsUsersKeyEncryption = Encryption Key
settingsUsersKeyMissing = Nicht verf\xFCgbar
settingsUsersNameFallback = Benutzer
settingsUsersCurrentUserLabel = Sie
settingsAccountProfileStatusSaving = Profil wird gespeichert \u2026
settingsAccountProfileStatusSuccess = Profil aktualisiert.
settingsAccountProfileStatusError = Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.
settingsAccountProfileStatusNameRequired = Name ist erforderlich.
settingsAccountProfileStatusEmailRequired = E-Mail ist erforderlich.
settingsAccountProfileStatusEmailInvalid = Bitte geben Sie eine g\xFCltige E-Mail-Adresse ein.
settingsAccountProfileStatusEmailInUse = Diese E-Mail-Adresse wird bereits verwendet.
settingsAccountDangerStatusNotActive = Ihr Konto ist bereits deaktiviert.
settingsAccountDangerStatusClearing = Sitzung wird gel\xF6scht \u2026
settingsAccountDangerStatusDeactivating = Konto wird deaktiviert \u2026
settingsAccountDangerStatusError = Anfrage konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.
settingsUploadLinksHeading = Upload-Tickets
settingsUploadLinksDescription = Erstellen Sie Zug\xE4nge f\xFCr G\xE4ste, die Ihnen Dateien schicken k\xF6nnen.
settingsUploadLinksLabelLabel = Bezeichnung
settingsUploadLinksLabelHint = Verwenden Sie eine aussagekr\xE4ftige Bezeichnung, wie etwa den Namen des Gastes, damit Sie den Link sp\xE4ter wiedererkennen. Diese Bezeichnung ist f\xFCr den Benutzer sichtbar.
settingsUploadLinksLabelPlaceholder = Name
settingsUploadLinksDescriptionLabel = Interne Notiz
settingsUploadLinksDescriptionHint = Nur Administratoren k\xF6nnen diese Notiz sehen.
settingsUploadLinksDescriptionPlaceholder = Optionale Details
settingsUploadLinksCreateButton = Upload-Link erstellen
settingsUploadLinksStatusLabelRequired = Bitte geben Sie vor dem Erstellen einen Namen an.
settingsUploadLinksStatusCreating = Upload-Link wird erstellt \u2026
settingsUploadLinksStatusCreated = Upload-Link ist bereit.
settingsUploadLinksStatusError = Upload-Link konnte nicht erstellt werden. Bitte erneut versuchen.
settingsUploadLinksStatusRevoking = Upload-Link wird widerrufen \u2026
settingsUploadLinksStatusRevoked = Upload-Link widerrufen.
settingsUploadLinksStatusRevokeError = Upload-Link konnte nicht widerrufen werden. Bitte erneut versuchen.
settingsUploadLinksStatusLoading = Upload-Links werden geladen \u2026
settingsUploadLinksStatusLoadingError = Upload-Links konnten nicht geladen werden. Bitte erneut versuchen.
settingsUploadLinksDetailHeading = Neuer Upload-Link erstellt
settingsUploadLinksDetailDescription = Kopieren Sie diesen Link jetzt \u2013 er wird nicht erneut angezeigt.
settingsUploadLinksDetailLabelName = Bezeichnung
settingsUploadLinksDetailHint = Teilen Sie diesen Link nur mit Ihrem Gast.
settingsUploadLinksCopyButton = Link kopieren
settingsUploadLinksCopySuccess = Upload-Link wurde kopiert.
settingsUploadLinksCopyError = Kopieren fehlgeschlagen. Bitte manuell kopieren.
settingsUploadLinksTableHeading = Ausgestellte Links
settingsUploadLinksTableSubheading = Aktive Gast-Upload-Tokens
settingsUploadLinksTableLabel = Bezeichnung
settingsUploadLinksTablePreview = Vorschau
settingsUploadLinksTableStatus = Status
settingsUploadLinksTableCreated = Erstellt
settingsUploadLinksTableActions = Aktionen
settingsUploadLinksEmpty = Es wurden noch keine Upload-Links erstellt.
settingsUploadLinksStatusActive = Aktiv
settingsUploadLinksStatusRevokedLabel = Widerrufen
settingsUploadLinksRevokedBadge = Widerrufen
settingsUploadLinksLabelFallback = Upload-Link
settingsUploadLinksNoPreview = \u2014
settingsUploadLinksRevokeButton = Widerrufen
settingsUploadLinksCreatedUnknown = Nicht verf\xFCgbar
settingsUploadLinksPlaceholderTitle = Gast-Uploads
settingsUploadLinksPlaceholderDescription = Administratoren k\xF6nnen Gast-Upload-Links f\xFCr gemeinsame Postf\xE4cher ausgeben. Sobald ein Link mit Ihnen geteilt wird, erscheint er hier.
settingsUploadLinksGeneralLabel = Allgemeiner Upload-Link
settingsUploadLinksGeneralHint = Erlaubt Uploads auch f\xFCr alle anderen Benutzer
settingsUploadLinksTableType = Typ/Benutzer
settingsUploadLinksTypeGeneral = Allgemein
settingsUploadLinksTypeUserFallback = Benutzerspezifisch
recipientLockedHint = Dieser Upload-Link ist auf Uploads f\xFCr { $userName } beschr\xE4nkt
recipientHintSelected = Der Empf\xE4nger kann die Datei sehen, herunterladen und entschl\xFCsseln.
encryptForLabel = An
recipientUnspecified = Jeder mit dem Link
settingsAccountDeactivateConfirm = M\xF6chten Sie Ihr Konto wirklich deaktivieren? Sie werden sofort abgemeldet.
settingsAccountKeyHeading = Sicherung des privaten Schl\xFCssels
settingsAccountKeyDescription = Kopieren Sie Ihren privaten Verschl\xFCsselungsschl\xFCssel und bewahren Sie ihn sicher auf. Ohne diesen Schl\xFCssel verlieren Sie den Zugriff auf verschl\xFCsselte Daten. Halten Sie ihn geheim.
settingsAccountKeyCopyLabel = Privaten Schl\xFCssel kopieren
settingsAccountKeyStatusCopied = Privater Schl\xFCssel wurde kopiert.
settingsAccountKeyStatusError = Schl\xFCssel konnte nicht kopiert werden. Bitte erneut versuchen.
settingsAccountKeyStatusUnavailable = Privater Schl\xFCssel nicht verf\xFCgbar.
settingsAccountKeyUnavailable = Nicht verf\xFCgbar
settingsPasswordStatusInfoDeriving = Schl\xFCssel werden neu abgeleitet \u2026
settingsPasswordStatusInfoPreparing = Neue Anmeldedaten werden vorbereitet \u2026
settingsPasswordStatusInfoUpdating = Passwort wird aktualisiert \u2026
settingsPasswordStatusErrorCurrent = Das aktuelle Passwort wird ben\xF6tigt.
settingsPasswordStatusErrorNewLength = Das neue Passwort muss mindestens 10 Zeichen lang sein.
settingsPasswordStatusErrorMismatch = Die neuen Passw\xF6rter stimmen nicht \xFCberein.
settingsPasswordStatusErrorNoSession = Keine Sitzung gefunden. Bitte melden Sie sich erneut an.
settingsPasswordStatusErrorMissingKeys = Fehlendes Schl\xFCsselmaterial. Bitte melden Sie sich erneut an.
settingsPasswordStatusErrorIncorrect = Das aktuelle Passwort ist falsch.
settingsPasswordStatusErrorDerive = Zugangsdaten konnten nicht abgeleitet werden. Versuchen Sie es erneut.
settingsPasswordStatusErrorPublicKeys = \xD6ffentliche Schl\xFCssel konnten nicht berechnet werden.
settingsPasswordStatusErrorUserSecrets = Neues Schl\xFCsselmaterial konnte nicht vorbereitet werden.
settingsPasswordStatusErrorWrap = Datei-Schl\xFCssel konnten nicht erneut verschl\xFCsselt werden.
settingsPasswordStatusErrorRequest = Passwort konnte nicht zur\xFCckgesetzt werden.
settingsPasswordStatusErrorGeneric = Passwort konnte nicht aktualisiert werden.
settingsPasswordStatusSuccess = Passwort wurde erfolgreich aktualisiert.

## Login strings

loginTitle = Upload
loginDescription = Geben Sie Ihre Zugangsdaten ein, um fortzufahren
loginEmailLabel = E-Mail
loginPasswordLabel = Passwort
loginTrustComputerLabel = Diesem Ger\xE4t vertrauen
loginTrustComputerHint = 30 Tage angemeldet bleiben
loginSubmitButton = Anmelden
loginSubmitting = Anmeldung l\xE4uft\u2026
loginErrorChallenge = Anmeldeanforderung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.
loginErrorGeneric = Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.

## File ownership labels

fileTileFrom = VON
fileTileTo = AN
fileTileGuest = Gast
fileTileRecipientNotice = Der Empf\xE4nger meldet sich zum Download der Datei an

footerLinkCli = CLI
footerLinkDmca = DMCA
footerLinkSource = Quellcode
footerLinkLogin = Anmelden
footerLinkLogout = Abmelden
footerUntrustedWarning = Diesem Computer wird nicht vertraut! Denken Sie daran, sich abzumelden!
`;
export {
  de_default as default
};
//# sourceMappingURL=de-IE7N4RHW.js.map
