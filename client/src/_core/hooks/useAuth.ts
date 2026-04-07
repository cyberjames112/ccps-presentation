// Auth hook placeholder – authentication is not used in this deployment.
// Kept for compatibility in case any component imports this hook.
export function useAuth() {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  };
}
