import { supabase } from '@/lib/supabase';

export const getTranslations = async (lang = 'vi') => {
  const { data, error } = await supabase
    .from('i18n_content')
    .select('key, content')
    .eq('lang', lang);

  if (error) {
    console.error('Error fetching translations:', error);
    return {};
  }

  const translations = {};
  data.forEach(item => {
    translations[item.key] = item.content;
  });

  return translations;
};

export const initializeTranslations = async (defaultLang = 'vi') => {
  // Pre-load common translations
  return await getTranslations(defaultLang);
};