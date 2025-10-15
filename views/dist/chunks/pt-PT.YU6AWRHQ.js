var e=`title = Go Send
importingFile = A importar...
encryptingFile = A encriptar...
decryptingFile = A desencriptar...
downloadCount =
    { $num ->
        [one] 1 transfer\xEAncia
       *[other] { $num } transfer\xEAncias
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } horas
    }
copiedUrl = Copiado!
unlockInputPlaceholder = Palavra-passe
unlockButtonLabel = Desbloquear
downloadButtonLabel = Transferir
downloadFinish = Transfer\xEAncia conclu\xEDda
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Experimentar o Send
errorPageHeader = Algo correu mal.
fileTooBig = Esse ficheiro \xE9 muito grande para carregar. Deve ser menor do que { $size }.
linkExpiredAlt = Liga\xE7\xE3o expirada
notSupportedHeader = O seu navegador n\xE3o \xE9 suportado.
notSupportedLink = Porque \xE9 que o meu navegador n\xE3o \xE9 suportado?
notSupportedOutdatedDetail = Infelizmente esta vers\xE3o do Firefox n\xE3o suporta a tecnologia web que faz o Send funcionar. Precisa de atualizar o seu navegador.
updateFirefox = Atualizar o Firefox
deletePopupCancel = Cancelar
deleteButtonHover = Apagar
passwordTryAgain = Palavra-passe incorreta. Tente novamente.
javascriptRequired = O Send requer JavaScript
whyJavascript = Porque \xE9 que o Send requer JavaScript?
enableJavascript = Por favor ative o JavaScript e tente novamente.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Comprimento m\xE1ximo de palavra-passe: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Esta palavra-passe n\xE3o p\xF4de ser definida

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Partilha de ficheiros simples e privada
introDescription = O { -send-brand } permite partilhar ficheiros com encripta\xE7\xE3o de ponta a ponta e uma liga\xE7\xE3o que expira automaticamente. Para que possa manter o que partilha privado e garantir que as suas coisas n\xE3o fiquem online para sempre.
notifyUploadEncryptDone = O seu ficheiro est\xE1 encriptado e pronto a enviar
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expira ap\xF3s { $downloadCount } ou { $timespan }
timespanMinutes =
    { $num ->
        [one] 1 minuto
       *[other] { $num } minutos
    }
timespanDays =
    { $num ->
        [one] 1 dia
       *[other] { $num } dias
    }
timespanWeeks =
    { $num ->
        [one] 1 semana
       *[other] { $num } semanas
    }
fileCount =
    { $num ->
        [one] 1 ficheiro
       *[other] { $num } ficheiros
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
totalSize = Tamanho total: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copie a liga\xE7\xE3o para partilhar o seu ficheiro:
copyLinkButton = Copiar liga\xE7\xE3o
downloadTitle = Transfira ficheiros
downloadDescription = Este ficheiro foi partilhado via { -send-brand } com encripta\xE7\xE3o de ponta a ponta e uma liga\xE7\xE3o que expira automaticamente.
trySendDescription = Experimente o { -send-brand } para uma partilha de ficheiros simples e segura.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Apenas 1 ficheiro pode ser carregado de cada vez.
       *[other] Apenas { $count } ficheiros podem ser carregados de cada vez.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] Apenas 1 ficheiro \xE9 permitido.
       *[other] Apenas { $count } ficheiros s\xE3o permitidos.
    }
expiredTitle = Esta liga\xE7\xE3o expirou.
notSupportedDescription = O { -send-brand } n\xE3o funciona com este navegador. O { -send-short-brand } funciona melhor com a vers\xE3o mais recente do { -firefox } e ir\xE1 funcionar com a vers\xE3o atual da maioria dos navegadores.
downloadFirefox = Transferir o { -firefox }
legalTitle = Aviso de privacidade do { -send-short-brand }
legalDateStamp = Vers\xE3o 1.0, de 12 de mar\xE7o de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Selecionar ficheiros para carregar
uploadButton = Carregar
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arraste e largue ficheiros
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ou clique para enviar at\xE9 { $size }
addPassword = Proteger com palavra-passe
emailPlaceholder = Introduzir o seu email
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Iniciar sess\xE3o para enviar at\xE9 { $size }
signInOnlyButton = Iniciar sess\xE3o
accountBenefitTitle = Crie uma Conta { -firefox } ou inicie sess\xE3o
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Partilhe ficheiros at\xE9 { $size }
accountBenefitDownloadCount = Partilhe ficheiros com mais pessoas
accountBenefitTimeLimit =
    { $count ->
        [one] Mantenha liga\xE7\xF5es ativas at\xE9 1 dia
       *[other] Mantenha liga\xE7\xF5es ativas at\xE9 { $count } dias
    }
accountBenefitSync = Gira ficheiros partilhas a partir de qualquer dispositivo
accountBenefitMoz = Saiba mais acerca de outros servi\xE7os da { -mozilla }
signOut = Terminar sess\xE3o
okButton = OK
downloadingTitle = A transferir
noStreamsWarning = Este navegador pode n\xE3o conseguir desencriptar um ficheiro t\xE3o grande.
noStreamsOptionCopy = Copie a liga\xE7\xE3o para abrir noutro navegador
noStreamsOptionFirefox = Experimente o nosso navegador favorito
noStreamsOptionDownload = Continuar com este navegador
downloadFirefoxPromo = O { -send-short-brand } \xE9 trazido a si pelo novo { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Partilhe a liga\xE7\xE3o para o seu ficheiro:
shareLinkButton = Partilhar liga\xE7\xE3o
# $name is the name of the file
shareMessage = Transferir \u201C{ $name }\u201C com o { -send-brand }: partilha de ficheiros simples e segura
trailheadPromo = Existe um modo para proteger a sua privacidade. Adira ao Firefox.
learnMore = Saiba mais.
`;export{e as default};
