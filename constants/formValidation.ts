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
        required: "L'allure actuelle est requise",
      },
    },
    target_pace: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "L'allure cible est requise",
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
    weekly_mileage: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "Le kilométrage hebdomadaire est requis",
      },
    },
    running_frequency: {
      rules: {
        required: true,
        isArray: true,
        minLength: 1,
      },
      errorMessages: {
        required: "La fréquence de course est requise",
        minLength: "Sélectionnez au moins une fréquence",
      },
    },
    preferred_time_of_day: {
      rules: {
        required: true,
        isArray: true,
        minLength: 1,
      },
      errorMessages: {
        required: "Le moment préféré est requis",
        minLength: "Sélectionnez au moins un moment",
      },
    },
    training_days: {
      rules: {
        required: true,
        isArray: true,
        minLength: 1,
      },
      errorMessages: {
        required: "Les jours d'entraînement sont requis",
        minLength: "Sélectionnez au moins un jour",
      },
    },
    social_preferences: {
      rules: {
        required: true,
        isArray: true,
        minLength: 1,
      },
      errorMessages: {
        required: "Les préférences sociales sont requises",
        minLength: "Sélectionnez au moins une préférence",
      },
    },
    post_run_activities: {
      rules: {
        required: true,
        isArray: true,
        minLength: 1,
      },
      errorMessages: {
        required: "Les activités post-course sont requises",
        minLength: "Sélectionnez au moins une activité",
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
  createEvent: {
    name: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "Le nom de l'événement est requis",
      },
    },
    description: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "La description est requise",
      },
    },
    start_date: {
      rules: {
        required: true,
        futureDate: true,
      },
      errorMessages: {
        required: "La date est requise",
        futureDate: "La date doit être dans le futur",
      },
    },
    location: {
      rules: {
        required: true,
        validCoordinates: true,
      },
      errorMessages: {
        required: "Le lieu est requis",
        validCoordinates: "Veuillez sélectionner une adresse valide",
      },
    },
    distance: {
      rules: {
        required: true,
        positiveNumber: true,
      },
      errorMessages: {
        required: "La distance est requise",
        positiveNumber: "La distance doit être un nombre positif",
      },
    },
    max_participants: {
      rules: {
        required: true,
        positiveNumber: true,
      },
      errorMessages: {
        required: "Le nombre de participants est requis",
        positiveNumber: "Le nombre de participants doit être un nombre positif",
      },
    },
    cover_image: {
      rules: {
        required: true,
      },
      errorMessages: {
        required: "Une image de couverture est requise",
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

export const validateSignUpFormStep3 = (
  formData: any,
  runnerType: "perf" | "chill"
) => {
  const perfValidations = {
    actual_pace: {
      value: formData.actual_pace,
      rules: FORM_VALIDATION_RULES.signup.actual_pace.rules,
    },
    target_pace: {
      value: formData.target_pace,
      rules: FORM_VALIDATION_RULES.signup.target_pace.rules,
    },
    weekly_mileage: {
      value: formData.weekly_mileage,
      rules: FORM_VALIDATION_RULES.signup.weekly_mileage.rules,
    },
    training_days: {
      value: formData.training_days,
      rules: FORM_VALIDATION_RULES.signup.training_days.rules,
    },
  };

  const chillValidations = {
    running_frequency: {
      value: formData.running_frequency,
      rules: FORM_VALIDATION_RULES.signup.running_frequency.rules,
    },
    social_preferences: {
      value: formData.social_preferences,
      rules: FORM_VALIDATION_RULES.signup.social_preferences.rules,
    },
    post_run_activities: {
      value: formData.post_run_activities,
      rules: FORM_VALIDATION_RULES.signup.post_run_activities.rules,
    },
    preferred_time_of_day: {
      value: formData.preferred_time_of_day,
      rules: FORM_VALIDATION_RULES.signup.preferred_time_of_day.rules,
    },
    usual_distance: {
      value: formData.usual_distance,
      rules: FORM_VALIDATION_RULES.signup.usual_distance.rules,
    },
  };

  return runnerType === "perf" ? perfValidations : chillValidations;
};

export const resetErrorsAfterDelay = (
  setErrors: (errors: { [key: string]: string }) => void
) => {
  setTimeout(() => {
    setErrors({});
  }, 2000);
};

export const validateCreateEventForm = (
  formData: any,
  setErrors: (errors: { [key: string]: string }) => void
) => {
  const errors: { [key: string]: string } = {};

  // Nom
  if (!formData.name.trim()) {
    errors.name = FORM_VALIDATION_RULES.createEvent.name.errorMessages.required;
  }

  // Description
  if (!formData.description.trim()) {
    errors.description =
      FORM_VALIDATION_RULES.createEvent.description.errorMessages.required;
  }

  // Date
  if (formData.start_date < new Date()) {
    errors.start_date =
      FORM_VALIDATION_RULES.createEvent.start_date.errorMessages.futureDate;
  }

  // Lieu
  if (!formData.location.trim()) {
    errors.location =
      FORM_VALIDATION_RULES.createEvent.location.errorMessages.required;
  }
  if (!formData.latitude || !formData.longitude) {
    errors.location =
      FORM_VALIDATION_RULES.createEvent.location.errorMessages.validCoordinates;
  }

  // Distance
  if (!formData.distance.trim()) {
    errors.distance =
      FORM_VALIDATION_RULES.createEvent.distance.errorMessages.required;
  } else if (
    isNaN(parseFloat(formData.distance)) ||
    parseFloat(formData.distance) <= 0
  ) {
    errors.distance =
      FORM_VALIDATION_RULES.createEvent.distance.errorMessages.positiveNumber;
  }

  // Nombre de participants
  if (!formData.max_participants.trim()) {
    errors.max_participants =
      FORM_VALIDATION_RULES.createEvent.max_participants.errorMessages.required;
  } else if (
    isNaN(parseInt(formData.max_participants)) ||
    parseInt(formData.max_participants) <= 0
  ) {
    errors.max_participants =
      FORM_VALIDATION_RULES.createEvent.max_participants.errorMessages.positiveNumber;
  }

  // Image de couverture
  if (!formData.cover_image) {
    errors.cover_image =
      FORM_VALIDATION_RULES.createEvent.cover_image.errorMessages.required;
  }

  setErrors(errors);
  if (Object.keys(errors).length > 0) {
    resetErrorsAfterDelay(setErrors);
  }

  return errors;
};

export { validateSignUpForm, validateLoginForm };
