/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DateTime, Interval } from 'luxon';
import { useEffect, useState } from 'react';
import {
  fromBookingIntervals,
  createObjectInterval,
} from '~/pages/helpers/intervalFromDates';
import type { BookingInterval } from '~/pages/helpers/intervalFromDates';
import { toast } from 'react-toastify';

export type dbInterval = {
  id: string;
  interval: Interval;
};

export function useBooking(
  callbackSaveInterval,
  setIntervals,
  intervals: dbInterval[],
) {
  const [selectedStartBookingDay, setSelectedStartBookingDay] =
    useState<DateTime>(DateTime.now);
  const [bookingEnabled, setBookingEnabled] = useState<boolean>(false);
  const [bookingInterval, setBookingInterval] =
    useState<BookingInterval | null>();

  useEffect(() => {
    const handleEsc = (ev: React.KeyboardEvent): void => {
      if (ev.key === 'Escape') {
        setBookingEnabled(false);
        setBookingInterval(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  function onClickBookingStart(day: DateTime, dayRef: HTMLDivElement) {
    dayRef.current.className = 'bg-red-600 ';
    setBookingEnabled(true);
    setSelectedStartBookingDay(day);
  }

  function onHoverBooking(day: DateTime) {
    const temp = fromBookingIntervals({
      id: 'temp',
      ...createObjectInterval(selectedStartBookingDay, day),
    });

    setBookingInterval(temp);
  }

  function onClickBookingEnd(day: DateTime) {
    const newInterval = createObjectInterval(selectedStartBookingDay, day);
    const interval = fromBookingIntervals(newInterval);

    callbackSaveInterval({
      ...newInterval,
    });

    toast.success('Ny booking tilføjet');
    setIntervals([...intervals, interval]);
    setBookingEnabled(false);
    setBookingInterval(null);
  }

  return [
    bookingEnabled,
    bookingInterval,
    onClickBookingStart,
    onHoverBooking,
    onClickBookingEnd,
  ] as const;
}
