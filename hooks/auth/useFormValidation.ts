import { useState } from "react";

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  password?: boolean;
  custom?: (value: string) => boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (
    name: string,
    value: string,
    rules: ValidationRules
  ): boolean => {
    let isValid = true;
    let errorMessage = "";

    if (rules.required && !value) {
      isValid = false;
      errorMessage = "Ce champ est requis";
    } else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false;
      errorMessage = "Email invalide";
    } else if (
      rules.password &&
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
    ) {
      isValid = false;
      errorMessage =
        "Le mot de passe doit contenir au moins 6 caractères, une lettre et un chiffre";
    } else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = `Minimum ${rules.minLength} caractères requis`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      isValid = false;
      errorMessage = `Maximum ${rules.maxLength} caractères autorisés`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = "Format invalide";
    } else if (rules.custom && !rules.custom(value)) {
      isValid = false;
      errorMessage = "Valeur invalide";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    return isValid;
  };

  const validateForm = (fields: {
    [key: string]: { value: string; rules: ValidationRules };
  }): boolean => {
    let isFormValid = true;
    const newErrors: ValidationErrors = {};

    Object.entries(fields).forEach(([name, { value, rules }]) => {
      if (!validateField(name, value, rules)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    setErrors,
  };
};
