// This controls an isolated browser demo only. It is NOT authentication or a security boundary.
export type DemoRole = "owner" | "staff";
export interface DemoSession {
  role: DemoRole;
  expiresAt: number;
}
const KEY = "tsj_demo_session_v3";
export const DemoAccess = {
  get(): DemoSession | null {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (
        !s ||
        !["owner", "staff"].includes(s.role) ||
        !Number.isFinite(s.expiresAt) ||
        s.expiresAt <= Date.now()
      ) {
        sessionStorage.removeItem(KEY);
        return null;
      }
      return s;
    } catch {
      return null;
    }
  },
  enter(role: DemoRole) {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ role, expiresAt: Date.now() + 60 * 60 * 1000 }),
    );
    window.dispatchEvent(new Event("tsj-demo-session"));
  },
  logout() {
    sessionStorage.removeItem(KEY);
    localStorage.removeItem("tsj_demo_v2_admin_auth");
    window.dispatchEvent(new Event("tsj-demo-session"));
  },
  requireOwner() {
    if (this.get()?.role !== "owner")
      throw new Error(
        "Owner demo access is required. Sign in again if the session expired.",
      );
  },
};
export function safeAdminDestination(raw: string | null) {
  return raw &&
    /^\/admin(?:\/(?:orders|inventory|custom-orders|customers|rates|reports|settings))?$/.test(
      raw,
    )
    ? raw
    : "/admin";
}
