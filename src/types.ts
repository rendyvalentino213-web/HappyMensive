export interface BoxMessage {
  id: string;
  title: string;
  content: string;
}

export interface AppConfig {
  title: string;
  heroMessage: string;
  secretMessage: string;
  musicUrl: string;
  gallery: string[];
  boxMessages: BoxMessage[];
}
