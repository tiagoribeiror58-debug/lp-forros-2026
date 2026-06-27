export interface AppConfig {
  whatsappNumber: string;
  whatsappGreeting: string;
}

export interface AppState {
  currentFilter: string;
}

export const CONFIG: AppConfig = {
  whatsappNumber: '5511999999999',
  whatsappGreeting: 'Olá, MF Prime Acabamentos! Vim pelo site e gostaria de um orçamento.'
};

export const appState: AppState = {
  currentFilter: 'all'
};
