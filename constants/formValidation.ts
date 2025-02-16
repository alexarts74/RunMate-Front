export const FORM_VALIDATION_RULES = {
  signup: {
    email: {
      rules: {
        required: true,
        email: true,
      },
      errorMessages: {
        required: "L'email est requis",
        email: "Format d'email invalide",
      },
    },
    password: {
      rules: {
        required: true,
        password: true,
      },
      errorMessages: {
        required: "Le mot de passe est requis",
        password:
          "Le mot de passe doit contenir au moins 6 caractères, une lettre et un chiffre",
      },
    },
    first_name: {
      rules: {
        required: true,
        minLength: 2,
      },
      errorMessages: {
        required: "Le prénom est requis",
        minLength: "Le prénom doit contenir au moins 2 caractères",
      },
    },
    last_name: {
      rules: {
        required: true,
        minLength: 2,
      },
      errorMessages: {
        required: "Le nom est requis",
        minLength: "Le nom doit contenir au moins 2 caractères",
      },
    },
    age: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "L'âge est requis",
      },
    },
    gender: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "Le genre est requis",
      },
    },
    profile_image: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "La photo de profil est requise",
      },
    },
    actual_pace: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "L'allure est requise",
      },
    },
    usual_distance: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "La distance habituelle est requise",
      },
    },
    objective: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "L'objectif est requis",
      },
    },
    availability: {
      rules: {
        required: true,
        minLength: 1,
      },
      errorMessages: {
        required: "Les disponibilités sont requises",
        minLength: "Sélectionnez au moins une disponibilité",
      },
    },
  },
  login: {
    email: {
      rules: {
        required: true,
        email: true,
      },
      errorMessages: {
        required: "L'email est requis",
        email: "Format d'email invalide",
      },
    },
    password: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "Le mot de passe est requis",
      },
    },
  },
};

// Utilisation dans SignUpForm
const validateSignUpForm = (formData: any) => {
  return {
    email: {
      value: formData.email,
      rules: FORM_VALIDATION_RULES.signup.email.rules,
    },
    password: {
      value: formData.password,
      rules: FORM_VALIDATION_RULES.signup.password.rules,
    },
    first_name: {
      value: formData.first_name,
      rules: FORM_VALIDATION_RULES.signup.first_name.rules,
    },
    last_name: {
      value: formData.last_name,
      rules: FORM_VALIDATION_RULES.signup.last_name.rules,
    },
    age: {
      value: formData.age,
      rules: FORM_VALIDATION_RULES.signup.age.rules,
    },
    gender: {
      value: formData.gender,
      rules: FORM_VALIDATION_RULES.signup.gender.rules,
    },
    profile_image: {
      value: formData.profile_image,
      rules: FORM_VALIDATION_RULES.signup.profile_image.rules,
    },
  };
};

// Utilisation dans LoginForm
const validateLoginForm = (formData: any) => {
  return {
    email: {
      value: formData.email,
      rules: FORM_VALIDATION_RULES.login.email.rules,
    },
    password: {
      value: formData.password,
      rules: FORM_VALIDATION_RULES.login.password.rules,
    },
  };
};

export const validateSignUpFormStep1 = (formData: any) => ({
  email: {
    value: formData.email,
    rules: FORM_VALIDATION_RULES.signup.email.rules,
  },
  password: {
    value: formData.password,
    rules: FORM_VALIDATION_RULES.signup.password.rules,
  },
  password_confirmation: {
    value: formData.password_confirmation,
    rules: {
      required: true,
      custom: (value: string) => value === formData.password,
    },
  },
});

export const validateSignUpFormStep2 = (formData: any) => ({
  first_name: {
    value: formData.first_name,
    rules: FORM_VALIDATION_RULES.signup.first_name.rules,
  },
  last_name: {
    value: formData.last_name,
    rules: FORM_VALIDATION_RULES.signup.last_name.rules,
  },
  age: {
    value: formData.age,
    rules: FORM_VALIDATION_RULES.signup.age.rules,
  },
  gender: {
    value: formData.gender,
    rules: FORM_VALIDATION_RULES.signup.gender.rules,
  },
  profile_image: {
    value: formData.profile_image,
    rules: FORM_VALIDATION_RULES.signup.profile_image.rules,
  },
});

export const validateSignUpFormStep3 = (formData: any) => ({
  actual_pace: {
    value: formData.actual_pace,
    rules: FORM_VALIDATION_RULES.signup.actual_pace.rules,
  },
  usual_distance: {
    value: formData.usual_distance,
    rules: FORM_VALIDATION_RULES.signup.usual_distance.rules,
  },
  objective: {
    value: formData.objective,
    rules: FORM_VALIDATION_RULES.signup.objective.rules,
  },
  availability: {
    value: formData.availability,
    rules: FORM_VALIDATION_RULES.signup.availability.rules,
  },
});

export { validateSignUpForm, validateLoginForm };
