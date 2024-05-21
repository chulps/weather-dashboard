import { useState, useEffect } from 'react';

const useTimePassed = (timestamp) => {
  const [timePassed, setTimePassed] = useState('');

  useEffect(() => {
    const updateTimePassed = () => {
      const now = new Date();
      const then = new Date(timestamp);
      const diffInSeconds = Math.floor((now - then) / 1000);

      let interval;
      let timeString;

      if (diffInSeconds < 60) {
        timeString = `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
        interval = 1000;
      } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        timeString = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        interval = 60000;
      } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        timeString = `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        interval = 3600000;
      } else {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        timeString = `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        interval = 86400000;
      }

      setTimePassed(timeString);

      return interval;
    };

    const interval = updateTimePassed();
    const intervalId = setInterval(updateTimePassed, interval);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return timePassed;
};

export default useTimePassed;
