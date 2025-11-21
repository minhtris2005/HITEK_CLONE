export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9+\-\s()]{10,}$/;
  return re.test(phone);
};

export const validateForm = (formData, type = 'contact') => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Họ tên là bắt buộc';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (type === 'contact' && !formData.message?.trim()) {
    errors.message = 'Nội dung là bắt buộc';
  }

  if (type === 'career' && !formData.position?.trim()) {
    errors.position = 'Vị trí là bắt buộc';
  }

  return errors;
};