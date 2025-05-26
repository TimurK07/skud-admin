export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return 'только что';
  } else if (diffSec < 3600) {
    const minutes = Math.floor(diffSec / 60);
    return `${minutes} ${getMinutesText(minutes)} назад`;
  } else if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours} ${getHoursText(hours)} назад`;
  } else {
    return formatDate(date);
  }
};

const getMinutesText = (minutes) => {
  if (minutes >= 11 && minutes <= 14) {
    return 'минут';
  }
  
  const lastDigit = minutes % 10;
  
  if (lastDigit === 1) {
    return 'минуту';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'минуты';
  } else {
    return 'минут';
  }
};

const getHoursText = (hours) => {
  if (hours >= 11 && hours <= 14) {
    return 'часов';
  }
  
  const lastDigit = hours % 10;
  
  if (lastDigit === 1) {
    return 'час';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'часа';
  } else {
    return 'часов';
  }
};
