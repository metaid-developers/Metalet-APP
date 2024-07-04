export interface UpdateData {
  code: number;
  data: Update;
}

export interface Update {
  app_name: string;
  platform: string;
  name: string;
  url: string;
  version: string;
  mandatory: string;
  version_code: number;
  mandatory_code: number;
  contents: Contents;
  apkUrl:string;
}

interface Contents {
  en: string;
  zh: string;
}