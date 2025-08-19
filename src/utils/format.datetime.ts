/**
 * Formats Java LocalDateTime string to dd/MM/yyyy HH:mm:ss format
 * @param dateString - Java LocalDateTime string (e.g., "2024-01-15T10:30:00")
 * @returns Formatted date string in dd/MM/yyyy HH:mm:ss format
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats time string to HH:MM:SS format
 * @param timeString - Time string (e.g., "10:30:00", "2024-01-15T10:30:00", "10:30")
 * @returns Formatted time string in HH:MM:SS format
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    // If it's a full datetime string, extract time part
    if (timeString.includes('T')) {
      const timePart = timeString.split('T')[1];
      timeString = timePart.split('.')[0]; // Remove milliseconds if present
    }
    
    // Remove microseconds if present (e.g., "05:00:00.000000" -> "05:00:00")
    if (timeString.includes('.')) {
      timeString = timeString.split('.')[0];
    }
    
    // Split the time string
    const timeParts = timeString.split(':');
    
    if (timeParts.length >= 2) {
      const hours = timeParts[0].padStart(2, '0');
      const minutes = timeParts[1].padStart(2, '0');
      const seconds = (timeParts[2] || '00').padStart(2, '0');
      
      return `${hours}:${minutes}:${seconds}`;
    }
    
    return timeString; // Return original if format is unexpected
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};