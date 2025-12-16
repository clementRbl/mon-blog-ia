declare module 'leo-profanity' {
  interface LeoProfanity {
    check(text: string): boolean
    clean(text: string, replaceKey?: string): string
    add(words: string | string[]): void
    remove(words: string | string[]): void
    reset(): void
    clearList(): void
    getDictionary(lang?: string): string[]
    loadDictionary(lang: string): void
  }
  
  const filter: LeoProfanity
  export default filter
}
