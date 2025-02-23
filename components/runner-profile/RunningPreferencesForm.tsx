import React from "react";
import { View } from "react-native";
import { PaceInputs } from "./PaceInputs";
import { DistanceInputs } from "./DistanceInputs";
import { FrequencySelect } from "./FrequencySelect";
import { TimeOfDaySelect } from "./TimeOfDaySelect";
import { TrainingDaysSelect } from "./TrainingDaysSelect";
import { CompetitionGoalsSelect } from "./CompetitionGoalsSelect";
import { SocialPreferencesSelect } from "./SocialPreferencesSelect";
import { PostRunActivitiesSelect } from "./PostRunActivitiesSelect";

interface RunningPreferencesFormProps {
  formData: {
    actual_pace: string;
    target_pace: string;
    usual_distance: string;
    weekly_mileage: string;
    running_frequency: string;
    preferred_time_of_day: string;
    training_days: string[];
    competition_goals: string;
    social_preferences: string[];
    post_run_activities: string[];
  };
  handleChange: (name: string, value: any) => void;
  runnerType: "chill" | "perf" | null;
  errors: any;
}

export function RunningPreferencesForm({
  formData,
  handleChange,
  runnerType,
  errors,
}: RunningPreferencesFormProps) {
  return (
    <View className="space-y-6">
      <PaceInputs
        actualPace={formData.actual_pace}
        targetPace={formData.target_pace}
        onChange={handleChange}
        showTarget={runnerType === "perf"}
      />

      <DistanceInputs
        usualDistance={formData.usual_distance}
        weeklyMileage={formData.weekly_mileage}
        onChange={handleChange}
        showWeekly={runnerType === "perf"}
      />

      <FrequencySelect
        value={formData.running_frequency}
        onChange={(value) => handleChange("running_frequency", value)}
      />

      <TimeOfDaySelect
        value={formData.preferred_time_of_day}
        onChange={(value) => handleChange("preferred_time_of_day", value)}
      />

      <TrainingDaysSelect
        value={formData.training_days}
        onChange={(value) => handleChange("training_days", value)}
      />

      {runnerType === "perf" && (
        <CompetitionGoalsSelect
          value={formData.competition_goals}
          onChange={(value) => handleChange("competition_goals", value)}
        />
      )}

      <SocialPreferencesSelect
        value={formData.social_preferences}
        onChange={(value) => handleChange("social_preferences", value)}
      />

      <PostRunActivitiesSelect
        value={formData.post_run_activities}
        onChange={(value) => handleChange("post_run_activities", value)}
      />
    </View>
  );
}
