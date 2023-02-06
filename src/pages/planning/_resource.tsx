/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  fromBookingIntervals,
  checkIfDateExistsInIntervals,
} from '../helpers/intervalFromDates';
import type { ResourceType, StartIntervalType } from '.';
import { useMemo, useState } from 'react';
import Day from './_day';
import { useBooking } from '~/hooks/useBooking';
import { Interval } from 'luxon';
import { trpc } from '~/utils/trpc';
import { IntervalBooking } from './_interval';

type PropsType = {
  weeks: any;
  dayWidth: number;
  resource: ResourceType;
  viewDate: DateTime;
};

export default function Resource(props: PropsType) {
  const { weeks, dayWidth, resource, viewDate } = props;

  const { loading } = trpc.resourceStartInterval.list.useQuery(
    { resourceId: resource.id },
    {
      onSuccess(data) {
        setIntervals(
          data.items.map((interval) => fromBookingIntervals(interval)),
        );
      },
    },
  );

  const mutation = trpc.resourceStartInterval.add.useMutation();

  function wrapperProjectInterval(intervalData) {
    mutation.mutate({
      resourceId: resource.id,
      startDate: intervalData.startDate,
      endDate: intervalData.endDate,
    });
  }

  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [
    bookingEnabled,
    bookingInterval,
    onClickBookingStart,
    onHoverBooking,
    onClickBookingEnd,
  ] = useBooking(wrapperProjectInterval, setIntervals, intervals);

  return (
    <>
      <div className="flex flex-row hover:bg-zinc-100">
        <div className="w-1/5 border-r-4 border-b-2 p-2 flex justify-between z-10 bg-white">
          {resource.name}
        </div>
        <div className="w-4/5 flex flex-row border-b-2 relative">
          {intervals?.map((interval, index) => (
            <IntervalBooking
              key={index}
              dayWidth={dayWidth}
              viewDate={viewDate}
              interval={interval}
            />
          ))}
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
                      key={`${day.weekNumber}${index}`}
                      onHoverBooking={onHoverBooking}
                      onClickBookingStart={onClickBookingStart}
                      onClickBookingEnd={onClickBookingEnd}
                      bookingEnabled={bookingEnabled}
                      index={index}
                      color={'bg-cyan-400'}
                      dateTime={day}
                      dayWidth={dayWidth}
                      isInInterval={
                        intervals &&
                        checkIfDateExistsInIntervals(intervals, day)
                      }
                      bookingIntervalCount={
                        bookingEnabled &&
                        bookingInterval?.interval.count('days')
                      }
                      isInBookingInterval={bookingInterval?.interval.contains(
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
