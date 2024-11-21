import { RunnerProfile } from "@/interface/RunnerProfile";
import { apiClient } from "./client";

export const runnerProfileService = {
  async save(data: RunnerProfile) {
    return await apiClient.post("/runner_profile", { runner_profile: data });
  },
};
