import { useCallback } from "react";

export function usePaymentContext(): {
  createSession: () => Promise<void>;
} {
  const createSession = useCallback(async () => {
    // Mock payment session for now
    console.log("Mock payment session created");
    throw new Error("Wallet not connected - payment functionality disabled");
  }, []);

  return { createSession };
}
