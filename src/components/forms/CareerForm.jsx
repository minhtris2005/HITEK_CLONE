import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useForm } from '@/hooks/useForm';
import { validateForm } from '@/utils/validation';
import { useTranslation } from '@/hooks/useTranslation';

export default function CareerForm() {
  const { t } = useTranslation();
  const { formData, handleChange, loading, setLoading, errors, setErrors, resetForm } = useForm({
    name: '',
    email: '',
    phone: '',
    position: '',
    cv: null
  });

  const [submitStatus, setSubmitStatus] = useState('');

  const uploadCV = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('cvs')
      .upload(fileName, file);

    if (error) throw error;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cvs/${data.path}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm(formData, 'career');
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setSubmitStatus('');

    try {
      let cvUrl = null;
      if (formData.cv) {
        cvUrl = await uploadCV(formData.cv);
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{ 
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: 'career',
          cv_url: cvUrl,
          job_position: formData.position,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      setSubmitStatus('success');
      resetForm();

    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder={t('form_name', 'Họ tên *')}
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder={t('form_email', 'Email *')}
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            placeholder={t('form_phone', 'Số điện thoại *')}
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <input
            type="text"
            name="position"
            placeholder={t('form_position', 'Vị trí ứng tuyển *')}
            value={formData.position}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('form_cv_hint', 'Chấp nhận: PDF, DOC, DOCX, JPG, PNG (tối đa 5MB)')}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? t('form_uploading', 'Đang tải lên...') : t('form_apply', 'Nộp hồ sơ')}
        </button>

        {submitStatus === 'success' && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg">
            {t('career_success', 'Nộp hồ sơ thành công! Cảm ơn bạn đã quan tâm.')}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {t('career_error', 'Có lỗi xảy ra! Vui lòng thử lại.')}
          </div>
        )}
      </form>
    </div>
  );
}