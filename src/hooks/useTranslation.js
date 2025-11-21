import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useTranslation(lang = 'vi') {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      const { data, error } = await supabase
        .from('i18n_content')
        .select('key, content')
        .eq('lang', lang);

      if (!error && data) {
        const translationObj = {};
        data.forEach(item => {
          translationObj[item.key] = item.content;
        });
        setTranslations(translationObj);
      }
      setLoading(false);
    };

    fetchTranslations();
  }, [lang]);

  const t = (key, defaults = '') => {
    return translations[key]?.text || defaults;
  };

  return { t, loading, translations };
}