/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID: string
  readonly VITE_GEMINI_API_KEY?: string
  readonly VITE_MISTRAL_API_KEY?: string
  readonly MISTRAL_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
