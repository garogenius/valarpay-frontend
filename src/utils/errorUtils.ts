/**
 * Utility functions for handling and parsing error responses
 */

export interface BalanceInfo {
  currentBalance?: number;
  requiredAmount?: number;
}

/**
 * Checks if an error is an insufficient balance error
 * @param error - The error object from API response
 * @returns true if the error indicates insufficient balance
 */
export function isInsufficientBalanceError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error?.response?.data?.message;
  const errorCode = error?.response?.data?.code || error?.response?.data?.errorCode;
  const statusCode = error?.response?.status;

  // Check status code
  if (statusCode === 400 || statusCode === 402) {
    // 402 is Payment Required, often used for insufficient balance
  }

  // Check error message
  if (errorMessage) {
    const message = Array.isArray(errorMessage) 
      ? errorMessage.join(" ").toLowerCase()
      : String(errorMessage).toLowerCase();

    const insufficientKeywords = [
      "insufficient",
      "low balance",
      "not enough",
      "balance too low",
      "insufficient funds",
      "insufficient balance",
      "balance is insufficient",
      "your balance is",
      "available balance",
      "current balance",
    ];

    if (insufficientKeywords.some(keyword => message.includes(keyword))) {
      return true;
    }
  }

  // Check error code
  if (errorCode) {
    const code = String(errorCode).toLowerCase();
    const insufficientCodes = [
      "insufficient_balance",
      "insufficient_funds",
      "low_balance",
      "balance_too_low",
      "402",
      "insufficient",
    ];

    if (insufficientCodes.includes(code)) {
      return true;
    }
  }

  // Check error data for balance-related fields
  const errorData = error?.response?.data?.data || error?.response?.data;
  if (errorData) {
    if (
      errorData.currentBalance !== undefined ||
      errorData.requiredAmount !== undefined ||
      errorData.availableBalance !== undefined ||
      errorData.balance !== undefined
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Extracts balance information from an error response
 * @param error - The error object from API response
 * @returns BalanceInfo object with currentBalance and requiredAmount if available
 */
export function extractBalanceInfo(error: any): BalanceInfo {
  const info: BalanceInfo = {};

  if (!error) return info;

  const errorData = error?.response?.data?.data || error?.response?.data || {};
  const errorMessage = error?.response?.data?.message;

  // Extract from error data
  if (errorData.currentBalance !== undefined) {
    info.currentBalance = Number(errorData.currentBalance);
  } else if (errorData.availableBalance !== undefined) {
    info.currentBalance = Number(errorData.availableBalance);
  } else if (errorData.balance !== undefined) {
    info.currentBalance = Number(errorData.balance);
  }

  if (errorData.requiredAmount !== undefined) {
    info.requiredAmount = Number(errorData.requiredAmount);
  } else if (errorData.amount !== undefined) {
    info.requiredAmount = Number(errorData.amount);
  } else if (errorData.requestedAmount !== undefined) {
    info.requiredAmount = Number(errorData.requestedAmount);
  }

  // Try to extract from error message if not found in data
  if (errorMessage && (!info.currentBalance || !info.requiredAmount)) {
    const message = Array.isArray(errorMessage) 
      ? errorMessage.join(" ")
      : String(errorMessage);

    // Try to extract numbers from message (e.g., "Your balance is 1000, required 5000")
    const numbers = message.match(/\d+[\d,]*\.?\d*/g);
    if (numbers && numbers.length >= 2) {
      // Usually the first number is current balance, second is required
      const parsedNumbers = numbers.map(n => parseFloat(n.replace(/,/g, "")));
      if (!info.currentBalance && parsedNumbers[0]) {
        info.currentBalance = parsedNumbers[0];
      }
      if (!info.requiredAmount && parsedNumbers[1]) {
        info.requiredAmount = parsedNumbers[1];
      }
    } else if (numbers && numbers.length === 1) {
      // If only one number, it might be the required amount
      const parsedNumber = parseFloat(numbers[0].replace(/,/g, ""));
      if (message.toLowerCase().includes("required") || message.toLowerCase().includes("need")) {
        if (!info.requiredAmount) {
          info.requiredAmount = parsedNumber;
        }
      } else if (message.toLowerCase().includes("balance") || message.toLowerCase().includes("available")) {
        if (!info.currentBalance) {
          info.currentBalance = parsedNumber;
        }
      }
    }
  }

  return info;
}


