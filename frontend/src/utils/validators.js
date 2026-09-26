export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // optional field
  const re = /^[+]?[\d\s()-]{7,20}$/;
  return re.test(phone);
};

export const isValidUsername = (username) => {
  if (!username) return false;
  return username.length >= 3 && username.length <= 50;
};

export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

export const passwordsMatch = (p1, p2) => p1 === p2 && p1.length > 0;

export const isPositiveNumber = (value) => {
  const n = parseFloat(value);
  return !isNaN(n) && n >= 0;
};

export const isPositiveInteger = (value) => {
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= 0 && Number.isInteger(n);
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate a registration form.
 * Returns an object with field errors, empty if valid.
 */
export const validateRegister = (data) => {
  const errors = {};
  if (!isRequired(data.username)) errors.username = 'Username is required';
  else if (!isValidUsername(data.username))
    errors.username = 'Username must be 3-50 characters';

  if (!isRequired(data.email)) errors.email = 'Email is required';
  else if (!isValidEmail(data.email)) errors.email = 'Invalid email format';

  if (!isValidPassword(data.password))
    errors.password = 'Password must be at least 6 characters';

  if (!passwordsMatch(data.password, data.password_confirmation))
    errors.password_confirmation = 'Passwords do not match';

  if (data.contact_number && !isValidPhone(data.contact_number))
    errors.contact_number = 'Invalid contact number';

  if (data.role === 'farmer') {
    if (!isRequired(data.stall_name))
      errors.stall_name = 'Stall name is required';
    if (!isRequired(data.contact_person))
      errors.contact_person = 'Contact person is required';
  }

  return errors;
};

/**
 * Validate a product form.
 */
export const validateProduct = (data) => {
  const errors = {};
  if (!isRequired(data.name)) errors.name = 'Product name is required';
  if (!isRequired(data.category_id)) errors.category_id = 'Category is required';
  if (!isPositiveNumber(data.price)) errors.price = 'Price must be a positive number';
  if (!isRequired(data.unit)) errors.unit = 'Unit is required';
  if (!isPositiveInteger(data.stock_quantity))
    errors.stock_quantity = 'Stock must be a positive whole number';
  return errors;
};

/**
 * Validate an order form.
 */
export const validateOrder = (data, items) => {
  const errors = {};
  if (!items || items.length === 0) errors.items = 'Cart is empty';
  if (!isRequired(data.pickup_date)) errors.pickup_date = 'Pickup date is required';
  if (!isRequired(data.pickup_slot)) errors.pickup_slot = 'Pickup slot is required';

  if (data.pickup_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(data.pickup_date);
    if (picked < today) errors.pickup_date = 'Pickup date cannot be in the past';
  }

  return errors;
};

/**
 * Validate a market form.
 */
export const validateMarket = (data) => {
  const errors = {};
  if (!isRequired(data.market_name)) errors.market_name = 'Market name is required';
  if (!isRequired(data.address)) errors.address = 'Address is required';

  if (data.latitude && isNaN(parseFloat(data.latitude)))
    errors.latitude = 'Latitude must be a number';
  if (data.longitude && isNaN(parseFloat(data.longitude)))
    errors.longitude = 'Longitude must be a number';

  return errors;
};

/**
 * Validate a review.
 */
export const validateReview = (data) => {
  const errors = {};
  if (!data.rating || data.rating < 1 || data.rating > 5)
    errors.rating = 'Rating must be between 1 and 5';
  if (data.comment && data.comment.length > 1000)
    errors.comment = 'Comment must be under 1000 characters';
  return errors;
};