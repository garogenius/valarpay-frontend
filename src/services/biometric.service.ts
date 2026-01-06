/**
 * Biometric Service
 * Handles device-level biometric operations and secure key management
 */

import Cookies from "js-cookie";

export interface BiometricInfo {
  deviceId: string;
  biometricType: "fingerprint" | "faceid" | null;
  deviceName: string;
  publicKey: string | null;
  enrolledAt: string | null;
  credentialId?: string;
}

/**
 * Generate a unique device ID (persisted in localStorage)
 */
export const getDeviceId = (): string => {
  if (typeof window === "undefined") return "";
  
  let deviceId = localStorage.getItem("biometric_device_id");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("biometric_device_id", deviceId);
  }
  return deviceId;
};

/**
 * Get device name from user agent
 */
export const getDeviceName = (): string => {
  if (typeof window === "undefined") return "Unknown Device";
  
  const userAgent = window.navigator.userAgent;
  
  // Extract device info from user agent
  if (/iPhone/.test(userAgent)) return "iPhone";
  if (/iPad/.test(userAgent)) return "iPad";
  if (/Android/.test(userAgent)) return "Android Device";
  if (/Windows/.test(userAgent)) return "Windows PC";
  if (/Mac/.test(userAgent)) return "Mac";
  if (/Linux/.test(userAgent)) return "Linux Device";
  
  return "Unknown Device";
};

/**
 * Detect available biometric types on the device
 */
export const detectBiometricCapability = async (): Promise<"fingerprint" | "faceid" | null> => {
  if (typeof window === "undefined") return null;
  
  try {
    // Check for WebAuthn support
    if (window.PublicKeyCredential) {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        // Try to detect specific biometric type
        if (/iPhone|iPad|Mac/.test(navigator.userAgent)) {
          return "faceid"; // iOS/macOS typically use Face ID
        }
        if (/Android/.test(navigator.userAgent)) {
          return "fingerprint"; // Android typically uses fingerprint
        }
        return "fingerprint"; // Default to fingerprint
      }
    }
    
    // Fallback: check for generic biometric API
    if ((navigator as any).credentials?.create) {
      return "fingerprint";
    }
  } catch (error) {
    console.error("Error detecting biometric capability:", error);
  }
  
  return null;
};

/**
 * Generate RSA key pair for biometric signing
 * In production, this should use WebAuthn or platform-specific secure APIs
 */
export const generateKeyPair = async (): Promise<{ publicKey: string; privateKey: string } | null> => {
  try {
    // For web, we'll use a simplified approach with crypto API
    // In production, integrate with WebAuthn or platform-specific secure enclave

    if (typeof window === "undefined" || !window.crypto) {
      return null;
    }

    // Generate ECDSA key pair (more suitable for web than RSA)
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true, // extractable
      ["sign", "verify"]
    );

    // Export keys
    const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);

    return {
      publicKey: JSON.stringify(publicKeyJwk),
      privateKey: JSON.stringify(privateKeyJwk),
    };
  } catch (error) {
    console.error("Error generating key pair:", error);
    return null;
  }
};

/**
 * Create WebAuthn credential for biometric enrollment
 */
export const createCredentialForEnroll = async (options: {
  username: string;
  displayName: string;
  biometricType: "fingerprint" | "faceid";
}): Promise<{ publicKey: string; credentialId: string } | null> => {
  try {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      return null;
    }

    // Create a challenge for the credential
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const createCredentialOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "ValarPay",
        id: window.location.hostname,
      },
      user: {
        id: new Uint8Array(16), // Random user ID
        name: options.username,
        displayName: options.displayName,
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7, // ES256
        },
        {
          type: "public-key",
          alg: -257, // RS256
        },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: "direct",
    };

    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions,
    }) as PublicKeyCredential;

    if (!credential) {
      return null;
    }

    // Extract the public key
    const publicKey = await window.crypto.subtle.exportKey(
      "spki",
      (credential.response as any).getPublicKey()
    );

    // Convert to base64
    const publicKeyArray = new Uint8Array(publicKey);
    const publicKeyBase64 = btoa(String.fromCharCode(...publicKeyArray));

    // Get credential ID
    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

    return {
      publicKey: publicKeyBase64,
      credentialId,
    };
  } catch (error) {
    console.error("Error creating credential for enrollment:", error);
    return null;
  }
};

/**
 * Store biometric info locally (encrypted in production)
 */
export const storeBiometricInfo = (info: BiometricInfo): void => {
  if (typeof window === "undefined") return;
  
  // In production, encrypt this data before storing
  localStorage.setItem("biometric_info", JSON.stringify(info));
};

/**
 * Retrieve stored biometric info
 */
export const getStoredBiometricInfo = (): BiometricInfo | null => {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem("biometric_info");
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Clear stored biometric info
 */
export const clearBiometricInfo = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("biometric_info");
  localStorage.removeItem("biometric_challenge");
};

/**
 * Store challenge for signing
 */
export const storeChallenge = (challenge: string, expiresIn: number): void => {
  if (typeof window === "undefined") return;
  
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem("biometric_challenge", JSON.stringify({ challenge, expiresAt }));
};

/**
 * Get stored challenge
 */
export const getStoredChallenge = (): { challenge: string; expiresAt: number } | null => {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem("biometric_challenge");
  if (!stored) return null;
  
  try {
    const data = JSON.parse(stored);
    // Check if challenge has expired
    if (data.expiresAt < Date.now()) {
      localStorage.removeItem("biometric_challenge");
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * Sign challenge using WebAuthn assertion
 */
export const signChallenge = async (challenge: string): Promise<{ signature: string; credentialId: string } | null> => {
  try {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      return null;
    }

    const biometricInfo = getStoredBiometricInfo();
    if (!biometricInfo?.credentialId) {
      return null;
    }

    // Decode credential ID
    const credentialId = Uint8Array.from(atob(biometricInfo.credentialId), c => c.charCodeAt(0));

    const assertionOptions: PublicKeyCredentialRequestOptions = {
      challenge: new Uint8Array([...challenge].map(c => c.charCodeAt(0))),
      allowCredentials: [
        {
          type: "public-key",
          id: credentialId,
        },
      ],
      userVerification: "required",
      timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
      publicKey: assertionOptions,
    }) as PublicKeyCredential;

    if (!assertion) {
      return null;
    }

    // Get signature from authenticator data
    const signature = new Uint8Array((assertion.response as AuthenticatorAssertionResponse).signature);
    const signatureBase64 = btoa(String.fromCharCode(...signature));

    return {
      signature: signatureBase64,
      credentialId: biometricInfo.credentialId,
    };
  } catch (error) {
    console.error("Error signing challenge:", error);
    return null;
  }
};

/**
 * Trigger biometric authentication prompt
 * This is a placeholder - actual implementation depends on platform
 */
export const triggerBiometricPrompt = async (
  biometricType: "fingerprint" | "faceid"
): Promise<boolean> => {
  try {
    if (typeof window === "undefined") return false;

    // Simulate biometric prompt
    // In production, use WebAuthn or platform-specific APIs
    return new Promise((resolve) => {
      // For demo purposes, resolve after a delay
      // In production, this would trigger actual biometric UI
      setTimeout(() => {
        resolve(true);
      }, 1500);
    });
  } catch (error) {
    console.error("Error triggering biometric prompt:", error);
    return false;
  }
};

/**
 * Check if biometric is available on device
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  const capability = await detectBiometricCapability();
  return capability !== null;
};

/**
 * Check if WebAuthn is supported
 */
export const isWebAuthnSupported = (): boolean => {
  return typeof window !== "undefined" && !!window.PublicKeyCredential;
};
