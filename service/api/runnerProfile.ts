import { RunnerProfile } from "@/interface/User";
import { apiClient } from "./client";

export const runnerProfileService = {
  async save(data: RunnerProfile) {
    // console.log("data", data);
    return await apiClient.post("/runner_profiles", { runner_profile: data });
  },
};
