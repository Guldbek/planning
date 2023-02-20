import { DateTime, Interval } from 'luxon';
import { exit } from 'process';

type ObjectInterval = {
  startDate: Date;
  endDate: Date;
  id: string;
};

export function intervalFromDates(interval: Interval) {
  const months = () => calculateMonths(interval);
  const weeks = () => calculateWeeks(interval);

  return { months, weeks };
}

const calculateWeeks = (interval: Interval) => {
  const rewoundStart = interval.start.startOf('week');
  const weekIntervals = interval
    .set({ start: rewoundStart })
    .splitBy({ weeks: 1 });

  if (!weekIntervals[0]) {
    return;
  }

  weekIntervals[0] = weekIntervals[0].set({ start: interval.start });

  return weekIntervals.map((weekInterval) => {
    const endOfWeek = weekInterval.end;
    let month = weekInterval.start.monthShort;

    if (month != endOfWeek.monthShort) {
      month += '-' + endOfWeek.monthShort;
    }

    return {
      days: intervalToDays(weekInterval),
      monthNames: month,
      weekNumber: weekInterval.start.weekNumber,
    };
  });
};

const calculateMonths = (interval: Interval) => {
  const rewoundStart = interval.start.startOf('month');
  const monthIntervals = interval
    .set({ start: rewoundStart })
    .splitBy({ months: 1 });

  if (!monthIntervals[0]) {
    return;
  }
  monthIntervals[0] = monthIntervals[0].set({ start: interval.start });

  return monthIntervals.map((monthInterval) => {
    return {
      days: intervalToDays(monthInterval),
      monthNumber: monthInterval.start.month,
      monthShort: monthInterval.start.monthShort,
    };
  });
};

const intervalToDays = (interval: Interval) => {
  return interval.splitBy({ days: 1 }).map((interval) => interval.start);
};

export type BookingInterval = {
  id: string;
  interval: Interval;
};

export function fromBookingIntervals(
  interval: ObjectInterval,
): BookingInterval {
  console.log(interval);
  const now = DateTime.fromISO(interval.attributes.startDate);
  const later = DateTime.fromISO(interval.attributes.endDate).endOf('day');
  const DateTimeInterval = Interval.fromDateTimes(now, later);

  return { id: interval.id, interval: DateTimeInterval };
}

export function checkIfDateExistsInIntervals(
  intervals: BookingInterval[],
  date: DateTime,
): boolean {
  let returnState = false;

  intervals.forEach((interval) => {
    if (interval.interval.contains(date)) {
      returnState = true;
      exit;
    }
  });

  return returnState;
}

export function createObjectInterval(
  first: DateTime,
  second: DateTime,
): { attributes: { startDate: string; endDate: string } } {
  const startDate = first <= second ? first : second;
  const endDate = first >= second ? first : second;

  return {
    attributes: {
      startDate: startDate?.toISO(),
      endDate: endDate?.toISO(),
    },
  };
}
