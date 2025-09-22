/**
 * Enhanced Authentication JavaScript
 * Handles modern login/logout functionality
 */

class AuthManager {
    constructor() {
        this.csrfToken = this.getCSRFToken();
        this.init();
    }

    init() {
        // Bind logout events
        this.bindLogoutEvents();
        // Check session status periodically
        this.startSessionMonitoring();
    }

    getCSRFToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : null;
    }

    bindLogoutEvents() {
        // Enhanced logout for all logout links
        document.querySelectorAll('a[href*="logout"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.performLogout(link.href);
            });
        });
    }

    async performLogout(logoutUrl = '/users/logout/') {
        try {
            // Show loading state
            this.showLogoutLoading();

            // Perform logout request
            const response = await fetch(logoutUrl, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                // Clear local storage and session storage
                this.clearLocalData();
                
                // Force page reload to update UI
                window.location.href = logoutUrl;
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback: redirect to logout URL anyway
            window.location.href = logoutUrl;
        }
    }

    async performAjaxLogout() {
        try {
            const response = await fetch('/users/api/logout/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (data.success) {
                this.clearLocalData();
                this.showLogoutSuccess(data.message);
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                throw new Error(data.error || 'Logout failed');
            }
        } catch (error) {
            console.error('AJAX Logout error:', error);
            // Fallback to regular logout
            this.performLogout();
        }
    }

    clearLocalData() {
        // Clear any cached user data
        localStorage.removeItem('user_session');
        localStorage.removeItem('user_data');
        sessionStorage.clear();
        
        // Clear any auth-related cookies (client-side)
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
    }

    showLogoutLoading() {
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.id = 'logout-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg p-6 text-center">
                <i class="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
                <p class="text-lg font-medium">Logging out...</p>
                <p class="text-sm text-gray-500">Please wait while we securely log you out</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    showLogoutSuccess(message) {
        const overlay = document.getElementById('logout-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 text-center">
                    <i class="fas fa-check-circle text-3xl text-green-600 mb-4"></i>
                    <p class="text-lg font-medium">Logged Out Successfully</p>
                    <p class="text-sm text-gray-500">${message}</p>
                    <p class="text-xs text-gray-400 mt-2">Redirecting to homepage...</p>
                </div>
            `;
        }
    }

    async checkSessionStatus() {
        try {
            const response = await fetch('/users/api/session-status/', {
                method: 'GET',
                headers: {
                    'X-CSRFToken': this.csrfToken,
                },
                credentials: 'same-origin'
            });

            if (response.status === 401 || response.status === 403) {
                // Session expired, redirect to login
                window.location.href = '/users/login/';
            }
        } catch (error) {
            // Network error, don't redirect
            console.warn('Session check failed:', error);
        }
    }

    startSessionMonitoring() {
        // Check session every 5 minutes
        setInterval(() => {
            if (document.querySelector('.authenticated-user')) {
                this.checkSessionStatus();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    // Enhanced login function
    async performAjaxLogin(username, password, rememberMe = false) {
        try {
            const response = await fetch('/users/api/login/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    username,
                    password,
                    remember_me: rememberMe
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store user data if needed
                if (rememberMe) {
                    localStorage.setItem('user_data', JSON.stringify(data.user));
                }

                // Redirect to appropriate page
                window.location.href = data.redirect_url || '/';
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('AJAX Login error:', error);
            throw error;
        }
    }
}

// Initialize AuthManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Utility functions
function logout() {
    if (window.authManager) {
        window.authManager.performLogout();
    } else {
        window.location.href = '/users/logout/';
    }
}

function ajaxLogout() {
    if (window.authManager) {
        window.authManager.performAjaxLogout();
    } else {
        logout();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, logout, ajaxLogout };
}