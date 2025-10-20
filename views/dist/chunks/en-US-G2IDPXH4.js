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
footerUntrustedWarning = This computer isn't trusted! Remember to sign out!
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
uploadGuestBannerMessageGuest = Remember to logout on untrusted devices!
uploadGuestBannerMessageEphemeral = This computer isn\u2019t trusted! Remember to sign out!
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
encryptForLabel = Recipient
recipientUnspecified = Anyone with the link
recipientHintSelected = The recipient can see, download and decrypt the file.
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

## Settings strings

footerLinkSettings = Settings
settingsDialogTitle = Settings
settingsDialogDescription = Manage your account preferences and team members.
settingsBackButton = Upload
settingsNavAccount = Account
settingsNavUploadLinks = Upload links
settingsNavUsers = Users
settingsAccountHeading = Account
settingsAccountSubheading = Manage your profile information, password, and sign-in sessions.
settingsAccountProfileHeading = Profile
settingsAccountProfileDescription = Update the name and email associated with your account.
settingsAccountNameLabel = Name
settingsAccountEmailLabel = Email
settingsAccountProfileSave = Save profile
settingsAccountPasswordHeading = Password
settingsAccountPasswordDescription = Set a new password for your account. Changes take effect immediately.
settingsAccountPasswordCurrentLabel = Current password
settingsAccountPasswordNewLabel = New password
settingsAccountPasswordConfirmLabel = Confirm new password
settingsAccountPasswordSave = Update password
settingsAccountPasswordHint = Passwords must be at least 10 characters long.
settingsAccountDangerHeading = Session & access
settingsAccountDangerDescription = Clear your current sign-in or deactivate the account entirely. Both actions log you out.
settingsAccountClearSessions = Clear session
settingsAccountDeactivate = Deactivate account
settingsAccountKeyHeading = Private key backup
settingsAccountKeyDescription = Copy your private encryption key and store it somewhere safe. Losing this key means losing access to encrypted data. Keep it secret.
settingsAccountKeyCopyLabel = Copy private key
settingsAccountKeyStatusCopied = Private key copied to clipboard.
settingsAccountKeyStatusError = Could not copy the key. Try again.
settingsAccountKeyStatusUnavailable = Private key not available.
settingsAccountKeyUnavailable = Not available
settingsUsersHeading = Users
settingsUsersIntro = Issue invitation links for new administrators or standard users. Links expire after 7 days and can be used once.
settingsUsersAdminTitle = Administrator signup links
settingsUsersAdminDescription = Generate one-time invitations for administrator accounts.
settingsUsersUserTitle = User signup links
settingsUsersUserDescription = Generate one-time invitations for standard users.
settingsUsersActiveLinksLabel = Active links
settingsUsersGenerateAdmin = Issue admin link
settingsUsersGenerateUser = Issue user link
settingsUsersRevokeAdmin = Revoke admin links
settingsUsersRevokeUser = Revoke user links
settingsUsersGenerating = Creating a new signup link\u2026
settingsUsersGenerateSuccess = Signup link created.
settingsUsersGenerateError = Could not create a signup link. Try again.
settingsUsersRevoking = Revoking pending links\u2026
settingsUsersRevokeSuccess = Pending signup links revoked.
settingsUsersRevokeError = Could not revoke signup links. Try again.
settingsUsersCopySuccess = Link copied to clipboard.
settingsUsersCopyError = Copy failed. Please copy the link manually.
settingsUsersOverviewError = Unable to load signup link status.
settingsUsersQrError = QR code unavailable
settingsUsersDetailBack = Back to invitations
settingsUsersDetailHeadingAdmin = Admin signup link
settingsUsersDetailHeadingUser = User signup link
settingsUsersDetailDescription = Share this link. It expires { $date } and can be used once.
settingsUsersDetailActiveLabel = Active links
settingsUsersDetailFootnote = Each invitation link works only once and expires automatically after seven days.
settingsUsersDetailCopySuccess = Link copied to clipboard.
settingsUsersDetailCopyError = Copy failed. Please copy the link manually.
settingsUsersDetailExpiresUnknown = Expires soon
settingsUsersListHeading = Existing users
settingsUsersListName = Name
settingsUsersListEmail = Email
settingsUsersListPublicKeys = Public keys
settingsUsersListSessions = Active sessions
settingsUsersListActions = Actions
settingsUsersListLoading = Loading users\u2026
settingsUsersListError = Could not load users. Try again.
settingsUsersListEmpty = No other users yet.
settingsUsersActionClearSessions = Clear sessions
settingsUsersActionDelete = Delete user
settingsUsersActionDeleteConfirm = Are you sure you want to delete { $name }? This cannot be undone.
settingsUsersActionDeleteSelfError = You cannot delete your own account.
settingsUsersActionDeleteSuccess = { $name } was deleted.
settingsUsersActionDeleteError = Could not delete user. Try again.
settingsUsersActionDeleteWorking = Deleting user\u2026
settingsUsersActionClearSuccess = Sessions cleared for { $name }.
settingsUsersActionClearError = Could not clear sessions. Try again.
settingsUsersActionClearWorking = Clearing sessions\u2026
settingsUsersActionDeleteSelfTooltip = You cannot delete your own account.
settingsUsersActionClearDisabledTooltip = No active sessions to clear.
settingsUsersActionDeactivate = Deactivate
settingsUsersActionActivate = Activate
settingsUsersActionDeactivateWorking = Deactivating user\u2026
settingsUsersActionDeactivateSuccess = { $name } was deactivated.
settingsUsersActionDeactivateError = Could not deactivate user. Try again.
settingsUsersActionDeactivateSelfError = You cannot deactivate your own account.
settingsUsersActionActivateWorking = Activating user\u2026
settingsUsersActionActivateSuccess = { $name } is active again.
settingsUsersActionActivateError = Could not activate user. Try again.
settingsUsersRoleAdmin = Administrator
settingsUsersRoleUser = User
settingsUsersRoleGuest = Guest
settingsUsersRoleUnknown = Unknown role
settingsUsersStatusActive = Active
settingsUsersStatusInactive = Disabled
settingsUsersKeySigning = Signing key
settingsUsersKeyEncryption = Encryption key
settingsUsersKeyMissing = Not available
settingsUsersNameFallback = User
settingsUsersCurrentUserLabel = You
settingsAccountProfileStatusSaving = Saving profile\u2026
settingsAccountProfileStatusSuccess = Profile updated.
settingsAccountProfileStatusError = Could not update profile. Try again.
settingsAccountProfileStatusNameRequired = Name is required.
settingsAccountProfileStatusEmailRequired = Email is required.
settingsAccountProfileStatusEmailInvalid = Enter a valid email address.
settingsAccountProfileStatusEmailInUse = That email is already in use.
settingsAccountDangerStatusNotActive = Your account is already deactivated.
settingsAccountDangerStatusClearing = Clearing your session\u2026
settingsAccountDangerStatusDeactivating = Deactivating your account\u2026
settingsAccountDangerStatusError = Could not complete the request. Try again.
settingsAccountDeactivateConfirm = Are you sure you want to deactivate your account? This will log you out immediately.
settingsUploadLinksHeading = Upload links
settingsUploadLinksDescription = Issue and manage guest upload links. These links allow uploads without signing in.
settingsUploadLinksLabelLabel = Link label
settingsUploadLinksLabelHint = Use a descriptive name so you can recognize the link later.
settingsUploadLinksLabelPlaceholder = Partner workspace
settingsUploadLinksDescriptionLabel = Internal note
settingsUploadLinksDescriptionHint = Only administrators can see this note.
settingsUploadLinksDescriptionPlaceholder = Optional details
settingsUploadLinksCreateButton = Issue upload link
settingsUploadLinksStatusLabelRequired = Provide a label before issuing a link.
settingsUploadLinksStatusCreating = Creating upload link\u2026
settingsUploadLinksStatusCreated = Upload link ready.
settingsUploadLinksStatusError = Could not create the upload link. Try again.
settingsUploadLinksStatusRevoking = Revoking upload link\u2026
settingsUploadLinksStatusRevoked = Upload link revoked.
settingsUploadLinksStatusRevokeError = Could not revoke the upload link. Try again.
settingsUploadLinksStatusLoading = Loading upload links\u2026
settingsUploadLinksStatusLoadingError = Could not load upload links. Try again.
settingsUploadLinksDetailHeading = New upload link created
settingsUploadLinksDetailDescription = Copy this link now\u2014it will not be shown again.
settingsUploadLinksDetailLabelName = Label
settingsUploadLinksDetailHint = Share this link securely with your guest.
settingsUploadLinksCopyButton = Copy link
settingsUploadLinksCopySuccess = Upload link copied to clipboard.
settingsUploadLinksCopyError = Copy failed. Please copy the link manually.
settingsUploadLinksTableHeading = Issued links
settingsUploadLinksTableSubheading = Active guest upload tokens
settingsUploadLinksTableLabel = Label
settingsUploadLinksTablePreview = Preview
settingsUploadLinksTableStatus = Status
settingsUploadLinksTableCreated = Created
settingsUploadLinksTableActions = Actions
settingsUploadLinksEmpty = No upload links issued yet.
settingsUploadLinksStatusActive = Active
settingsUploadLinksStatusRevokedLabel = Revoked
settingsUploadLinksRevokedBadge = Revoked
settingsUploadLinksLabelFallback = Upload link
settingsUploadLinksNoPreview = \u2014
settingsUploadLinksRevokeButton = Revoke
settingsUploadLinksCreatedUnknown = Not available
settingsUploadLinksPlaceholderTitle = Guest uploads
settingsUploadLinksPlaceholderDescription = Administrators can issue guest upload links for shared inboxes. When a link is shared with you it will appear here.
settingsPasswordStatusInfoDeriving = Re-deriving keys\u2026
settingsPasswordStatusInfoPreparing = Preparing new credentials\u2026
settingsPasswordStatusInfoUpdating = Updating password\u2026
settingsPasswordStatusErrorCurrent = Current password is required.
settingsPasswordStatusErrorNewLength = New password must be at least 10 characters long.
settingsPasswordStatusErrorMismatch = New passwords do not match.
settingsPasswordStatusErrorNoSession = No user session found. Please log in again.
settingsPasswordStatusErrorMissingKeys = Missing key material. Please log in again.
settingsPasswordStatusErrorIncorrect = Current password is incorrect.
settingsPasswordStatusErrorDerive = Could not derive credentials. Please try again.
settingsPasswordStatusErrorPublicKeys = Failed to compute public keys.
settingsPasswordStatusErrorUserSecrets = Failed to prepare new key material.
settingsPasswordStatusErrorWrap = Failed to re-encrypt file keys.
settingsPasswordStatusErrorRequest = Password reset failed.
settingsPasswordStatusErrorGeneric = Failed to update password.
settingsPasswordStatusSuccess = Password updated successfully.

## Login strings

loginTitle = Upload Access
loginDescription = Enter your credentials to continue
loginEmailLabel = Email
loginPasswordLabel = Password
loginTrustComputerLabel = Trust this computer
loginTrustComputerHint = Stay logged in for 30 days
loginSubmitButton = Sign in
loginSubmitting = Signing in...
loginErrorChallenge = Could not start login challenge. Please try again.
loginErrorGeneric = Login failed. Please try again.

## Inbox/Outbox strings

inboxLabel = Inbox
outboxLabel = Outbox
sharedBy = Shared by
sentTo = Sent to
noInboxFiles = No files in your inbox
noOutboxFiles = No files in your outbox
deleteConfirm = Are you sure you want to delete this file?
deleteFailed = Failed to delete file
expiresInDays = Expires in { $days ->
    [one] 1 day
   *[other] { $days } days
}
expiresInHours = Expires in { $hours ->
    [one] 1 hour
   *[other] { $hours } hours
}
expiresInMinutes = Expires soon
expired = Expired
`;
export {
  en_US_default as default
};
//# sourceMappingURL=en-US-G2IDPXH4.js.map
