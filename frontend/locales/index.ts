import { en } from './en'
import { zh } from './zh'

export const messages = {
  en,
  zh,
}

export type MessageSchema = typeof en
export type Locale = keyof typeof messages
export type MessageTree = (typeof messages)['en']

export const localeOptions: { label: string; value: Locale }[] = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh' },
]
