/* eslint-disable @typescript-eslint/no-explicit-any */

export type Option = {
  value: string;
  label: string;
  logo?: any;
  network?: string;
  [key: string]: unknown; // Allow for additional properties
};
