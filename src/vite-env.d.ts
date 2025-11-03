/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVESTOCK_API_URL?: string;
  readonly VITE_LIVESTOCK_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// XML 파싱을 위한 유틸리티 함수
declare global {
  interface Window {
    DOMParser: any;
  }
}

