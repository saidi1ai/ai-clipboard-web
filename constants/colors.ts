export const colors = {
  primary: "#6366f1", // Indigo
  primaryLight: "#818cf8",
  primaryDark: "#4f46e5",
  secondary: "#f97316", // Orange
  secondaryLight: "#fb923c",
  secondaryDark: "#ea580c",
  background: "#f8fafc",
  backgroundDark: "#1e293b",
  card: "#ffffff",
  cardDark: "#334155",
  text: "#1e293b",
  textDark: "#f8fafc",
  textSecondary: "#64748b",
  textSecondaryDark: "#94a3b8",
  border: "#e2e8f0",
  borderDark: "#475569",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

export const getThemeColors = (isDark: boolean) => {
  return {
    background: isDark ? colors.backgroundDark : colors.background,
    card: isDark ? colors.cardDark : colors.card,
    text: isDark ? colors.textDark : colors.text,
    textSecondary: isDark ? colors.textSecondaryDark : colors.textSecondary,
    border: isDark ? colors.borderDark : colors.border,
  };
};

export default colors;