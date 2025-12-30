export async function isFingerprintPaymentAvailable(): Promise<boolean> {
  // Best-effort capability check; web environments vary.
  if (typeof window === "undefined") return false;
  // WebAuthn availability is a reasonable proxy for biometric auth support in many environments.
  return typeof (window as any).PublicKeyCredential !== "undefined";
}




