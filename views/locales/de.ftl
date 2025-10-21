title = Go Send
importingFile = Wird importiert…
encryptingFile = Wird verschlüsselt…
decryptingFile = Wird entschlüsselt…
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
fileTooBig = Die Datei ist zu groß zum Hochladen. Sie sollte maximal { $size } groß sein.
linkExpiredAlt = Link abgelaufen
notSupportedHeader = Ihr Browser wird nicht unterstützt.
notSupportedLink = Warum wird mein Browser nicht unterstützt?
notSupportedOutdatedDetail = Leider unterstützt diese Firefox-Version die Web-Technologie nicht, auf der Send basiert. Sie müssen Ihren Browser aktualisieren.
updateFirefox = Firefox aktualisieren
deletePopupCancel = Abbrechen
deleteButtonHover = Löschen
passwordTryAgain = Falsches Passwort. Versuchen Sie es nochmal.
javascriptRequired = Send benötigt JavaScript
whyJavascript = Warum benötigt Send JavaScript?
enableJavascript = Bitte aktivieren Sie JavaScript und versuchen Sie es erneut.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Maximale Passwortlänge: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Dieses Passwort konnte nicht eingerichtet werden

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Einfach und privat Dateien versenden
introDescription = Mit { -send-brand } können Sie Dateien sicher mit anderen teilen – mit Ende-zu-Ende-Verschlüsselung und einem Freigabe-Link, der automatisch abläuft. So bleiben Ihre geteilten Daten privat und Sie können sicherstellen, dass Ihre Daten nicht für immer im Web herumschwirren.
uploadGuestBannerMessageGuest = Bitte denken Sie an öffentlichen Geräten daran, sich abzumelden
uploadGuestBannerMessageEphemeral = Dieses Gerät ist nicht vertrauenswürdig. Bitte denken Sie daran, sich abzumelden
notifyUploadEncryptDone = Ihre Datei wurde verschlüsselt
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Läuft nach { $downloadCount } oder { $timespan } ab
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
totalSize = Gesamtgröße: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Diesen Link kopieren, um Ihre Datei zu teilen:
copyLinkButton = Link kopieren
downloadTitle = Dateien herunterladen
downloadDescription =  Diese Datei ist Ende-zu-Ende verschlüsselt.
trySendDescription = Probieren Sie { -send-brand } aus, um einfach und sicher Dateien zu versenden.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Es kann maximal eine Datei auf einmal hochgeladen werden.
       *[other] Es können maximal { $count } Dateien auf einmal hochgeladen werden.
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
legalTitle = Datenschutzerklärung zu { -send-short-brand }
legalDateStamp = Version 1.0, Stand 12. März 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Dateien auswählen
uploadButton = Hochladen
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Dateien per Drag & Drop einfügen
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = oder klicken, um bis zu { $size } zu senden
addPassword = Mit Passwort schützen
emailPlaceholder = E-Mail-Adresse eingeben
archiveNameLabel = Archivname
archiveNameHint = Der Name, den Empfänger beim Herunterladen sehen
archiveNameInvalidChars = Dateiname darf nicht enthalten: < > : " / \ | ? *
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
accountBenefitSync = Geteilte Dateien von anderen Geräten aus verwalten
accountBenefitMoz = Mehr über andere { -mozilla }-Dienste erfahren
signOut = Abmelden
okButton = OK
downloadingTitle = Wird heruntergeladen…
noStreamsWarning = Dieser Browser kann eine so große Datei möglicherweise nicht entschlüsseln.
noStreamsOptionCopy = Kopieren Sie den Link, um ihn in einem anderen Browser zu öffnen
noStreamsOptionFirefox = Probieren Sie unseren Lieblingsbrowser aus
noStreamsOptionDownload = Mit diesem Browser weitermachen
downloadFirefoxPromo = { -send-short-brand } wird Ihnen präsentiert vom brandneuen { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Teilen Sie den Link zu Ihrer Datei:
shareLinkButton = Link teilen
# $name is the name of the file
shareMessage = Laden Sie „{ $name }“ mit { -send-brand } herunter: einfaches, sicheres Teilen von Dateien
trailheadPromo = Es gibt einen Weg, deine Privatsphäre zu schützen. Komm zu Firefox.
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
registerPasswordConfirmLabel = Passwort bestätigen
registerSubmitButton = Konto erstellen
registerSuccessTitle = Konto erfolgreich erstellt
registerSuccessMessage = Willkommen, { $name }! Ihr Administrator-Konto wurde erstellt.
registerSuccessButton = Zum Hochladen
registerErrorPasswordsMismatch = Die Passwörter stimmen nicht überein
registerErrorNameRequired = Bitte geben Sie Ihren Namen ein
registerErrorMissingToken = Ungültiger Registrierungslink
registerErrorGeneric = Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.
registerSubmitting = Konto wird erstellt…

authErrorInvalidEmail = Bitte geben Sie eine gültige E-Mail-Adresse ein
authErrorPasswordLength = Das Passwort muss mindestens 10 Zeichen lang sein
authErrorCryptoUnsupported = Ihr Browser unterstützt die erforderlichen Kryptografie-APIs nicht.

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
settingsAccountPasswordDescription = Legen Sie ein neues Passwort für Ihr Konto fest. Änderungen gelten sofort.
settingsAccountPasswordCurrentLabel = Aktuelles Passwort
settingsAccountPasswordNewLabel = Neues Passwort
settingsAccountPasswordConfirmLabel = Neues Passwort bestätigen
settingsAccountPasswordSave = Passwort aktualisieren
settingsAccountPasswordHint = Passwörter müssen mindestens 10 Zeichen lang sein.
settingsAccountDangerHeading = Sitzungen & Zugriff
settingsAccountDangerDescription = Löschen Sie Ihre aktuelle Sitzung oder deaktivieren Sie das Konto. Beides meldet Sie ab.
settingsAccountClearSessions = Sitzung löschen
settingsAccountDeactivate = Konto deaktivieren
settingsUsersHeading = Benutzer
settingsUsersIntro = Ihr Server ist derzeit nicht öffentlich zugänglich. Unter diesen Links können neue Administratoren und Benutzer erstellt werden. Ausschließlich Administratoren können neue Benutzer einladen. Die Links sind sieben Tage gültig und können nur einmal verwendet werden.
settingsUsersAdminTitle = Administrator-Anmeldelinks
settingsUsersAdminDescription = Erstellen Sie Einladungen für Administrator-Konten.
settingsUsersUserTitle = Benutzer-Anmeldelinks
settingsUsersUserDescription = Erstellen Sie Einladungen für Standardbenutzer.
settingsUsersActiveLinksLabel = Aktive Links
settingsUsersGenerateAdmin = Link erstellen
settingsUsersGenerateUser = Link erstellen
settingsUsersRevokeAdmin = Links widerrufen
settingsUsersRevokeUser = Links widerrufen
settingsUsersGenerating = Anmeldelink wird erstellt …
settingsUsersGenerateSuccess = Anmeldelink erstellt.
settingsUsersGenerateError = Anmeldelink konnte nicht erstellt werden. Bitte versuchen Sie es erneut.
settingsUsersRevoking = Ausstehende Links werden widerrufen …
settingsUsersRevokeSuccess = Ausstehende Anmeldelinks widerrufen.
settingsUsersRevokeError = Anmeldelinks konnten nicht widerrufen werden. Bitte versuchen Sie es erneut.
settingsUsersCopySuccess = Link in die Zwischenablage kopiert.
settingsUsersCopyError = Kopieren fehlgeschlagen. Bitte kopieren Sie den Link manuell.
settingsUsersOverviewError = Status der Anmeldelinks konnte nicht geladen werden.
settingsUsersQrError = QR-Code nicht verfügbar
settingsUsersDetailBack = Zurück zu den Einladungen
settingsUsersDetailHeadingAdmin = Admin-Anmeldelink
settingsUsersDetailHeadingUser = Benutzer-Anmeldelink
settingsUsersDetailDescription = Teilen Sie diesen Link. Er läuft am { $date } Uhr ab und kann nur einmal verwendet werden.
settingsUsersDetailActiveLabel = Aktive Links
settingsUsersDetailFootnote = Jeder Einladungslink funktioniert nur einmal und läuft nach sieben Tagen automatisch ab.
settingsUsersDetailCopySuccess = Link in die Zwischenablage kopiert.
settingsUsersDetailCopyError = Kopieren fehlgeschlagen. Bitte kopieren Sie den Link manuell.
settingsUsersDetailExpiresUnknown = Läuft bald ab
settingsUsersListHeading = Bestehende Benutzer
settingsUsersListName = Name
settingsUsersListEmail = E-Mail
settingsUsersListPublicKeys = Öffentliche Schlüssel
settingsUsersListSessions = Aktive Sitzungen
settingsUsersListActions = Aktionen
settingsUsersListLoading = Benutzer werden geladen …
settingsUsersListError = Benutzer konnten nicht geladen werden. Bitte versuchen Sie es erneut.
settingsUsersListEmpty = Noch keine weiteren Benutzer.
settingsUsersActionClearSessions = Sitzungen löschen
settingsUsersActionDelete = Benutzer löschen
settingsUsersActionDeleteConfirm = Möchten Sie { $name } wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.
settingsUsersActionDeleteSelfError = Sie können Ihr eigenes Konto nicht löschen.
settingsUsersActionDeleteSuccess = { $name } wurde gelöscht.
settingsUsersActionDeleteError = Benutzer konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.
settingsUsersActionDeleteWorking = Benutzer wird gelöscht …
settingsUsersActionClearSuccess = Sitzungen von { $name } wurden gelöscht.
settingsUsersActionClearError = Sitzungen konnten nicht gelöscht werden. Bitte versuchen Sie es erneut.
settingsUsersActionClearWorking = Sitzungen werden gelöscht …
settingsUsersActionDeleteSelfTooltip = Sie können Ihr eigenes Konto nicht löschen.
settingsUsersActionClearDisabledTooltip = Keine aktiven Sitzungen zum Löschen.
settingsUsersActionDeactivate = Deaktivieren
settingsUsersActionActivate = Aktivieren
settingsUsersActionDeactivateWorking = Benutzer wird deaktiviert …
settingsUsersActionDeactivateSuccess = { $name } wurde deaktiviert.
settingsUsersActionDeactivateError = Benutzer konnte nicht deaktiviert werden. Bitte versuchen Sie es erneut.
settingsUsersActionDeactivateSelfError = Sie können Ihr eigenes Konto nicht deaktivieren.
settingsUsersActionActivateWorking = Benutzer wird aktiviert …
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
settingsUsersKeyMissing = Nicht verfügbar
settingsUsersNameFallback = Benutzer
settingsUsersCurrentUserLabel = Sie
settingsAccountProfileStatusSaving = Profil wird gespeichert …
settingsAccountProfileStatusSuccess = Profil aktualisiert.
settingsAccountProfileStatusError = Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.
settingsAccountProfileStatusNameRequired = Name ist erforderlich.
settingsAccountProfileStatusEmailRequired = E-Mail ist erforderlich.
settingsAccountProfileStatusEmailInvalid = Bitte geben Sie eine gültige E-Mail-Adresse ein.
settingsAccountProfileStatusEmailInUse = Diese E-Mail-Adresse wird bereits verwendet.
settingsAccountDangerStatusNotActive = Ihr Konto ist bereits deaktiviert.
settingsAccountDangerStatusClearing = Sitzung wird gelöscht …
settingsAccountDangerStatusDeactivating = Konto wird deaktiviert …
settingsAccountDangerStatusError = Anfrage konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.
settingsUploadLinksHeading = Upload-Tickets
settingsUploadLinksDescription = Erstellen Sie Zugänge für Gäste, die Ihnen Dateien schicken können.
settingsUploadLinksLabelLabel = Bezeichnung
settingsUploadLinksLabelHint = Verwenden Sie eine aussagekräftige Bezeichnung, wie etwa den Namen des Gastes, damit Sie den Link später wiedererkennen. Diese Bezeichnung ist für den Benutzer sichtbar.
settingsUploadLinksLabelPlaceholder = Name
settingsUploadLinksDescriptionLabel = Interne Notiz
settingsUploadLinksDescriptionHint = Nur Administratoren können diese Notiz sehen.
settingsUploadLinksDescriptionPlaceholder = Optionale Details
settingsUploadLinksCreateButton = Upload-Link erstellen
settingsUploadLinksStatusLabelRequired = Bitte geben Sie vor dem Erstellen einen Namen an.
settingsUploadLinksStatusCreating = Upload-Link wird erstellt …
settingsUploadLinksStatusCreated = Upload-Link ist bereit.
settingsUploadLinksStatusError = Upload-Link konnte nicht erstellt werden. Bitte erneut versuchen.
settingsUploadLinksStatusRevoking = Upload-Link wird widerrufen …
settingsUploadLinksStatusRevoked = Upload-Link widerrufen.
settingsUploadLinksStatusRevokeError = Upload-Link konnte nicht widerrufen werden. Bitte erneut versuchen.
settingsUploadLinksStatusLoading = Upload-Links werden geladen …
settingsUploadLinksStatusLoadingError = Upload-Links konnten nicht geladen werden. Bitte erneut versuchen.
settingsUploadLinksDetailHeading = Neuer Upload-Link erstellt
settingsUploadLinksDetailDescription = Kopieren Sie diesen Link jetzt – er wird nicht erneut angezeigt.
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
settingsUploadLinksNoPreview = —
settingsUploadLinksRevokeButton = Widerrufen
settingsUploadLinksCreatedUnknown = Nicht verfügbar
settingsUploadLinksPlaceholderTitle = Gast-Uploads
settingsUploadLinksPlaceholderDescription = Administratoren können Gast-Upload-Links für gemeinsame Postfächer ausgeben. Sobald ein Link mit Ihnen geteilt wird, erscheint er hier.
settingsUploadLinksGeneralLabel = Allgemeiner Upload-Link
settingsUploadLinksGeneralHint = Erlaubt Uploads auch für alle anderen Benutzer
settingsUploadLinksTableType = Typ/Benutzer
settingsUploadLinksTypeGeneral = Allgemein
settingsUploadLinksTypeUserFallback = Benutzerspezifisch
recipientLockedHint = Dieser Upload-Link ist auf Uploads für { $userName } beschränkt
recipientHintSelected = Der Empfänger kann die Datei sehen, herunterladen und entschlüsseln.
encryptForLabel = An
recipientUnspecified = Jeder mit dem Link
settingsAccountDeactivateConfirm = Möchten Sie Ihr Konto wirklich deaktivieren? Sie werden sofort abgemeldet.
settingsAccountKeyHeading = Sicherung des privaten Schlüssels
settingsAccountKeyDescription = Kopieren Sie Ihren privaten Verschlüsselungsschlüssel und bewahren Sie ihn sicher auf. Ohne diesen Schlüssel verlieren Sie den Zugriff auf verschlüsselte Daten. Halten Sie ihn geheim.
settingsAccountKeyCopyLabel = Privaten Schlüssel kopieren
settingsAccountKeyStatusCopied = Privater Schlüssel wurde kopiert.
settingsAccountKeyStatusError = Schlüssel konnte nicht kopiert werden. Bitte erneut versuchen.
settingsAccountKeyStatusUnavailable = Privater Schlüssel nicht verfügbar.
settingsAccountKeyUnavailable = Nicht verfügbar
settingsPasswordStatusInfoDeriving = Schlüssel werden neu abgeleitet …
settingsPasswordStatusInfoPreparing = Neue Anmeldedaten werden vorbereitet …
settingsPasswordStatusInfoUpdating = Passwort wird aktualisiert …
settingsPasswordStatusErrorCurrent = Das aktuelle Passwort wird benötigt.
settingsPasswordStatusErrorNewLength = Das neue Passwort muss mindestens 10 Zeichen lang sein.
settingsPasswordStatusErrorMismatch = Die neuen Passwörter stimmen nicht überein.
settingsPasswordStatusErrorNoSession = Keine Sitzung gefunden. Bitte melden Sie sich erneut an.
settingsPasswordStatusErrorMissingKeys = Fehlendes Schlüsselmaterial. Bitte melden Sie sich erneut an.
settingsPasswordStatusErrorIncorrect = Das aktuelle Passwort ist falsch.
settingsPasswordStatusErrorDerive = Zugangsdaten konnten nicht abgeleitet werden. Versuchen Sie es erneut.
settingsPasswordStatusErrorPublicKeys = Öffentliche Schlüssel konnten nicht berechnet werden.
settingsPasswordStatusErrorUserSecrets = Neues Schlüsselmaterial konnte nicht vorbereitet werden.
settingsPasswordStatusErrorWrap = Datei-Schlüssel konnten nicht erneut verschlüsselt werden.
settingsPasswordStatusErrorRequest = Passwort konnte nicht zurückgesetzt werden.
settingsPasswordStatusErrorGeneric = Passwort konnte nicht aktualisiert werden.
settingsPasswordStatusSuccess = Passwort wurde erfolgreich aktualisiert.

## Login strings

loginTitle = Upload
loginDescription = Geben Sie Ihre Zugangsdaten ein, um fortzufahren
loginEmailLabel = E-Mail
loginPasswordLabel = Passwort
loginTrustComputerLabel = Diesem Gerät vertrauen
loginTrustComputerHint = 30 Tage angemeldet bleiben
loginSubmitButton = Anmelden
loginSubmitting = Anmeldung läuft…
loginErrorChallenge = Anmeldeanforderung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.
loginErrorGeneric = Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.

## File ownership labels

fileTileFrom = VON
fileTileTo = AN
fileTileGuest = Gast
fileTileRecipientNotice = Der Empfänger meldet sich zum Download der Datei an

footerLinkCli = CLI
footerLinkDmca = DMCA
footerLinkSource = Quellcode
footerLinkLogin = Anmelden
footerLinkLogout = Abmelden
footerUntrustedWarning = Diesem Gerät wird nicht vertraut. Denken Sie daran, sich abzumelden.
