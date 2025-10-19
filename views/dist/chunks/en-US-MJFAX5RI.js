import "./chunk-IFG75HHC.js";

// locales/en-US.ftl
var en_US_default = `title = Go Send
importingFile = Importing\u2026
encryptingFile = Encrypting\u2026
decryptingFile = Decrypting\u2026
downloadCount = { $num ->
        [one] 1 download
       *[other] { $num } downloads
    }
timespanHours = { $num ->
        [one] 1 hour
       *[other] { $num } hours
    }
copiedUrl = Copied!
unlockInputPlaceholder = Password
unlockButtonLabel = Unlock
downloadButtonLabel = Download
downloadFinish = Download complete
fileSizeProgress = ({ $partialSize } of { $totalSize })
sendYourFilesLink = Try Go Send
errorPageHeader = Something went wrong!
fileTooBig = That file is too big to upload. It should be less than { $size }
linkExpiredAlt = Link expired
notSupportedHeader = Your browser is not supported.
notSupportedLink = Why is my browser not supported?
notSupportedOutdatedDetail = Unfortunately this version of Firefox does not support the web technology that powers Go Send. You\u2019ll need to update your browser.
updateFirefox = Update Firefox
deletePopupCancel = Cancel
deleteButtonHover = Delete
footerText = Not affiliated with Mozilla or Firefox.
footerLinkDonate = Donate
footerLinkCli = CLI
footerLinkDmca = DMCA
footerLinkSource = Source
footerLinkLogin = Sign in
footerLinkLogout = Sign out
passwordTryAgain = Incorrect password. Try again.
javascriptRequired = Go Send requires JavaScript
whyJavascript = Why does Go Send require JavaScript?
enableJavascript = Please enable JavaScript and try again.
# A short representation of a countdown timer containing the number of hours and minutes remaining as digits, example "13h 47m"
expiresHoursMinutes = { $hours }h { $minutes }m
# A short representation of a countdown timer containing the number of minutes remaining as digits, example "56m"
expiresMinutes = { $minutes }m
# A short status message shown when the user enters a long password
maxPasswordLength = Maximum password length: { $length }
# A short status message shown when there was an error setting the password
passwordSetError = This password could not be set

## Send version 2 strings

-send-brand = Go Send
-send-short-brand = Go Send
-firefox = Firefox
-mozilla = Mozilla

introTitle = Simple, private file sharing
introDescription = { -send-brand } lets you share files with end-to-end encryption and a link that automatically expires. So you can keep what you share private and make sure your stuff doesn\u2019t stay online forever.
notifyUploadEncryptDone = Your file is encrypted and ready to send
# downloadCount is from the downloadCount string and timespan is a timespanMinutes string. ex. 'Expires after 2 downloads or 25 minutes'
archiveExpiryInfo = Expires after { $downloadCount } or { $timespan }
timespanMinutes = { $num ->
        [one] 1 minute
       *[other] { $num } minutes
    }
timespanDays = { $num ->
        [one] 1 day
       *[other] { $num } days
    }
timespanWeeks = { $num ->
        [one] 1 week
       *[other] { $num } weeks
    }
fileCount = { $num ->
    [one] 1 file
   *[other] { $num } files
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
totalSize = Total size: { $size }
# the next line after the colon contains a file name
copyLinkDescription = Copy the link to share your file:
copyLinkButton = Copy link
downloadTitle = Download files
downloadDescription = This file was shared via { -send-brand } with end-to-end encryption and a link that automatically expires.
trySendDescription = Try { -send-brand } for simple, safe file sharing.
# count will always be > 10
tooManyFiles = { $count ->
     [one] Only 1 file can be uploaded at a time.
    *[other] Only { $count } files can be uploaded at a time.
}
# count will always be > 10
tooManyArchives = { $count ->
     [one] Only 1 archive is allowed.
    *[other] Only { $count } archives are allowed.
}
expiredTitle = This link has expired.
notSupportedDescription = { -send-brand } will not work with this browser. { -send-short-brand } works best with the latest version of { -firefox }, and will work with the current version of most browsers.
downloadFirefox = Download { -firefox }
legalTitle = { -send-short-brand } Privacy Notice
legalDateStamp = Version 1.0, dated March 12, 2019
# A short representation of a countdown timer containing the number of days, hours, and minutes remaining as digits, example "2d 11h 56m"
expiresDaysHoursMinutes = { $days }d { $hours }h { $minutes }m
addFilesButton = Select files to upload
uploadButton = Upload
# the first part of the string 'Drag and drop files or click to send up to 1GB'
dragAndDropFiles = Drag and drop files
# the second part of the string 'Drag and drop files or click to send up to 1GB'
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
orClickWithSize = or click to send up to { $size }
addPassword = Protect with password
emailPlaceholder = Enter your email
archiveNameLabel = Archive name
archiveNameHint = The name recipients will see when downloading
archiveNameInvalidChars = Filename cannot contain: < > : " / \\ | ? *
archiveNameInvalidEnd = Filename cannot end with a dot or space
archiveNameReserved = This filename is reserved by the system
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
signInSizeBump = Sign in to send up to { $size }
signInOnlyButton = Sign in
accountBenefitTitle = Create a { -firefox } Account or sign in
# $size is the size of the file, displayed using the fileSize message as format (e.g. "2.5MB")
accountBenefitLargeFiles = Share files up to { $size }
accountBenefitDownloadCount = Share files with more people
accountBenefitTimeLimit = { $count ->
     [one] Keep links active for up to 1 day
    *[other] Keep links active for up to { $count } days
}
accountBenefitSync = Manage shared files from any device
accountBenefitMoz = Learn about other { -mozilla } services
signOut = Sign out
okButton = OK
downloadingTitle = Downloading
noStreamsWarning = This browser might not be able to decrypt a file this big.
noStreamsOptionCopy = Copy the link to open in another browser
noStreamsOptionFirefox = Try our favorite browser
noStreamsOptionDownload = Continue with this browser
downloadFirefoxPromo = { -send-short-brand } is brought to you by the all-new { -firefox }.
# the next line after the colon contains a file name
shareLinkDescription = Share the link to your file:
shareLinkButton = Share link
# $name is the name of the file
shareMessage = Download \u201C{ $name }\u201D with { -send-brand }: simple, safe file sharing
learnMore = Learn more.

sponsoredByThunderbird = Sponsored by Thunderbird

## Registration strings

registerAdminTitle = Register Administrator
registerUserTitle = Register User
registerAdminDescription = Create your administrator account
registerUserDescription = Create your user account
registerNameLabel = Name
registerNamePlaceholder = Your name
registerEmailLabel = Email
registerEmailPlaceholder = your@email.com
registerPasswordLabel = Password
registerPasswordHint = At least 10 characters
registerPasswordConfirmLabel = Confirm Password
registerSubmitButton = Create Account
registerSuccessTitle = Account Created Successfully
registerSuccessMessage = Welcome, { $name }! Your administrator account has been created.
registerSuccessButton = Go to Upload
registerErrorPasswordsMismatch = Passwords do not match
registerErrorNameRequired = Please enter your name
registerErrorMissingToken = Invalid registration link
registerErrorGeneric = Registration failed. Please try again.
registerSubmitting = Creating account...

authErrorInvalidEmail = Please enter a valid email address
authErrorPasswordLength = Password must be at least 10 characters
authErrorCryptoUnsupported = Your browser does not support the required cryptography APIs.

## Login strings

loginTitle = Upload Access
loginDescription = Enter your credentials to continue
loginEmailLabel = Email
loginPasswordLabel = Password
loginSubmitButton = Sign in
loginSubmitting = Signing in...
loginErrorChallenge = Could not start login challenge. Please try again.
loginErrorGeneric = Login failed. Please try again.
`;
export {
  en_US_default as default
};
//# sourceMappingURL=en-US-MJFAX5RI.js.map
