import { getNetwork } from "@/lib/network";

export async function process() {
  try {
    return getNetwork();
  } catch (error) {
    return { error: error.message };
  }
}
