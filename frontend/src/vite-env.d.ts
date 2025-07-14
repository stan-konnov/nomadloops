/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_VER: string;
  readonly VITE_GEOCODE_API_URL: string;
  readonly VITE_DEFAULT_LAT: string;
  readonly VITE_DEFAULT_LNG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
