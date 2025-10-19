package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Simon-Martens/go-send/core"
)

func NewConfigHandler(app *core.App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(app.Config.GetClientConfig())
	}
}
