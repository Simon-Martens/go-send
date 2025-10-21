title = Go Send
importingFile = Importation…
encryptingFile = Chiffrement…
decryptingFile = Déchiffrement…
downloadCount =
    { $num ->
        [one] 1 téléchargement
       *[other] { $num } téléchargements
    }
timespanHours =
    { $num ->
        [one] 1 heure
       *[other] { $num } heures
    }
copiedUrl = Lien copié !
unlockInputPlaceholder = Mot de passe
unlockButtonLabel = Déverrouiller
downloadButtonLabel = Télécharger
downloadFinish = Téléchargement terminé
fileSizeProgress = ({ $partialSize } sur { $totalSize })
sendYourFilesLink = Essayer Send
errorPageHeader = Une erreur s’est produite.
fileTooBig = Ce fichier est trop volumineux pour être envoyé. Sa taille doit être inférieure à { $size }.
linkExpiredAlt = Le lien a expiré
notSupportedHeader = Votre navigateur n’est pas pris en charge.
notSupportedLink = Pourquoi mon navigateur n’est-il pas pris en charge ?
notSupportedOutdatedDetail = Malheureusement, cette version de Firefox ne prend pas en charge les technologies web utilisées par Send. Vous devez mettre à jour votre navigateur.
updateFirefox = Mettre à jour Firefox
deletePopupCancel = Annuler
deleteButtonHover = Supprimer
passwordTryAgain = Mot de passe incorrect. Veuillez réessayer.
javascriptRequired = Send nécessite JavaScript
whyJavascript = Pourquoi Send nécessite-t-il JavaScript ?
enableJavascript = Veuillez activer JavaScript puis réessayer.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours } h { $minutes } min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes } min
# A short status message shown when the user enters a long password
maxPasswordLength = Longueur maximale du mot de passe : { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Ce mot de passe n’a pas pu être défini

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Partage de fichiers simple et privé
introDescription = { -send-brand } vous permet de partager des fichiers chiffrés de bout en bout ainsi qu’un lien qui expire automatiquement. Ainsi, vous pouvez garder ce que vous partagez en privé et vous assurer que vos contenus ne restent pas en ligne pour toujours.
uploadGuestBannerMessageGuest = Pensez à vous déconnecter sur les appareils non fiables !
uploadGuestBannerMessageEphemeral = Cet appareil n’est pas de confiance ! Pensez à vous déconnecter !
notifyUploadEncryptDone = Votre fichier est chiffré et prêt à l’envoi
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expire après { $downloadCount } ou { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minute
       *[other] { $num } minutes
    }
timespanDays =
    { $num ->
        [one] 1 jour
       *[other] { $num } jours
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
fileSize = { $num } { $units }
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
totalSize = Taille totale : { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copiez le lien pour partager votre fichier :
copyLinkButton = Copier le lien
downloadTitle = Télécharger les fichiers
downloadDescription = Ce fichier a été partagé via { -send-brand } avec un chiffrement de bout en bout et un lien qui expire automatiquement.
trySendDescription = Essayez { -send-brand } pour un partage de fichiers simple et sécurisé.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Un seul fichier peut être envoyé à la fois.
       *[other] Seuls { $count } fichiers peuvent être envoyés à la fois.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Une seule archive est autorisée.
       *[other] Seules { $count } archives sont autorisées.
    }
expiredTitle = Ce lien a expiré.
notSupportedDescription = { -send-brand } ne fonctionnera pas avec ce navigateur. { -send-short-brand } fonctionne mieux avec la dernière version de { -firefox } et fonctionnera avec la dernière version de la plupart des navigateurs.
downloadFirefox = Télécharger { -firefox }
legalTitle = Politique de confidentialité de { -send-short-brand }
legalDateStamp = Version 1.0 du 12 mars 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days } j { $hours } h { $minutes } min
addFilesButton = Sélectionnez des fichiers à envoyer
uploadButton = Envoyer
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Glissez-déposez des fichiers
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ou cliquez pour envoyer jusqu’à { $size }
addPassword = Protéger par mot de passe
emailPlaceholder = Votre adresse électronique
archiveNameLabel = Nom de l'archive
archiveNameHint = Le nom que les destinataires verront lors du téléchargement
archiveNameInvalidChars = Le nom de fichier ne peut pas contenir : < > : " / \ | ? *
archiveNameInvalidEnd = Le nom de fichier ne peut pas se terminer par un point ou un espace
archiveNameReserved = Ce nom de fichier est réservé par le système
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Connectez-vous pour envoyer jusqu’à { $size }
signInOnlyButton = Connexion
accountBenefitTitle = Créez un compte { -firefox } ou connectez-vous
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Partagez des fichiers jusqu’à { $size }
accountBenefitDownloadCount = Partagez des fichiers avec davantage de personnes
accountBenefitTimeLimit =
    { $count ->
        [one] Maintenez les liens actifs jusqu’à 1 journée
       *[other] Maintenez les liens actifs jusqu’à { $count } jours
    }
accountBenefitSync = Gérez les fichiers partagés à partir de n’importe quel appareil
accountBenefitMoz = Apprenez-en davantage sur les autres services { -mozilla }
signOut = Se déconnecter
okButton = OK
downloadingTitle = Téléchargement en cours
noStreamsWarning = Ce navigateur pourrait ne pas être en mesure de déchiffrer un fichier aussi volumineux.
noStreamsOptionCopy = Copiez le lien pour l’ouvrir dans un autre navigateur
noStreamsOptionFirefox = Essayez notre navigateur préféré
noStreamsOptionDownload = Continuer avec ce navigateur
downloadFirefoxPromo = { -send-short-brand } vous est proposé par le tout nouveau { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Partagez le lien vers votre fichier :
shareLinkButton = Partager le lien
# $name is the name of the file
shareMessage = Télécharger « { $name } » avec { -send-brand } : un moyen simple et sûr de partager des fichiers
trailheadPromo = Il existe un moyen de protéger votre vie privée. Rejoignez Firefox.
learnMore = En savoir plus.

sponsoredByThunderbird = Sponsorisé par Thunderbird

## Registration strings

registerAdminTitle = Enregistrer un administrateur
registerUserTitle = Enregistrer un utilisateur
registerAdminDescription = Créez votre compte administrateur
registerUserDescription = Créez votre compte utilisateur
registerNameLabel = Nom
registerNamePlaceholder = Votre nom
registerEmailLabel = E-mail
registerEmailPlaceholder = votre@email.fr
registerPasswordLabel = Mot de passe
registerPasswordHint = Au moins 10 caractères
registerPasswordConfirmLabel = Confirmer le mot de passe
registerSubmitButton = Créer un compte
registerSuccessTitle = Compte créé avec succès
registerSuccessMessage = Bienvenue, { $name } ! Votre compte administrateur a été créé.
registerSuccessButton = Aller au téléchargement
registerErrorPasswordsMismatch = Les mots de passe ne correspondent pas
registerErrorNameRequired = Veuillez saisir votre nom
registerErrorMissingToken = Lien d’inscription invalide
registerErrorGeneric = L’inscription a échoué. Veuillez réessayer.
registerSubmitting = Création du compte…

authErrorInvalidEmail = Veuillez saisir une adresse e-mail valide
authErrorPasswordLength = Le mot de passe doit comporter au moins 10 caractères
authErrorCryptoUnsupported = Votre navigateur ne prend pas en charge les API de cryptographie requises.

## Settings strings

footerLinkSettings = Paramètres
settingsDialogTitle = Paramètres
settingsDialogDescription = Gérez les préférences de votre compte et les membres de l’équipe.
settingsBackButton = Upload
settingsNavAccount = Compte
settingsNavUploadLinks = Liens d’envoi
settingsNavUsers = Utilisateurs
settingsAccountHeading = Compte
settingsAccountSubheading = Gérez vos informations de profil, votre mot de passe et vos sessions de connexion.
settingsAccountProfileHeading = Profil
settingsAccountProfileDescription = Mettez à jour le nom et l’adresse e-mail associés à votre compte.
settingsAccountNameLabel = Nom
settingsAccountEmailLabel = E-mail
settingsAccountProfileSave = Enregistrer le profil
settingsAccountPasswordHeading = Mot de passe
settingsAccountPasswordDescription = Définissez un nouveau mot de passe pour votre compte. Les changements prennent effet immédiatement.
settingsAccountPasswordCurrentLabel = Mot de passe actuel
settingsAccountPasswordNewLabel = Nouveau mot de passe
settingsAccountPasswordConfirmLabel = Confirmez le nouveau mot de passe
settingsAccountPasswordSave = Mettre à jour le mot de passe
settingsAccountPasswordHint = Les mots de passe doivent comporter au moins 10 caractères.
settingsAccountDangerHeading = Sessions & accès
settingsAccountDangerDescription = Effacez votre session actuelle ou désactivez le compte. Les deux actions vous déconnectent.
settingsAccountClearSessions = Effacer la session
settingsAccountDeactivate = Désactiver le compte
settingsUsersHeading = Utilisateurs
settingsUsersIntro = Émettez des liens d’invitation pour de nouveaux administrateurs ou utilisateurs standard. Les liens expirent après 7 jours et ne peuvent être utilisés qu’une seule fois.
settingsUsersAdminTitle = Liens d’inscription administrateur
settingsUsersAdminDescription = Générez des invitations à usage unique pour les comptes administrateur.
settingsUsersUserTitle = Liens d’inscription utilisateur
settingsUsersUserDescription = Générez des invitations à usage unique pour les utilisateurs standard.
settingsUsersActiveLinksLabel = Liens actifs
settingsUsersGenerateAdmin = Créer un lien
settingsUsersGenerateUser = Créer un lien
settingsUsersRevokeAdmin = Révoquer les liens
settingsUsersRevokeUser = Révoquer les liens
settingsUsersGenerating = Création d’un lien d’inscription…
settingsUsersGenerateSuccess = Lien d’inscription créé.
settingsUsersGenerateError = Impossible de créer un lien d’inscription. Réessayez.
settingsUsersRevoking = Révocation des liens en attente…
settingsUsersRevokeSuccess = Liens d’inscription en attente révoqués.
settingsUsersRevokeError = Impossible de révoquer les liens d’inscription. Réessayez.
settingsUsersCopySuccess = Lien copié dans le presse-papiers.
settingsUsersCopyError = Échec de la copie. Copiez le lien manuellement.
settingsUsersOverviewError = Impossible de charger l’état des liens d’inscription.
settingsUsersQrError = Code QR indisponible
settingsUsersDetailBack = Retour aux invitations
settingsUsersDetailHeadingAdmin = Lien d’inscription admin
settingsUsersDetailHeadingUser = Lien d’inscription utilisateur
settingsUsersDetailDescription = Partagez ce lien. Il expire { $date } et peut être utilisé une seule fois.
settingsUsersDetailActiveLabel = Liens actifs
settingsUsersDetailFootnote = Chaque lien d’invitation fonctionne une seule fois et expire automatiquement après sept jours.
settingsUsersDetailCopySuccess = Lien copié dans le presse-papiers.
settingsUsersDetailCopyError = Échec de la copie. Copiez le lien manuellement.
settingsUsersDetailExpiresUnknown = Expire bientôt
settingsUsersListHeading = Utilisateurs existants
settingsUsersListName = Nom
settingsUsersListEmail = E-mail
settingsUsersListPublicKeys = Clés publiques
settingsUsersListSessions = Sessions actives
settingsUsersListActions = Actions
settingsUsersListLoading = Chargement des utilisateurs…
settingsUsersListError = Impossible de charger les utilisateurs. Réessayez.
settingsUsersListEmpty = Aucun autre utilisateur pour le moment.
settingsUsersActionClearSessions = Effacer les sessions
settingsUsersActionDelete = Supprimer l'utilisateur
settingsUsersActionDeleteConfirm = Voulez-vous vraiment supprimer { $name } ? Cette action est irréversible.
settingsUsersActionDeleteSelfError = Vous ne pouvez pas supprimer votre propre compte.
settingsUsersActionDeleteSuccess = { $name } a été supprimé.
settingsUsersActionDeleteError = Impossible de supprimer l'utilisateur. Réessayez.
settingsUsersActionDeleteWorking = Suppression de l'utilisateur…
settingsUsersActionClearSuccess = Sessions de { $name } effacées.
settingsUsersActionClearError = Impossible d'effacer les sessions. Réessayez.
settingsUsersActionClearWorking = Effacement des sessions…
settingsUsersActionDeleteSelfTooltip = Vous ne pouvez pas supprimer votre propre compte.
settingsUsersActionClearDisabledTooltip = Aucune session active à effacer.
settingsUsersActionDeactivate = Désactiver
settingsUsersActionActivate = Activer
settingsUsersActionDeactivateWorking = Désactivation de l'utilisateur…
settingsUsersActionDeactivateSuccess = { $name } a été désactivé.
settingsUsersActionDeactivateError = Impossible de désactiver l'utilisateur. Réessayez.
settingsUsersActionDeactivateSelfError = Vous ne pouvez pas désactiver votre propre compte.
settingsUsersActionActivateWorking = Activation de l'utilisateur…
settingsUsersActionActivateSuccess = { $name } est de nouveau actif.
settingsUsersActionActivateError = Impossible d'activer l'utilisateur. Réessayez.
settingsUsersRoleAdmin = Administrateur
settingsUsersRoleUser = Utilisateur
settingsUsersRoleGuest = Invité
settingsUsersRoleUnknown = Rôle inconnu
settingsUsersStatusActive = Actif
settingsUsersStatusInactive = Désactivé
settingsUsersKeySigning = Clé de signature
settingsUsersKeyEncryption = Clé de chiffrement
settingsUsersKeyMissing = Non disponible
settingsUsersNameFallback = Utilisateur
settingsUsersCurrentUserLabel = Vous
settingsAccountProfileStatusSaving = Enregistrement du profil…
settingsAccountProfileStatusSuccess = Profil mis à jour.
settingsAccountProfileStatusError = Impossible de mettre à jour le profil. Réessayez.
settingsAccountProfileStatusNameRequired = Le nom est requis.
settingsAccountProfileStatusEmailRequired = L’adresse e-mail est requise.
settingsAccountProfileStatusEmailInvalid = Saisissez une adresse e-mail valide.
settingsAccountProfileStatusEmailInUse = Cette adresse e-mail est déjà utilisée.
settingsAccountDangerStatusNotActive = Votre compte est déjà désactivé.
settingsAccountDangerStatusClearing = Effacement de votre session…
settingsAccountDangerStatusDeactivating = Désactivation de votre compte…
settingsAccountDangerStatusError = Impossible de terminer la requête. Réessayez.
settingsUploadLinksHeading = Liens d’envoi
settingsUploadLinksDescription = Créez et gérez des liens d’envoi invités. Ces liens permettent de téléverser des fichiers sans se connecter.
settingsUploadLinksLabelLabel = Nom du lien
settingsUploadLinksLabelHint = Choisissez un nom descriptif pour retrouver facilement le lien plus tard.
settingsUploadLinksLabelPlaceholder = Espace partenaire
settingsUploadLinksDescriptionLabel = Note interne
settingsUploadLinksDescriptionHint = Seuls les administrateurs peuvent voir cette note.
settingsUploadLinksDescriptionPlaceholder = Détails facultatifs
settingsUploadLinksCreateButton = Créer un lien d’envoi
settingsUploadLinksStatusLabelRequired = Veuillez indiquer un nom avant de créer le lien.
settingsUploadLinksStatusCreating = Création du lien d’envoi…
settingsUploadLinksStatusCreated = Lien d’envoi prêt.
settingsUploadLinksStatusError = Impossible de créer le lien d’envoi. Réessayez.
settingsUploadLinksStatusRevoking = Révocation du lien d’envoi…
settingsUploadLinksStatusRevoked = Lien d’envoi révoqué.
settingsUploadLinksStatusRevokeError = Impossible de révoquer le lien d’envoi. Réessayez.
settingsUploadLinksStatusLoading = Chargement des liens d’envoi…
settingsUploadLinksStatusLoadingError = Impossible de charger les liens d’envoi. Réessayez.
settingsUploadLinksDetailHeading = Nouveau lien d’envoi créé
settingsUploadLinksDetailDescription = Copiez ce lien maintenant — il ne sera pas affiché à nouveau.
settingsUploadLinksDetailLabelName = Nom
settingsUploadLinksDetailHint = Partagez ce lien en toute sécurité avec votre invité.
settingsUploadLinksCopyButton = Copier le lien
settingsUploadLinksCopySuccess = Lien d’envoi copié dans le presse-papiers.
settingsUploadLinksCopyError = Échec de la copie. Copiez manuellement le lien.
settingsUploadLinksTableHeading = Liens émis
settingsUploadLinksTableSubheading = Jetons d’envoi invités actifs
settingsUploadLinksTableLabel = Nom
settingsUploadLinksTablePreview = Aperçu
settingsUploadLinksTableStatus = Statut
settingsUploadLinksTableCreated = Créé
settingsUploadLinksTableActions = Actions
settingsUploadLinksEmpty = Aucun lien d’envoi n’a encore été créé.
settingsUploadLinksStatusActive = Actif
settingsUploadLinksStatusRevokedLabel = Révoqué
settingsUploadLinksRevokedBadge = Révoqué
settingsUploadLinksLabelFallback = Lien d’envoi
settingsUploadLinksNoPreview = —
settingsUploadLinksRevokeButton = Révoquer
settingsUploadLinksCreatedUnknown = Non disponible
settingsUploadLinksPlaceholderTitle = Envois invités
settingsUploadLinksPlaceholderDescription = Les administrateurs peuvent émettre des liens d'envoi pour des boîtes partagées. Lorsqu'un lien vous est attribué, il s'affiche ici.
settingsUploadLinksGeneralLabel = Lien d'envoi général
settingsUploadLinksGeneralHint = Permet les uploads pour n'importe quel utilisateur (boîte de réception générale)
recipientLockedHint = Ce lien d'upload est restreint aux uploads pour { $userName }
recipientHintSelected = Le destinataire peut voir, télécharger et déchiffrer le fichier.
encryptForLabel = Destinataire
recipientUnspecified = Toute personne disposant du lien
settingsUploadLinksTableType = Type/Utilisateur
settingsUploadLinksTypeGeneral = Général
settingsUploadLinksTypeUserFallback = Spécifique à l'utilisateur
settingsAccountDeactivateConfirm = Voulez-vous vraiment désactiver votre compte ? Vous serez immédiatement déconnecté.
settingsAccountKeyHeading = Sauvegarde de la clé privée
settingsAccountKeyDescription = Copiez votre clé de chiffrement privée et conservez-la en lieu sûr. Perdre cette clé signifie perdre l’accès aux données chiffrées. Gardez-la secrète.
settingsAccountKeyCopyLabel = Copier la clé privée
settingsAccountKeyStatusCopied = Clé privée copiée dans le presse-papiers.
settingsAccountKeyStatusError = Impossible de copier la clé. Réessayez.
settingsAccountKeyStatusUnavailable = Clé privée indisponible.
settingsAccountKeyUnavailable = Indisponible
settingsPasswordStatusInfoDeriving = Recalcul des clés…
settingsPasswordStatusInfoPreparing = Préparation des nouvelles informations d’identification…
settingsPasswordStatusInfoUpdating = Mise à jour du mot de passe…
settingsPasswordStatusErrorCurrent = Le mot de passe actuel est obligatoire.
settingsPasswordStatusErrorNewLength = Le nouveau mot de passe doit comporter au moins 10 caractères.
settingsPasswordStatusErrorMismatch = Les nouveaux mots de passe ne correspondent pas.
settingsPasswordStatusErrorNoSession = Aucune session trouvée. Veuillez vous reconnecter.
settingsPasswordStatusErrorMissingKeys = Matériel de clé manquant. Veuillez vous reconnecter.
settingsPasswordStatusErrorIncorrect = Le mot de passe actuel est incorrect.
settingsPasswordStatusErrorDerive = Impossible de dériver les identifiants. Réessayez.
settingsPasswordStatusErrorPublicKeys = Échec du calcul des clés publiques.
settingsPasswordStatusErrorUserSecrets = Impossible de préparer le nouveau matériel de clé.
settingsPasswordStatusErrorWrap = Impossible de rechiffrer les clés de fichier.
settingsPasswordStatusErrorRequest = Échec de la réinitialisation du mot de passe.
settingsPasswordStatusErrorGeneric = Échec de la mise à jour du mot de passe.
settingsPasswordStatusSuccess = Mot de passe mis à jour avec succès.

## Login strings

loginTitle = Upload Access
loginDescription = Saisissez vos identifiants pour continuer
loginEmailLabel = Adresse e-mail
loginPasswordLabel = Mot de passe
loginTrustComputerLabel = Faire confiance à cet ordinateur
loginTrustComputerHint = Rester connecté pendant 30 jours
loginSubmitButton = Se connecter
loginSubmitting = Connexion…
loginErrorChallenge = Impossible de démarrer le défi de connexion. Veuillez réessayer.
loginErrorGeneric = Échec de la connexion. Veuillez réessayer.

## File ownership labels

fileTileFrom = DE
fileTileTo = À
fileTileGuest = Invité
fileTileRecipientNotice = Le destinataire doit se connecter pour télécharger ce fichier

footerLinkCli = CLI
footerLinkDmca = DMCA
footerLinkSource = Code source
footerLinkLogin = Se connecter
footerLinkLogout = Se déconnecter
footerUntrustedWarning = Cet ordinateur n'est pas sûr ! Pensez à vous déconnecter !
