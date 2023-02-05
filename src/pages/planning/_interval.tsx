/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { dbInterval } from '@/hooks/useBooking';
import { DateTime, Interval } from 'luxon';
import { useRef, useState } from 'react';
import styles from '~/styles/Interval.module.css';

type Props = {
  viewDate: DateTime;
  interval: dbInterval;
  dayWidth: number;
  wrapperDeleteProjectInterval: any;
};

export function IntervalBooking({
  viewDate,
  interval: dbInterval,
  dayWidth,
  wrapperDeleteProjectInterval,
}: Props) {
  const [interval, setInterval] = useState<Interval>(dbInterval.interval);
  const diff = interval.start.diff(viewDate, 'days');

  const [expand, setExpand] = useState<boolean>();

  const diffDays = diff.days;
  const intervalNode = useRef(null);

  const extendInterval = (ev: DragEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    setExpand(true);

    let initialBottomValue = intervalNode.current.getBoundingClientRect().right;
    let mouseValue = ev.clientX;

    let daysToAdd = Math.ceil((mouseValue - initialBottomValue) / dayWidth);

    console.log(daysToAdd);
    setInterval(
      interval.set({
        end: interval.end.plus({ days: daysToAdd }),
      }),
    );
  };

  return (
    <>
      <div
        ref={intervalNode}
        className="interval absolute bg-cyan-400 border-r-2 h-14 mt-1 flex justify-between"
        // onClick={() => wrapperDeleteProjectInterval(interval.id)}
        style={{
          left: `${diffDays * dayWidth}px`,
          width: `${interval.count('days') * dayWidth}px`,
          zIndex: '1',
        }}
      >
        <p className="text-s text-white p-1">{interval.count('days')} dage</p>
        <div
          draggable="true"
          className={styles.resizeInterval}
          onDragStart={extendInterval}
        ></div>
      </div>
    </>
  );
}
