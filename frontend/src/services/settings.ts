import api from './api';
import { AppSettings } from '@/types';

export const settingsService = {
  get: async (): Promise<AppSettings> => {
    const { data } = await api.get<AppSettings>('/configuracion');
    return data;
  },

  update: async (settings: Partial<AppSettings>): Promise<AppSettings> => {
    const { data } = await api.put<AppSettings>('/configuracion', settings);
    return data;
  },
};
