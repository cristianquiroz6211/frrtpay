export const required = (value: any) => 
  !value ? 'This field is required' : undefined;

export const email = (value: string) => 
  !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Invalid email address' : undefined;

export const phone = (value: string) =>
  !value.match(/^\+?[\d\s-]{10,}$/) ? 'Invalid phone number' : undefined;

export const pin = (value: string) =>
  !value.match(/^\d{4}$/) ? 'PIN must be 4 digits' : undefined;

export const matchValue = (value: string, matchAgainst: string) =>
  value !== matchAgainst ? 'Values do not match' : undefined;