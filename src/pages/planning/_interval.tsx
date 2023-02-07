/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { dbInterval } from '@/hooks/useBooking';
import { DateTime, Interval } from 'luxon';
import { useRef, useState } from 'react';
import styles from '~/styles/Interval.module.css';
import { trpc } from '~/utils/trpc';

type Props = {
  viewDate: DateTime;
  interval: dbInterval;
  dayWidth: number;
  wrapperDeleteProjectInterval: any;
  updateInterval: void;
};

export function IntervalBooking({
  viewDate,
  interval: dbInterval,
  dayWidth,
  updateInterval,
}: Props) {
  const [interval, setInterval] = useState<Interval>(dbInterval.interval);
  const diff = interval.start.diff(viewDate, 'days');

  const [expand, setExpand] = useState<boolean>();
  const [tooltip, setTooltip] = useState<boolean>(false);
  const [mouseValue, setMouseValue] = useState<number>(0);
  const [startInterval, setStartInterval] = useState<Interval>(
    dbInterval.interval,
  );

  const diffDays = diff.days;
  const intervalNode = useRef(null);

  const extendInterval = (ev: DragEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    setExpand(true);

    if (ev.screenX === 0) {
      return;
    }

    const daysToAdd = Math.ceil((ev.clientX - mouseValue) / dayWidth);

    setInterval(
      Interval.fromDateTimes(
        startInterval.start,
        startInterval.end.plus({ days: daysToAdd }),
      ),
    );
  };

  const moveInterval = (ev: DragEvent<HTMLDivElement>) => {
    const daysToAdd = Math.ceil((ev.clientX - mouseValue) / dayWidth);

    if (ev.screenX === 0) {
      return;
    }

    setInterval(
      Interval.fromDateTimes(
        startInterval.start.plus({ days: daysToAdd }),
        startInterval.end.plus({ days: daysToAdd }),
      ),
    );
  };

  const startExtendInterval = (ev: DragEvent<HTMLDivElement>) => {
    setMouseValue(ev.clientX);
    const blankCanvas = document.createElement('canvas');
    ev.dataTransfer.setDragImage(blankCanvas, 0, 0);
  };

  const endExtendInterval = (ev: DragEvent<HTMLDivElement>) => {
    setMouseValue(0);
    setStartInterval(interval);
    updateInterval({
      id: dbInterval.id,
      startDate: interval.start.toJSDate(),
      endDate: interval.end.toJSDate(),
    });
  };

  return (
    <>
      {tooltip && (
        <div
          className="absolute bg-slate-200 rounded-md"
          style={{
            left: `${
              diffDays * dayWidth +
              (interval.count('days') * dayWidth) / 2 -
              150
            }px`,
            top: 65,
            zIndex: '400',
            width: 300,
            height: 200,
          }}
        >
          i am tooltip
        </div>
      )}
      <div
        ref={intervalNode}
        draggable="true"
        onDragStart={startExtendInterval}
        onDragEnd={endExtendInterval}
        onDrag={moveInterval}
        className={`interval absolute border-r-2 h-14 mt-1 flex justify-between ${
          mouseValue != 0
            ? 'cursor-grabbing bg-cyan-300'
            : 'cursor-grab bg-cyan-400'
        }`}
        onClick={() => setTooltip(!tooltip)}
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
          onDragStart={startExtendInterval}
          onDragEnd={endExtendInterval}
          onDrag={extendInterval}
        ></div>
      </div>
    </>
  );
}
