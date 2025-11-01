package email

import (
	"bytes"
	"fmt"
	"text/template"
)

// Email template constants
const (
	userSignupInvitationSubject = "You've been invited to {{.ServiceName}}"
	userSignupInvitationBody    = `Hello,

You've been invited to join {{.ServiceName}}.

Click the link below to create your account:
{{.AuthLink}}

This link will expire after first use.

If you did not expect this invitation, you can safely ignore this email.

---
{{.ServiceName}}
`

	adminSignupInvitationSubject = "Admin invitation for {{.ServiceName}}"
	adminSignupInvitationBody    = `Hello,

You've been invited to join {{.ServiceName}} as an administrator.

As an admin, you will have full access to manage users, files, and system settings.

Click the link below to create your administrator account:
{{.AuthLink}}

This link will expire after first use.

If you did not expect this invitation, please contact the system administrator immediately.

---
{{.ServiceName}}
`

	uploadNotificationSubject = "{{.UploaderName}} shared a file with you"
	uploadNotificationBody    = `Hello {{.UserName}},

{{.UploaderName}} ({{.UploaderEmail}}) has shared a file with you.

You can download the file by visiting your account.

---
{{.ServiceName}}
`

	passwordChangeSubject = "Complete your password change"
	passwordChangeBody    = `Hello {{.UserName}},

You requested to change your password for {{.ServiceName}}.

Click the link below to confirm and complete your password change:
{{.AuthLink}}

If you did not request this password change, please ignore this email and your password will remain unchanged.

For security reasons, this link will expire after first use.

---
{{.ServiceName}}
`
)

// RenderUserSignupInvitation renders the user signup invitation email
func RenderUserSignupInvitation(userEmail, authLink string) (subject, body string, err error) {
	data := map[string]string{
		"UserEmail":   userEmail,
		"AuthLink":    authLink,
		"ServiceName": "go-send",
	}

	subject, err = renderTemplate("userSignupInvitationSubject", userSignupInvitationSubject, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render subject: %w", err)
	}

	body, err = renderTemplate("userSignupInvitationBody", userSignupInvitationBody, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render body: %w", err)
	}

	return subject, body, nil
}

// RenderAdminSignupInvitation renders the admin signup invitation email
func RenderAdminSignupInvitation(userEmail, authLink string) (subject, body string, err error) {
	data := map[string]string{
		"UserEmail":   userEmail,
		"AuthLink":    authLink,
		"ServiceName": "go-send",
	}

	subject, err = renderTemplate("adminSignupInvitationSubject", adminSignupInvitationSubject, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render subject: %w", err)
	}

	body, err = renderTemplate("adminSignupInvitationBody", adminSignupInvitationBody, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render body: %w", err)
	}

	return subject, body, nil
}

// RenderUploadNotification renders the upload notification email
func RenderUploadNotification(uploaderName, uploaderEmail, userName string) (subject, body string, err error) {
	data := map[string]string{
		"UploaderName":  uploaderName,
		"UploaderEmail": uploaderEmail,
		"UserName":      userName,
		"ServiceName":   "go-send",
	}

	subject, err = renderTemplate("uploadNotificationSubject", uploadNotificationSubject, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render subject: %w", err)
	}

	body, err = renderTemplate("uploadNotificationBody", uploadNotificationBody, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render body: %w", err)
	}

	return subject, body, nil
}

// RenderPasswordChange renders the password change confirmation email
func RenderPasswordChange(userName, userEmail, authLink string) (subject, body string, err error) {
	data := map[string]string{
		"UserName":    userName,
		"UserEmail":   userEmail,
		"AuthLink":    authLink,
		"ServiceName": "go-send",
	}

	subject, err = renderTemplate("passwordChangeSubject", passwordChangeSubject, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render subject: %w", err)
	}

	body, err = renderTemplate("passwordChangeBody", passwordChangeBody, data)
	if err != nil {
		return "", "", fmt.Errorf("failed to render body: %w", err)
	}

	return subject, body, nil
}

// renderTemplate is a helper function to render a template string with data
func renderTemplate(name, templateStr string, data map[string]string) (string, error) {
	tmpl, err := template.New(name).Parse(templateStr)
	if err != nil {
		return "", fmt.Errorf("failed to parse template: %w", err)
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", fmt.Errorf("failed to execute template: %w", err)
	}

	return buf.String(), nil
}
