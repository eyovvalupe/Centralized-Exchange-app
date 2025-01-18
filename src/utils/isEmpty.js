export const isEmpty = (value) => {
    // Check for null or undefined
    if (value == null) return true;
    
    // Check if it's an empty string
    if (typeof value === 'string' && value.trim() === '') return true;
  
    // Check if it's an empty array
    if (Array.isArray(value) && value.length === 0) return true;
  
    // Check if it's an empty object
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  
    // Check if it's an empty Map or Set
    if ((value instanceof Map || value instanceof Set) && value.size === 0) return true;
  
    // For other types, just return false
    return false;
  }
  