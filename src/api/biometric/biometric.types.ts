export interface IBiometricEnroll {
  deviceId: string;
  publicKey: string;
  biometricType: "fingerprint" | "faceid";
  deviceName: string;
}

export interface IBiometricLogin {
  identifier: string;
  deviceId: string;
  signature: string;
  challenge: string;
  publicKey: string;
}

export interface IBiometricChallenge {
  identifier: string;
  deviceId: string;
}

export interface IBiometricChallengeResponse {
  challenge: string;
  expiresIn: number;
}

export interface IBiometricDisable {
  deviceId: string;
}

export interface IBiometricStatusResponse {
  enabled: boolean;
  type: "fingerprint" | "faceid" | null;
  enrolledAt: string | null;
  lockedUntil: string | null;
  failedAttempts: number;
  deviceName: string | null;
}