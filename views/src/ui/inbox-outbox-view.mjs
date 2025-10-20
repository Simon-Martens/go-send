import { fetchInbox, fetchOutbox } from "../api.mjs";
import { bytes, translateElement } from "../utils.mjs";
import storage from "../storage.mjs";

class InboxOutboxView extends HTMLElement {
	constructor() {
		super();
		this._currentView = "outbox"; // 'inbox' or 'outbox'
		this._files = [];
		this._translate = null;
	}

	connectedCallback() {
		this.render();
	}

	render() {
		// Mount navigation template
		const navTemplate = document.getElementById("inbox-outbox-nav");
		if (!navTemplate) {
			console.error("Template #inbox-outbox-nav not found");
			return;
		}

		this.innerHTML = "";
		const navFragment = navTemplate.content.cloneNode(true);
		this.appendChild(navFragment);

		// Create container for files
		const filesContainer = document.createElement("ul");
		filesContainer.className = "grid grid-cols-1 gap-4";
		filesContainer.setAttribute("data-role", "files-list");
		this.appendChild(filesContainer);

		// Create empty state container
		const emptyContainer = document.createElement("div");
		emptyContainer.className = "text-center py-8 text-grey-60 dark:text-grey-40 hidden";
		emptyContainer.setAttribute("data-role", "empty-state");
		this.appendChild(emptyContainer);

		// Attach event listeners to tabs
		this._attachTabListeners();

		// Translate
		translateElement(this);

		// Set initial active tab
		this._setActiveTab(this._currentView);

		// Load initial data
		this._loadFiles();
	}

	setState({ translate = null } = {}) {
		this._translate = translate;
	}

	refresh() {
		this._loadFiles();
	}

	_attachTabListeners() {
		const inboxTab = this.querySelector('[data-tab="inbox"]');
		const outboxTab = this.querySelector('[data-tab="outbox"]');

		if (inboxTab) {
			inboxTab.addEventListener("click", () => {
				this._currentView = "inbox";
				this._setActiveTab("inbox");
				this._loadFiles();
			});
		}

		if (outboxTab) {
			outboxTab.addEventListener("click", () => {
				this._currentView = "outbox";
				this._setActiveTab("outbox");
				this._loadFiles();
			});
		}
	}

	_setActiveTab(tab) {
		const inboxTab = this.querySelector('[data-tab="inbox"]');
		const outboxTab = this.querySelector('[data-tab="outbox"]');

		if (inboxTab) {
			if (tab === "inbox") {
				inboxTab.classList.add("bg-primary", "text-white");
				inboxTab.classList.remove("text-grey-70", "hover:bg-grey-10", "dark:text-grey-30", "dark:hover:bg-grey-80");
			} else {
				inboxTab.classList.remove("bg-primary", "text-white");
				inboxTab.classList.add("text-grey-70", "hover:bg-grey-10", "dark:text-grey-30", "dark:hover:bg-grey-80");
			}
		}

		if (outboxTab) {
			if (tab === "outbox") {
				outboxTab.classList.add("bg-primary", "text-white");
				outboxTab.classList.remove("text-grey-70", "hover:bg-grey-10", "dark:text-grey-30", "dark:hover:bg-grey-80");
			} else {
				outboxTab.classList.remove("bg-primary", "text-white");
				outboxTab.classList.add("text-grey-70", "hover:bg-grey-10", "dark:text-grey-30", "dark:hover:bg-grey-80");
			}
		}
	}

	async _loadFiles() {
		const filesContainer = this.querySelector('[data-role="files-list"]');
		const emptyContainer = this.querySelector('[data-role="empty-state"]');

		if (!filesContainer) return;

		// Show loading state
		this.hidden = false;
		filesContainer.innerHTML = '<li class="text-center py-8 text-grey-60 dark:text-grey-40">Loading...</li>';

		try {
			const files = this._currentView === "inbox"
				? await fetchInbox()
				: await fetchOutbox();

			this._files = this._prepareFiles(files, this._currentView);
			this._renderFiles();
		} catch (err) {
			console.error(`Failed to load ${this._currentView}:`, err);
			if (err && (err.message === "401" || err.message === "403")) {
				this._files = [];
				this.hidden = true;
				filesContainer.innerHTML = "";
				if (emptyContainer) {
					emptyContainer.classList.add("hidden");
					emptyContainer.textContent = "";
				}
				return;
			}

			filesContainer.innerHTML = `<li class="text-center py-8 text-red-600 dark:text-red-400">Failed to load ${this._currentView}</li>`;
		}
	}

	_renderFiles() {
		const filesContainer = this.querySelector('[data-role="files-list"]');
		const emptyContainer = this.querySelector('[data-role="empty-state"]');

		if (!filesContainer || !emptyContainer) return;

		filesContainer.innerHTML = "";

		if (this._files.length === 0) {
			filesContainer.classList.add("hidden");
			emptyContainer.classList.remove("hidden");
			emptyContainer.textContent = this._translateText(
				this._currentView === "inbox" ? "noInboxFiles" : "noOutboxFiles",
				this._currentView === "inbox" ? "No files in your inbox" : "No files in your outbox"
			);
			return;
		}

		filesContainer.classList.remove("hidden");
		emptyContainer.classList.add("hidden");

		const tileTemplate = document.getElementById("upload-tile-item");
		if (!tileTemplate) {
			console.error("Template #upload-tile-item not found");
			return;
		}

		this._files.forEach((file) => {
			const fragment = tileTemplate.content.cloneNode(true);
			const tile = fragment.querySelector("li");

			// Set file ID
			tile.dataset.uploadId = file.id;

			const ownedFile = typeof storage.getFileById === "function"
				? storage.getFileById(file.id)
				: null;

			// Set file name (prefer locally cached metadata when available)
			const nameEl = tile.querySelector('[data-role="file-name"]');
			if (nameEl) {
				if (ownedFile && ownedFile.name) {
					nameEl.textContent = ownedFile.name;
				} else {
					nameEl.textContent = `File ${file.id.substring(0, 8)}...`;
				}
			}

			// Set file size (fallback to blank if we cannot resolve)
			const sizeEl = tile.querySelector('[data-role="file-size"]');
			if (sizeEl) {
				if (ownedFile && typeof ownedFile.size === "number") {
					sizeEl.textContent = bytes(ownedFile.size);
				} else {
					sizeEl.textContent = "";
				}
			}

			// Set user info (sender/recipient)
			const userInfoEl = tile.querySelector('[data-role="user-info"]');
			const userLabelEl = tile.querySelector('[data-role="user-label"]');
			const userNameEl = tile.querySelector('[data-role="user-name"]');

			if (userInfoEl && userLabelEl && userNameEl) {
				if (this._currentView === "inbox" && file.owner_name) {
					// Inbox: show sender
					userLabelEl.textContent = this._translateText("sharedBy", "Shared by");
					userNameEl.textContent = file.owner_name;
					userInfoEl.classList.remove("hidden");
				} else if (this._currentView === "outbox" && file.recipient_name) {
					// Outbox: show recipient
					userLabelEl.textContent = this._translateText("sentTo", "Sent to");
					userNameEl.textContent = file.recipient_name;
					userInfoEl.classList.remove("hidden");
				}
			}

			// Set upload date
			const dateEl = tile.querySelector('[data-role="upload-date"]');
			if (dateEl) {
				const date = new Date(file.created_at * 1000);
				dateEl.textContent = date.toLocaleDateString();
			}

			// Set expiry info
			const expiryEl = tile.querySelector('[data-role="expiry-info"]');
			if (expiryEl) {
				const now = Math.floor(Date.now() / 1000);
				const timeLeft = file.expires_at - now;
				if (timeLeft > 0) {
					const hours = Math.floor(timeLeft / 3600);
					const days = Math.floor(hours / 24);
					if (days > 0) {
						expiryEl.textContent = this._translateText("expiresInDays", `Expires in ${days} days`, { days });
					} else if (hours > 0) {
						expiryEl.textContent = this._translateText("expiresInHours", `Expires in ${hours} hours`, { hours });
					} else {
						expiryEl.textContent = this._translateText("expiresInMinutes", `Expires soon`, {});
					}
				} else {
					expiryEl.textContent = this._translateText("expired", "Expired");
				}
			}

			// Set download link
			const downloadLinkEl = tile.querySelector('[data-role="download-link"]');
			if (downloadLinkEl) {
				if (ownedFile && ownedFile.url) {
					downloadLinkEl.href = ownedFile.url;
				} else {
					downloadLinkEl.href = `/download/${file.id}`;
				}
			}

			// Set copy link button
			const copyBtn = tile.querySelector('[data-action="copy"]');
			if (copyBtn) {
				copyBtn.addEventListener("click", () => {
					const url = ownedFile && ownedFile.url
						? ownedFile.url
						: `${window.location.origin}/download/${file.id}`;
					navigator.clipboard.writeText(url).then(() => {
						const copyIcon = copyBtn.querySelector('[data-role="copy-icon"]');
						if (copyIcon) {
							copyIcon.className = "ri-check-line h-4 w-4 mr-2 text-base leading-4";
							setTimeout(() => {
								copyIcon.className = "ri-file-copy-line h-4 w-4 mr-2 text-base leading-4";
							}, 2000);
						}
					}).catch(err => {
						console.error("Failed to copy:", err);
					});
				});
			}

			// Set delete button (only for outbox/owner files)
			const deleteBtn = tile.querySelector('[data-action="delete"]');
			if (deleteBtn) {
				if (this._currentView === "outbox" && file.owner_token) {
					deleteBtn.addEventListener("click", async () => {
						if (confirm(this._translateText("deleteConfirm", "Are you sure you want to delete this file?"))) {
							try {
								const { del } = await import("../api.mjs");
								const success = await del(file.id, file.owner_token);
								if (success) {
									tile.remove();
									this._files = this._files.filter(f => f.id !== file.id);
									if (this._files.length === 0) {
										this._renderFiles();
									}
								} else {
									alert(this._translateText("deleteFailed", "Failed to delete file"));
								}
							} catch (err) {
								console.error("Delete failed:", err);
								alert(this._translateText("deleteFailed", "Failed to delete file"));
							}
						}
					});
				} else {
					// Hide delete button for inbox files
					deleteBtn.style.display = "none";
				}
			}

			filesContainer.appendChild(fragment);
		});
	}

	_prepareFiles(files, view) {
		if (!Array.isArray(files)) {
			return [];
		}

		const unique = new Map();
		files.forEach((file) => {
			if (!file || !file.id) {
				return;
			}
			if (view === "outbox" && !file.owner_token) {
				return;
			}
			if (view === "inbox" && file.owner_token) {
				return;
			}
			const existing = unique.get(file.id);
			if (!existing || (file.created_at || 0) > (existing.created_at || 0)) {
				unique.set(file.id, file);
			}
		});

		return Array.from(unique.values()).sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
	}

	_translateText(key, fallback, params) {
		try {
			if (typeof this._translate === "function") {
				const result = this._translate(key, params);
				if (result) return result;
			} else if (typeof window.translate === "function") {
				const result = window.translate(key, params);
				if (result) return result;
			}
		} catch (err) {
			// ignore missing translation
		}
		return fallback;
	}
}

customElements.define("inbox-outbox-view", InboxOutboxView);
