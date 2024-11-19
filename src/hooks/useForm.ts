import { useState, ChangeEvent, FormEvent } from 'react';

interface ValidationRules {
  [key: string]: (value: any) => string | undefined;
}

export function useForm<T extends { [key: string]: any }>(
  initialValues: T,
  validationRules?: ValidationRules,
  onSubmit?: (values: T) => void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    if (validationRules && validationRules[name]) {
      const error = validationRules[name](value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validationRules) {
      const newErrors: { [key: string]: string } = {};
      let hasErrors = false;

      Object.keys(validationRules).forEach(key => {
        const error = validationRules[key](values[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      });

      setErrors(newErrors);
      if (hasErrors) return;
    }

    onSubmit?.(values);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setErrors,
  };
}