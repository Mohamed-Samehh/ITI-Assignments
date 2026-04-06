import { useEffect, useState } from 'react'
import { LanguageContext } from './languageContextValue'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  const value = {
    language,
    setLanguage,
    direction,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
