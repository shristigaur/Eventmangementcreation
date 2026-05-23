// Admin credentials for frontend-only admin dashboard (development only)
export const ADMIN_EMAIL = "admin@eventify.local";
export const ADMIN_PASSWORD = "Secur3P@ssw0rd!";

export function getStoredSession() {
	try {
		const raw = localStorage.getItem("user");
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function getStoredUser() {
	const session = getStoredSession();
	return session?.user || session || null;
}

export function isAdminUser(user = getStoredUser()) {
	if (!user) {
		return false;
	}

	const email = String(user.email || "").trim().toLowerCase();
	return email === ADMIN_EMAIL && (user.isAdmin === true || user.role === "admin" || !user.role);
}

export function isAdminSession() {
	return isAdminUser();
}

export function createAdminSession() {
	return {
		user: {
			_id: "admin-dashboard",
			name: "Admin",
			email: ADMIN_EMAIL,
			role: "admin",
			isAdmin: true,
		},
	};
}