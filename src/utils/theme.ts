/** 暗色主题切换（Element Plus 通过 html.dark 类启用暗色变量） */

const THEME_KEY = 'youngjs_theme'

export function applyTheme(isDark: boolean): void {
  const el = document.documentElement
  if (isDark) el.classList.add('dark')
  else el.classList.remove('dark')
}

export function getTheme(): boolean {
  return localStorage.getItem(THEME_KEY) === 'dark'
}

export function saveTheme(isDark: boolean): void {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
}
