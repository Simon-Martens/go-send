import "./chunk-IFG75HHC.js";

// locales/pt-BR.ftl
var pt_BR_default = `title = Go Send
importingFile = Importando\u2026
encryptingFile = Criptografando\u2026
decryptingFile = Descriptografando\u2026
downloadCount =
    { $num ->
        [one] baixar 1 vez
       *[other] baixar { $num } vezes
    }
timespanHours =
    { $num ->
        [one] 1 hora
       *[other] { $num } horas
    }
copiedUrl = Copiado!
unlockInputPlaceholder = Senha
unlockButtonLabel = Desbloquear
downloadButtonLabel = Baixar
downloadFinish = Download conclu\xEDdo
fileSizeProgress = ({ $partialSize } de { $totalSize })
sendYourFilesLink = Experimente o Send
errorPageHeader = Oops, ocorreu um erro!
fileTooBig = Esse arquivo ou grupo de arquivos \xE9 grande demais para ser enviado. Deve ser menor que { $size }.
linkExpiredAlt = Link expirado
notSupportedHeader = Seu navegador n\xE3o \xE9 suportado.
notSupportedLink = Por que meu navegador n\xE3o \xE9 suportado?
notSupportedOutdatedDetail = Infelizmente essa vers\xE3o do Firefox n\xE3o suporta a tecnologia web que faz o Send funcionar. Voc\xEA precisa atualizar o seu navegador.
updateFirefox = Atualizar o Firefox
deletePopupCancel = Cancelar
deleteButtonHover = Remover da lista
passwordTryAgain = Senha incorreta. Tente novamente.
javascriptRequired = O Send requer JavaScript
whyJavascript = Por que o Send precisa do JavaScript?
enableJavascript = Ative o JavaScript e tente novamente.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }min
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }min
# A short status message shown when the user enters a long password
maxPasswordLength = Tamanho m\xE1ximo da senha: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = Essa senha n\xE3o p\xF4de ser definida

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla
introTitle = Compartilhamento de arquivos f\xE1cil e privativo
introDescription = O { -send-brand } permite compartilhar arquivos com criptografia de ponta a ponta atrav\xE9s de um link que expira automaticamente. Assim voc\xEA pode proteger o que compartilha e ter certeza que suas coisas n\xE3o ficar\xE3o online para sempre.
notifyUploadEncryptDone = Seu arquivo foi criptografado e est\xE1 pronto para ser enviado
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
        [one] 1 arquivo
       *[other] { $num } arquivos
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
copyLinkDescription = Copie o link para compartilhar seu arquivo:
copyLinkButton = Copiar link
downloadTitle = Baixar arquivos
downloadDescription = Este arquivo foi compartilhado via { -send-brand } com criptografia de ponta a ponta e um link que expira automaticamente.
trySendDescription = Experimente o { -send-brand } para compartilhar arquivos com simplicidade e seguran\xE7a.
# count will always be > 10
tooManyFiles =
    { $count ->
        [one] Somente 1 arquivo pode ser enviado por vez.
       *[other] Somente { $count } arquivos podem ser enviados por vez.
    }
# count will always be > 10
tooManyArchives =
    { $count ->
        [one] S\xF3 \xE9 permitido 1 pacote.
       *[other] S\xF3 s\xE3o permitidos { $count } pacotes.
    }
expiredTitle = Este link expirou.
notSupportedDescription = O { -send-brand } n\xE3o funciona com este navegador. O { -send-short-brand } funciona melhor com a vers\xE3o mais recente do { -firefox } e funcionar\xE1 com a vers\xE3o atual da maioria dos navegadores.
downloadFirefox = Baixar o { -firefox }
legalTitle = Aviso de privacidade do { -send-short-brand }
legalDateStamp = Vers\xE3o 1.0, de 12 de mar\xE7o de 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Selecionar arquivos para enviar
uploadButton = Enviar
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Arraste e solte arquivos aqui
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = ou clique para enviar at\xE9 { $size }
addPassword = Proteger com senha
emailPlaceholder = Informe seu e-mail
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Entre na sua conta para enviar at\xE9 { $size }
signInOnlyButton = Entrar
accountBenefitTitle = Crie uma Conta { -firefox } ou entre se j\xE1 tiver
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Compartilhe arquivos at\xE9 { $size }.
accountBenefitDownloadCount = Compartilhe arquivos com mais pessoas.
accountBenefitTimeLimit =
    { $count ->
        [one] Mantenha links ativos por at\xE9 1 dia.
       *[other] Mantenha links ativos por at\xE9 { $count } dias.
    }
accountBenefitSync = Gerencie arquivos compartilhados a partir de qualquer dispositivo.
accountBenefitMoz = Conhe\xE7a outros servi\xE7os da { -mozilla }.
signOut = Sair
okButton = OK
downloadingTitle = Baixando
noStreamsWarning = Este navegador pode n\xE3o conseguir descriptografar um arquivo t\xE3o grande.
noStreamsOptionCopy = Copiar o link para abrir em outro navegador
noStreamsOptionFirefox = Experimente nosso navegador preferido
noStreamsOptionDownload = Continuar com este navegador
downloadFirefoxPromo = O { -send-short-brand } \xE9 apresentado pelo novo { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Compartilhe o link para o seu arquivo:
shareLinkButton = Compartilhar link
# $name is the name of the file
shareMessage = Baixe "{ $name }" com o { -send-brand }: compartilhamento de arquivos simples e seguro
trailheadPromo = Existe um meio de proteger sua privacidade. Use o Firefox.
learnMore = Saiba mais.
`;
export {
  pt_BR_default as default
};
//# sourceMappingURL=pt-BR-RBY4C6ZS.js.map
