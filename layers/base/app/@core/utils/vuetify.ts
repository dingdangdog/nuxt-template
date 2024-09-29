import type { LiteralUnion } from 'type-fest'
import { cookieRef } from '@base/@layouts/stores/config'

export function resolveVuetifyTheme(defaultTheme: LiteralUnion<'light' | 'dark' | 'system', string>): 'light' | 'dark' {
  const cookieColorScheme = cookieRef<'light' | 'dark'>('color-scheme', 'light')
  const storedTheme = cookieRef('theme', defaultTheme).value

  return storedTheme === 'system'
    ? cookieColorScheme.value === 'dark'
      ? 'dark'
      : 'light'
    : storedTheme as 'light' | 'dark'
}
