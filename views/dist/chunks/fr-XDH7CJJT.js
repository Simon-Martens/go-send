import "./chunk-IFG75HHC.js";

// locales/fr.ftl
var fr_default = `title = Go Send
importingFile = Importation\u2026
encryptingFile = Chiffrement\u2026
decryptingFile = D\xE9chiffrement\u2026
downloadCount =
    { $num ->
        [one] 1\xA0t\xE9l\xE9chargement
       *[other] { $num }\xA0t\xE9l\xE9chargements
    }
timespanHours =
    { $num ->
        [one] 1\xA0heure
       *[other] { $num }\xA0heures
    }
copiedUrl = Lien copi\xE9\xA0!
unlockInputPlaceholder = Mot de passe
unlockButtonLabel = D\xE9verrouiller
downloadButtonLabel = T\xE9l\xE9charger
downloadFinish = T\xE9l\xE9chargement termin\xE9
fileSizeProgress = ({ $partialSize } sur { $totalSize })
sendYourFilesLink = Essayer Send
errorPageHeader = Une erreur s\u2019est produite.
fileTooBig = Ce fichier est trop volumineux pour \xEAtre envoy\xE9. Sa taille doit \xEAtre inf\xE9rieure \xE0 { $size }.
linkExpiredAlt = Le lien a expir\xE9
notSupportedHeader = Votre navigateur n\u2019est pas pris en charge.
notSupportedLink = Pourquoi mon navigateur n\u2019est-il pas pris en charge\xA0?
notSupportedOutdatedDetail = Malheureusement, cette version de Firefox ne prend pas en charge les technologies web utilis\xE9es par Send. Vous devez mettre \xE0 jour votre navigateur.
updateFirefox = Mettre \xE0 jour Firefox
deletePopupCancel = Annuler
deleteButtonHover = Supprimer
passwordTryAgain = Mot de passe incorrect. Veuillez r\xE9essayer.
javascriptRequired = Send n\xE9cessite JavaScript
whyJavascript = Pourquoi Send n\xE9cessite-t-il JavaScript\xA0?
enableJavascript = Veuillez activer JavaScript puis r\xE9essayer.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }\xA0h { $minutes }\xA0min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }\xA0min
# A short status message shown when the user enters a long password
maxPasswordLength = Longueur maximale du mot de passe\xA0: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Ce mot de passe n\u2019a pas pu \xEAtre d\xE9fini

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Partage de fichiers simple et priv\xE9
introDescription = { -send-brand } vous permet de partager des fichiers chiffr\xE9s de bout en bout ainsi qu\u2019un lien qui expire automatiquement. Ainsi, vous pouvez garder ce que vous partagez en priv\xE9 et vous assurer que vos contenus ne restent pas en ligne pour toujours.
notifyUploadEncryptDone = Votre fichier est chiffr\xE9 et pr\xEAt \xE0 l\u2019envoi
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expire apr\xE8s { $downloadCount } ou { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minute
       *[other] { $num }\xA0minutes
    }
timespanDays =
    { $num ->
        [one] 1 jour
       *[other] { $num }\xA0jours
    }
timespanWeeks =
    { $num ->
        [one] 1 semaine
       *[other] { $num } semaines
    }
fileCount =
    { $num ->
        [one] 1 fichier
       *[other] { $num } fichiers
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
totalSize = Taille totale\xA0: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copiez le lien pour partager votre fichier\xA0:
copyLinkButton = Copier le lien
downloadTitle = T\xE9l\xE9charger les fichiers
downloadDescription = Ce fichier a \xE9t\xE9 partag\xE9 via { -send-brand } avec un chiffrement de bout en bout et un lien qui expire automatiquement.
trySendDescription = Essayez { -send-brand } pour un partage de fichiers simple et s\xE9curis\xE9.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Un seul fichier peut \xEAtre envoy\xE9 \xE0 la fois.
       *[other] Seuls { $count }\xA0fichiers peuvent \xEAtre envoy\xE9s \xE0 la fois.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Une seule archive est autoris\xE9e.
       *[other] Seules { $count }\xA0archives sont autoris\xE9es.
    }
expiredTitle = Ce lien a expir\xE9.
notSupportedDescription = { -send-brand } ne fonctionnera pas avec ce navigateur. { -send-short-brand } fonctionne mieux avec la derni\xE8re version de { -firefox } et fonctionnera avec la derni\xE8re version de la plupart des navigateurs.
downloadFirefox = T\xE9l\xE9charger { -firefox }
legalTitle = Politique de confidentialit\xE9 de { -send-short-brand }
legalDateStamp = Version\xA01.0 du 12 mars 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }\xA0j { $hours }\xA0h { $minutes }\xA0min
addFilesButton = S\xE9lectionnez des fichiers \xE0 envoyer
uploadButton = Envoyer
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Glissez-d\xE9posez des fichiers
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ou cliquez pour envoyer jusqu\u2019\xE0 { $size }
addPassword = Prot\xE9ger par mot de passe
emailPlaceholder = Votre adresse \xE9lectronique
archiveNameLabel = Nom de l'archive
archiveNameHint = Le nom que les destinataires verront lors du t\xE9l\xE9chargement
archiveNameInvalidChars = Le nom de fichier ne peut pas contenir : < > : " / \\ | ? *
archiveNameInvalidEnd = Le nom de fichier ne peut pas se terminer par un point ou un espace
archiveNameReserved = Ce nom de fichier est r\xE9serv\xE9 par le syst\xE8me
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Connectez-vous pour envoyer jusqu\u2019\xE0 { $size }
signInOnlyButton = Connexion
accountBenefitTitle = Cr\xE9ez un compte { -firefox } ou connectez-vous
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Partagez des fichiers jusqu\u2019\xE0 { $size }
accountBenefitDownloadCount = Partagez des fichiers avec davantage de personnes
accountBenefitTimeLimit =
    { $count ->
        [one] Maintenez les liens actifs jusqu\u2019\xE0 1\xA0journ\xE9e
       *[other] Maintenez les liens actifs jusqu\u2019\xE0 { $count }\xA0jours
    }
accountBenefitSync = G\xE9rez les fichiers partag\xE9s \xE0 partir de n\u2019importe quel appareil
accountBenefitMoz = Apprenez-en davantage sur les autres services { -mozilla }
signOut = Se d\xE9connecter
okButton = OK
downloadingTitle = T\xE9l\xE9chargement en cours
noStreamsWarning = Ce navigateur pourrait ne pas \xEAtre en mesure de d\xE9chiffrer un fichier aussi volumineux.
noStreamsOptionCopy = Copiez le lien pour l\u2019ouvrir dans un autre navigateur
noStreamsOptionFirefox = Essayez notre navigateur pr\xE9f\xE9r\xE9
noStreamsOptionDownload = Continuer avec ce navigateur
downloadFirefoxPromo = { -send-short-brand } vous est propos\xE9 par le tout nouveau { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Partagez le lien vers votre fichier\xA0:
shareLinkButton = Partager le lien
# $name is the name of the file
shareMessage = T\xE9l\xE9charger \xAB\xA0{ $name }\xA0\xBB avec { -send-brand }\xA0: un moyen simple et s\xFBr de partager des fichiers
trailheadPromo = Il existe un moyen de prot\xE9ger votre vie priv\xE9e. Rejoignez Firefox.
learnMore = En savoir plus.

sponsoredByThunderbird = Sponsoris\xE9 par Thunderbird

## Registration strings

registerAdminTitle = Enregistrer un administrateur
registerUserTitle = Enregistrer un utilisateur
registerAdminDescription = Cr\xE9ez votre compte administrateur
registerUserDescription = Cr\xE9ez votre compte utilisateur
registerNameLabel = Nom
registerNamePlaceholder = Votre nom
registerEmailLabel = E-mail
registerEmailPlaceholder = votre@email.fr
registerPasswordLabel = Mot de passe
registerPasswordHint = Au moins 10 caract\xE8res
registerPasswordConfirmLabel = Confirmer le mot de passe
registerSubmitButton = Cr\xE9er un compte
registerSuccessTitle = Compte cr\xE9\xE9 avec succ\xE8s
registerSuccessMessage = Bienvenue, { $name } ! Votre compte administrateur a \xE9t\xE9 cr\xE9\xE9.
registerSuccessButton = Aller au t\xE9l\xE9chargement
registerErrorPasswordsMismatch = Les mots de passe ne correspondent pas
registerErrorNameRequired = Veuillez saisir votre nom
registerErrorMissingToken = Lien d\u2019inscription invalide
registerErrorGeneric = L\u2019inscription a \xE9chou\xE9. Veuillez r\xE9essayer.
registerSubmitting = Cr\xE9ation du compte\u2026

authErrorInvalidEmail = Veuillez saisir une adresse e-mail valide
authErrorPasswordLength = Le mot de passe doit comporter au moins 10 caract\xE8res
authErrorCryptoUnsupported = Votre navigateur ne prend pas en charge les API de cryptographie requises.

## Settings strings

footerLinkSettings = Param\xE8tres
settingsDialogTitle = Param\xE8tres
settingsDialogDescription = G\xE9rez les pr\xE9f\xE9rences de votre compte et les membres de l\u2019\xE9quipe.
settingsBackButton = Upload
settingsNavPassword = Modifiez votre mot de passe
settingsNavUsers = Utilisateurs
settingsPasswordHeading = Modifiez votre mot de passe
settingsPasswordSubheading = Mettez \xE0 jour votre mot de passe. Les modifications sont appliqu\xE9es imm\xE9diatement.
settingsPasswordCurrentLabel = Mot de passe actuel
settingsPasswordNewLabel = Nouveau mot de passe
settingsPasswordConfirmLabel = Confirmez le nouveau mot de passe
settingsPasswordSave = Enregistrer les modifications
settingsPasswordHint = Les mots de passe doivent comporter au moins 10 caract\xE8res.
settingsUsersHeading = Utilisateurs
settingsUsersIntro = \xC9mettez des liens d\u2019invitation pour de nouveaux administrateurs ou utilisateurs standard. Les liens expirent apr\xE8s 7 jours et ne peuvent \xEAtre utilis\xE9s qu\u2019une seule fois.
settingsUsersAdminTitle = Liens d\u2019inscription administrateur
settingsUsersAdminDescription = G\xE9n\xE9rez des invitations \xE0 usage unique pour les comptes administrateur.
settingsUsersUserTitle = Liens d\u2019inscription utilisateur
settingsUsersUserDescription = G\xE9n\xE9rez des invitations \xE0 usage unique pour les utilisateurs standard.
settingsUsersActiveLinksLabel = Liens actifs
settingsUsersGenerateAdmin = Cr\xE9er un lien admin
settingsUsersGenerateUser = Cr\xE9er un lien utilisateur
settingsUsersRevokeAdmin = R\xE9voquer les liens admin
settingsUsersRevokeUser = R\xE9voquer les liens utilisateur
settingsUsersGenerating = Cr\xE9ation d\u2019un lien d\u2019inscription\u2026
settingsUsersGenerateSuccess = Lien d\u2019inscription cr\xE9\xE9.
settingsUsersGenerateError = Impossible de cr\xE9er un lien d\u2019inscription. R\xE9essayez.
settingsUsersRevoking = R\xE9vocation des liens en attente\u2026
settingsUsersRevokeSuccess = Liens d\u2019inscription en attente r\xE9voqu\xE9s.
settingsUsersRevokeError = Impossible de r\xE9voquer les liens d\u2019inscription. R\xE9essayez.
settingsUsersCopySuccess = Lien copi\xE9 dans le presse-papiers.
settingsUsersCopyError = \xC9chec de la copie. Copiez le lien manuellement.
settingsUsersOverviewError = Impossible de charger l\u2019\xE9tat des liens d\u2019inscription.
settingsUsersQrError = Code QR indisponible
settingsUsersDetailBack = Retour aux invitations
settingsUsersDetailHeadingAdmin = Lien d\u2019inscription admin
settingsUsersDetailHeadingUser = Lien d\u2019inscription utilisateur
settingsUsersDetailDescription = Partagez ce lien. Il expire { $date } et peut \xEAtre utilis\xE9 une seule fois.
settingsUsersDetailActiveLabel = Liens actifs
settingsUsersDetailFootnote = Chaque lien d\u2019invitation fonctionne une seule fois et expire automatiquement apr\xE8s sept jours.
settingsUsersDetailCopySuccess = Lien copi\xE9 dans le presse-papiers.
settingsUsersDetailCopyError = \xC9chec de la copie. Copiez le lien manuellement.
settingsUsersDetailExpiresUnknown = Expire bient\xF4t
settingsUsersListHeading = Utilisateurs existants
settingsUsersListName = Nom
settingsUsersListEmail = E-mail
settingsUsersListPublicKeys = Cl\xE9s publiques
settingsUsersListSessions = Sessions actives
settingsUsersListActions = Actions
settingsUsersListLoading = Chargement des utilisateurs\u2026
settingsUsersListError = Impossible de charger les utilisateurs. R\xE9essayez.
settingsUsersListEmpty = Aucun autre utilisateur pour le moment.
settingsUsersActionClearSessions = Effacer les sessions
settingsUsersActionDelete = Supprimer l'utilisateur
settingsUsersActionDeleteConfirm = Voulez-vous vraiment supprimer { $name } ? Cette action est irr\xE9versible.
settingsUsersActionDeleteSelfError = Vous ne pouvez pas supprimer votre propre compte.
settingsUsersActionDeleteSuccess = { $name } a \xE9t\xE9 supprim\xE9.
settingsUsersActionDeleteError = Impossible de supprimer l'utilisateur. R\xE9essayez.
settingsUsersActionDeleteWorking = Suppression de l'utilisateur\u2026
settingsUsersActionClearSuccess = Sessions de { $name } effac\xE9es.
settingsUsersActionClearError = Impossible d'effacer les sessions. R\xE9essayez.
settingsUsersActionClearWorking = Effacement des sessions\u2026
settingsUsersActionDeleteSelfTooltip = Vous ne pouvez pas supprimer votre propre compte.
settingsUsersActionClearDisabledTooltip = Aucune session active \xE0 effacer.
settingsUsersActionDeactivate = D\xE9sactiver
settingsUsersActionActivate = Activer
settingsUsersActionDeactivateWorking = D\xE9sactivation de l'utilisateur\u2026
settingsUsersActionDeactivateSuccess = { $name } a \xE9t\xE9 d\xE9sactiv\xE9.
settingsUsersActionDeactivateError = Impossible de d\xE9sactiver l'utilisateur. R\xE9essayez.
settingsUsersActionDeactivateSelfError = Vous ne pouvez pas d\xE9sactiver votre propre compte.
settingsUsersActionActivateWorking = Activation de l'utilisateur\u2026
settingsUsersActionActivateSuccess = { $name } est de nouveau actif.
settingsUsersActionActivateError = Impossible d'activer l'utilisateur. R\xE9essayez.
settingsUsersRoleAdmin = Administrateur
settingsUsersRoleUser = Utilisateur
settingsUsersRoleGuest = Invit\xE9
settingsUsersRoleUnknown = R\xF4le inconnu
settingsUsersStatusActive = Actif
settingsUsersStatusInactive = D\xE9sactiv\xE9
settingsUsersKeySigning = Cl\xE9 de signature
settingsUsersKeyEncryption = Cl\xE9 de chiffrement
settingsUsersKeyMissing = Non disponible
settingsUsersNameFallback = Utilisateur
settingsUsersCurrentUserLabel = Vous
settingsPasswordStatusInfoDeriving = Recalcul des cl\xE9s\u2026
settingsPasswordStatusInfoPreparing = Pr\xE9paration des nouvelles informations d\u2019identification\u2026
settingsPasswordStatusInfoUpdating = Mise \xE0 jour du mot de passe\u2026
settingsPasswordStatusErrorCurrent = Le mot de passe actuel est obligatoire.
settingsPasswordStatusErrorNewLength = Le nouveau mot de passe doit comporter au moins 10 caract\xE8res.
settingsPasswordStatusErrorMismatch = Les nouveaux mots de passe ne correspondent pas.
settingsPasswordStatusErrorNoSession = Aucune session trouv\xE9e. Veuillez vous reconnecter.
settingsPasswordStatusErrorMissingKeys = Mat\xE9riel de cl\xE9 manquant. Veuillez vous reconnecter.
settingsPasswordStatusErrorIncorrect = Le mot de passe actuel est incorrect.
settingsPasswordStatusErrorDerive = Impossible de d\xE9river les identifiants. R\xE9essayez.
settingsPasswordStatusErrorPublicKeys = \xC9chec du calcul des cl\xE9s publiques.
settingsPasswordStatusErrorUserSecrets = Impossible de pr\xE9parer le nouveau mat\xE9riel de cl\xE9.
settingsPasswordStatusErrorWrap = Impossible de rechiffrer les cl\xE9s de fichier.
settingsPasswordStatusErrorRequest = \xC9chec de la r\xE9initialisation du mot de passe.
settingsPasswordStatusErrorGeneric = \xC9chec de la mise \xE0 jour du mot de passe.
settingsPasswordStatusSuccess = Mot de passe mis \xE0 jour avec succ\xE8s.

## Login strings

loginTitle = Upload Access
loginDescription = Saisissez vos identifiants pour continuer
loginEmailLabel = Adresse e-mail
loginPasswordLabel = Mot de passe
loginSubmitButton = Se connecter
loginSubmitting = Connexion\u2026
loginErrorChallenge = Impossible de d\xE9marrer le d\xE9fi de connexion. Veuillez r\xE9essayer.
loginErrorGeneric = \xC9chec de la connexion. Veuillez r\xE9essayer.

footerLinkCli = CLI
footerLinkDmca = DMCA
footerLinkSource = Code source
footerLinkLogin = Se connecter
footerLinkLogout = Se d\xE9connecter
`;
export {
  fr_default as default
};
//# sourceMappingURL=fr-XDH7CJJT.js.map
