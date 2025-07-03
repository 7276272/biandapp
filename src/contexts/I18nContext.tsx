'use client'

import type React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { 
  translations, 
  getBrowserLanguage, 
  type Language, 
  type TranslationContent 
} from '@/lib/i18n-simple'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationContent
  availableLanguages: Language[]
}

export const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh')

  // 初始化语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    } else {
      const browserLanguage = getBrowserLanguage()
      setLanguage(browserLanguage)
    }
  }, [])

  // 保存语言设置
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('app-language', lang)
  }

  // 获取当前语言的翻译内容
  const t = translations[language]

  // 可用语言列表
  const availableLanguages: Language[] = ['zh', 'en']

  const value: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
    availableLanguages
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
} 