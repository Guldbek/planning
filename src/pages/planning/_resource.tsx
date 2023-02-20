/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  fromBookingIntervals,
  checkIfDateExistsInIntervals,
} from '../helpers/intervalFromDates';
import { useState } from 'react';
import Day from './_day';
import { useBooking } from '~/hooks/useBooking';
import { Interval } from 'luxon';
import { IntervalBooking } from './_interval';
import { toast } from 'react-toastify';
import {
  getResourceStartIntervals,
  createResourceStartIntervals,
  updateResourceStartIntervals,
} from '../api/strapi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type PropsType = {
  weeks: any;
  dayWidth: number;
  resource: ResourceType;
  viewDate: DateTime;
};

export default function Resource(props: PropsType) {
  const { weeks, dayWidth, projectResource, viewDate } = props;

  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [hours, setHours] = useState<number>(0);

  let hoursTest = 0;
  intervals.map((interval) => {
    hoursTest = hoursTest + interval.interval.count('days') * 7.5;
  });

  const queryClient = useQueryClient();

  useQuery(
    ['resourceStartIntervals', projectResource.id],
    () => getResourceStartIntervals(projectResource.id),
    {
      onSuccess: (data) => {
        setIntervals(
          data.data.map((interval) => fromBookingIntervals(interval)),
        );
      },
    },
  );

  const updateMutation = useMutation({
    mutationFn: (data) => updateResourceStartIntervals(data),
  });

  const updateResourceStartInterval = (
    resourceStartInterval: ProjectStartInterval,
  ) => {
    updateMutation.mutate(
      {
        id: resourceStartInterval.id,
        data: {
          startDate: resourceStartInterval.attributes.startDate,
          endDate: resourceStartInterval.attributes.endDate,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            ['resourceStartIntervals', projectResource.id],
            data,
          );
          toast.success('Booking opdateret');
        },
      },
    );
  };

  const mutation = useMutation({
    mutationFn: (data) => createResourceStartIntervals(data),
  });

  function wrapperResourceInterval(intervalData) {
    mutation.mutate(
      {
        data: {
          project_resource: projectResource.id,
          startDate: intervalData.attributes.startDate,
          endDate: intervalData.attributes.endDate,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            ['resourceStartIntervals', projectResource.id],
            data,
          );
        },
      },
    );
  }

  const [
    bookingEnabled,
    bookingInterval,
    onClickBookingStart,
    onHoverBooking,
    onClickBookingEnd,
  ] = useBooking(wrapperResourceInterval, setIntervals, intervals);

  return (
    <>
      <div className="flex flex-row hover:bg-zinc-100">
        <div className="w-1/5 border-r-4 p-2 flex justify-end z-10 bg-white items-center">
          <div className="mr-3">
            <p className="text-xs text-right">
              {projectResource.attributes.resource.data.attributes.name}
            </p>
            <p className="text-xs text-right text-green-500">
              <span className="font-bold">
                {Math.floor(Math.random() * 100)}
              </span>
              /{hoursTest}
            </p>
          </div>

          <img
            src={`https://fakeface.rest/face/view/${projectResource.attributes.resource.data.attributes.name}?gender=male`}
            className="w-8 h-8 rounded-3xl"
          />
        </div>
        <div className="w-4/5 flex flex-row border-b-2 relative">
          {intervals?.map((interval, index) => (
            <IntervalBooking
              key={index}
              dayWidth={dayWidth}
              viewDate={viewDate}
              interval={interval}
              updateInterval={updateResourceStartInterval}
              color={'bg-rose-400'}
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
                      color={'bg-rose-400'}
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
