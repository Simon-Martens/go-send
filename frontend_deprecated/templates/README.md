# Go Templates

This directory contains Go HTML templates for rendering pages.

## Template Files

- **`index.gohtml`** - Main page template (used for both index and download pages)
- **`footer.gohtml`** - Footer component template

## Template Naming

Templates are identified by their filename only (not full path):
- Use `index.gohtml` when executing (not `frontend/templates/index.gohtml`)
- Named blocks (like `footer`) are referenced by their `{{define "name"}}`
- Example: `tmpl.ExecuteTemplate(w, "index.gohtml", data)`

## Available Data

Templates receive the following data:

### Asset References
- `.CSS` - CSS filename from manifest
- `.JS` - JS filename from manifest
- `.AppleTouchIcon` - Apple touch icon path
- `.Favicon16` - 16x16 favicon path
- `.Favicon32` - 32x32 favicon path
- `.SafariPinnedTab` - Safari pinned tab SVG

### Configuration
- `.ColorPrimary` - Primary UI color (hex)
- `.ColorAccent` - Accent UI color (hex)
- `.Locale` - Detected locale code
- `.Nonce` - CSP nonce for inline scripts/styles

### Footer Data
- `.Footer.CustomText` - Custom footer text
- `.Footer.CustomURL` - Custom footer link URL
- `.Footer.CLIURL` - CLI tool link
- `.Footer.DMCAURL` - DMCA notice link
- `.Footer.SourceURL` - Source code link

### JavaScript Config (as JSON)
- `.LimitsJSON` - File size and download limits
- `.WebUIJSON` - UI configuration (colors, custom assets)
- `.DefaultsJSON` - Default values for uploads
- `.DownloadMetadataJSON` - Download page metadata (nonce, password flag)

## Template Syntax Examples

### Conditionals
```go
{{if .Footer.CustomText}}
  <p>{{.Footer.CustomText}}</p>
{{else}}
  <p>Default text</p>
{{end}}
```

### Nested Conditionals
```go
{{if .Footer.CustomURL}}
  <a href="{{.Footer.CustomURL}}">{{.Footer.CustomText}}</a>
{{else}}
  {{.Footer.CustomText}}
{{end}}
```

### Including Sub-Templates
```go
{{template "footer" .Footer}}
```

### Loops
```go
{{range .Items}}
  <li>{{.Name}}</li>
{{end}}
```

### Safe HTML Output
All variables are auto-escaped. For pre-rendered HTML:
```go
{{.SafeHTML}}  {{/* Must be template.HTML type */}}
```

## User Overrides

Users can override templates by placing files in `userfrontend/templates/`:
- Must use `.gohtml` extension
- Will override embedded templates with same name
- Automatically reloaded on template changes

Static build assets can be overridden or extended by placing files in `userfrontend/dist/`. Any files found there are served before the embedded `frontend/dist/` bundle, so matching filenames shadow the embedded versions while other assets continue to fall back.

## Best Practices

1. **Keep HTML in templates** - Don't construct HTML in Go code
2. **Use named blocks** - For reusable components (like footer)
3. **Pass clean data** - Send structured data, not pre-formatted HTML
4. **Use proper types** - `template.HTML`, `template.JS`, `template.HTMLAttr` for safe rendering
5. **Log errors** - Always check template execution errors
