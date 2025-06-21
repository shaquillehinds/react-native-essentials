import { Schedule } from '../utils/Scheduler';
import { useEffect, useState } from 'react';

export interface UseTimerProps {
  seconds: number;
  onTimerEnds: () => void;
  start: boolean;
}

export function useTimer(props: UseTimerProps) {
  const [seconds, setSeconds] = useState(props.seconds % 60);
  const [minutes, setMinutes] = useState(Math.floor(props.seconds / 60));
  const [schedule, setSchedule] = useState<Schedule>();
  useEffect(() => {
    if (props.start && (seconds || minutes)) {
      const sched = new Schedule(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      sched.start();
      setSchedule(sched);
    }
  }, [props.start]);
  useEffect(() => {
    if (props.start && seconds < 0) {
      if (minutes <= 0) {
        schedule?.stop();
        props.onTimerEnds();
      } else {
        setSeconds(59);
        setMinutes((prev) => prev - 1);
      }
    }
  }, [seconds]);

  return { seconds, minutes };
}
