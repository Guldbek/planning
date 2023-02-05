/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  fromBookingIntervals,
  checkIfDateExistsInIntervals,
} from '../helpers/intervalFromDates';
import { useMemo, useState } from 'react';
import Day from './_day';

type PropsType = {
  weeks: any;
  dayWidth: number;
  workgang: WorkgangType;
};

export default function Workgang(props: PropsType) {
  const { weeks, dayWidth, workgang } = props;
  const [intervals, setIntervals] = useState([]);

  useMemo(() => {
    setIntervals([fromBookingIntervals(workgang)]);
  }, [workgang]);

  return (
    <>
      <div className="flex flex-row hover:bg-zinc-100">
        <div className="w-1/5 border-r-4 border-b-2 p-2 text-right">
          {workgang.name}
        </div>
        <div className="w-4/5 flex flex-row border-b-2">
          {weeks &&
            weeks.map((week, index) => (
              <div
                key={index}
                className="border-r-4"
                style={{ width: dayWidth * week.days.length + 'px' }}
              >
                <div className="flex flex-row">
                  {week.days.map((day, index) => (
                    <Day
                      index={day.weekNumber + index}
                      dayWidth={dayWidth}
                      isInInterval={checkIfDateExistsInIntervals(
                        intervals,
                        day,
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
