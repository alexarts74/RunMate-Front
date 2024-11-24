import React from "react";
import { SelectList } from "react-native-dropdown-select-list";

const objectiveOptions = [
  {
    key: "premier_marathon",
    value: "premier_marathon",
    label: "Premier marathon",
  },
  {
    key: "premier_semi_marathon",
    value: "premier_semi_marathon",
    label: "Premier semi-marathon",
  },
  {
    key: "10km_sous_50min",
    value: "10km_sous_50min",
    label: "10km sous 50min",
  },
  {
    key: "5km_sous_25min",
    value: "5km_sous_25min",
    label: "5km sous 25min",
  },
  {
    key: "ameliorer_endurance",
    value: "ameliorer_endurance",
    label: "Améliorer son endurance",
  },
  {
    key: "perdre_du_poids",
    value: "perdre_du_poids",
    label: "Perdre du poids",
  },
  {
    key: "preparation_trail",
    value: "preparation_trail",
    label: "Préparation trail",
  },
  {
    key: "course_reguliere",
    value: "course_reguliere",
    label: "Course régulière",
  },
];

type Props = {
  handleChange: (field: string, value: string) => void;
};

export function ObjectiveSelect({ handleChange }: Props) {
  const formattedData = objectiveOptions.map((option) => ({
    key: option.value, // Utilise value comme key pour le backend
    value: option.label, // Affiche le label pour l'utilisateur
  }));

  return (
    <SelectList
      setSelected={(selectedValue: string) => {
        // Trouve l'option correspondante
        const selectedOption = objectiveOptions.find(
          (opt) => opt.label === selectedValue
        );
        // Envoie la value au backend
        handleChange("objective", selectedOption?.value || selectedValue);
      }}
      data={formattedData}
      save="key"
      placeholder="Votre objectif"
      boxStyles={{
        borderWidth: 1,
        borderColor: "#374151",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#111827",
      }}
      dropdownStyles={{
        borderWidth: 1,
        borderColor: "#374151",
        borderRadius: 8,
        backgroundColor: "#111827",
      }}
      inputStyles={{ color: "#fff" }}
      dropdownTextStyles={{ color: "#fff" }}
      search={false}
    />
  );
}
