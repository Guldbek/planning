import { DateTime } from 'luxon';
import { useRef, useState } from 'react';
import styles from '~/styles/Day.module.css';

type PropsType = {
  dayWidth: number;
  isInInterval: boolean | undefined;
  index: number;
  onClickBookingStart: any;
  onClickBookingEnd: any;
  onHoverBooking: any;
  bookingEnabled: boolean;
  dateTime: DateTime;
  isInBookingInterval: boolean | undefined;
  color: string;
  bookingIntervalCount: number;
};

export default function Day(props: PropsType) {
  const {
    dayWidth,
    isInInterval,
    color,
    onClickBookingStart,
    onClickBookingEnd,
    bookingEnabled,
    onHoverBooking,
    dateTime,
    isInBookingInterval,
    bookingIntervalCount,
  } = props;
  const dayRef = useRef(null);
  const [showToolTip, setShowToolTip] = useState(false);

  function onClickHandler() {
    if (isInInterval) {
      alert('Is booking in interval');

      return;
    }

    if (!bookingEnabled) {
      onClickBookingStart(dateTime, dayRef);
    } else {
      onClickBookingEnd(dateTime);
      setShowToolTip(false);
    }
  }

  function onHoverHandler() {
    if (bookingEnabled) {
      onHoverBooking(dateTime);
      setShowToolTip(true);
    }
  }

  return (
    <div className="relative">
      {showToolTip && (
        <div style={{ left: -(dayWidth / 2) }} className={styles.toolTip}>
          {bookingIntervalCount} <span className="text-xs">dage</span>
        </div>
      )}
      <div
        ref={dayRef}
        onClick={() => onClickHandler()}
        onMouseEnter={() => onHoverHandler()}
        onMouseLeave={() => setShowToolTip(false)}
        className={`cursor-pointer h-16 text-center border-r-2 ${
          isInBookingInterval ? 'bg-cyan-400' : ''
        }`}
        style={{ width: dayWidth }}
      ></div>
    </div>
  );
}
