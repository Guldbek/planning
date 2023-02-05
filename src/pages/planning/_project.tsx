/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DateTime } from 'luxon';
import {
  checkIfDateExistsInIntervals,
  fromBookingIntervals,
} from '../helpers/intervalFromDates';
import type { Project as ProjectType } from '@prisma/client';
import Resource from './_resource';
import Day from './_day';
import { useEffect, useState } from 'react';
import { dbInterval, useBooking } from '~/hooks/useBooking';
import { IntervalBooking } from './_interval';
import { trpc } from '~/utils/trpc';

type PropsType = {
  weeks: any;
  dayWidth: number;
  project: ProjectType;
  viewDate: DateTime;
};

export default function Project(props: PropsType) {
  const { weeks, dayWidth, project, viewDate } = props;

  const [showResources, setShowResources] = useState<boolean>(false);
  const [intervals, setIntervals] = useState<dbInterval[]>();

  const { loading } = trpc.projectStartInterval.list.useQuery(
    { projectId: project.id },
    {
      onSuccess(data) {
        setIntervals(
          data.items.map((interval) => fromBookingIntervals(interval)),
        );
      },
    },
  );
  const mutation = trpc.projectStartInterval.add.useMutation();

  function wrapperProjectInterval(intervalData) {
    mutation.mutate({
      projectId: project.id,
      startDate: intervalData.startDate,
      endDate: intervalData.endDate,
    });
  }

  function wrapperDeleteProjectInterval(id: string | number) {
    deleteProjectInterval({
      variables: { id: Number(id) },
    });
  }

  const [
    bookingEnabled,
    bookingInterval,
    onClickBookingStart,
    onHoverBooking,
    onClickBookingEnd,
  ] = useBooking(
    wrapperProjectInterval,
    wrapperDeleteProjectInterval,
    setIntervals,
    intervals,
  );

  return (
    <>
      <div className="flex flex-row hover:bg-zinc-100">
        <div className="w-1/5 border-r-4 border-b-2 border-t-4 p-2 flex justify-between z-10 bg-white">
          <div>
            {project.name}
            <p className="text-xs"></p>
          </div>
          <button
            onClick={() => setShowResources(!showResources)}
            className="cursor-pointer"
          >
            Udvid
          </button>
        </div>
        <div className="w-4/5 flex flex-row border-b-2 border-t-4 relative">
          {intervals?.map((interval) => (
            <IntervalBooking
              dayWidth={dayWidth}
              viewDate={viewDate}
              wrapperDeleteProjectInterval={wrapperDeleteProjectInterval}
              interval={interval}
            />
          ))}

          {weeks &&
            weeks.map((week, index) => (
              <div
                key={`${week.weekNumber}${index}`}
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
                      color={'bg-cyan-500'}
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
      {/* {showResources &&
        resources.map((resource) => (
          <Resource
            resource={resource}
            dayWidth={dayWidth}
            weeks={weeks}
            project={project}
          />
        ))} */}
    </>
  );
}
