var e=`title = Go Send
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
`;export{e as default};
