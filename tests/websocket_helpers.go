package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gorilla/websocket"
)

// WebSocketTestConn provides a test WebSocket connection
type WebSocketTestConn struct {
	conn *websocket.Conn
	t    *testing.T
}

// NewWebSocketTestConn creates a test WebSocket connection to a handler
func NewWebSocketTestConn(t *testing.T, handler http.HandlerFunc) *WebSocketTestConn {
	// Create a test server with the handler
	server := httptest.NewServer(handler)

	// Convert http:// URL to ws://
	url := "ws" + strings.TrimPrefix(server.URL, "http")

	// Dial the WebSocket
	conn, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		t.Fatalf("Failed to create WebSocket connection: %v", err)
	}

	return &WebSocketTestConn{
		conn: conn,
		t:    t,
	}
}

// SendJSON sends a JSON message over the WebSocket
func (wc *WebSocketTestConn) SendJSON(v interface{}) error {
	data, err := json.Marshal(v)
	if err != nil {
		return err
	}
	return wc.conn.WriteMessage(websocket.TextMessage, data)
}

// SendBinary sends binary data over the WebSocket
func (wc *WebSocketTestConn) SendBinary(data []byte) error {
	return wc.conn.WriteMessage(websocket.BinaryMessage, data)
}

// RecvJSON receives a JSON message from the WebSocket
func (wc *WebSocketTestConn) RecvJSON(v interface{}) error {
	_, data, err := wc.conn.ReadMessage()
	if err != nil {
		return err
	}
	return json.Unmarshal(data, v)
}

// RecvBinary receives binary data from the WebSocket
func (wc *WebSocketTestConn) RecvBinary() ([]byte, error) {
	_, data, err := wc.conn.ReadMessage()
	if err != nil {
		return nil, err
	}
	return data, nil
}

// Close closes the WebSocket connection
func (wc *WebSocketTestConn) Close() error {
	return wc.conn.Close()
}
