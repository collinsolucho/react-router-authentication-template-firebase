/**
 * Simple text length validator
 * @param {string} text - The input string to check
 */
export function validateText(text) {
  // Ensures text meets a minimum length requirement for UX/Database consistency
  if (text.length < 2) {
    return "add more than 3 characters";
  }
}

/**
 * Validates Email and Password strength for the Hybrid Auth model
 */
export function validateUser(email, password) {
  let errors = {};

  // 1. Check for presence and correct email format using Regex
  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  // 2. Enforce strong password rules (8+ chars, Uppercase, Lowercase, Number, Special Char)
  if (!password) {
    errors.password = "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
      password
    )
  ) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
  }

  // Returns the errors object if any exist, otherwise returns null for easy "if" checks
  return Object.keys(errors).length ? errors : null;
}
