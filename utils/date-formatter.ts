export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If it's today, show time only
  if (date.toDateString() === now.toDateString()) {
    return formatTime(date);
  }
  
  // If it's yesterday, show "Yesterday" with time
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${formatTime(date)}`;
  }
  
  // If it's within the last 7 days, show day name with time
  const sixDaysAgo = new Date(now);
  sixDaysAgo.setDate(now.getDate() - 6);
  if (date >= sixDaysAgo) {
    return `${date.toLocaleDateString(undefined, { weekday: 'long' })}, ${formatTime(date)}`;
  }
  
  // Otherwise, show full date
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  }) + `, ${formatTime(date)}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  return formatDate(timestamp);
};