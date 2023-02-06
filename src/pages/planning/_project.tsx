/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DateTime } from 'luxon';
import {
  checkIfDateExistsInIntervals,
  fromBookingIntervals,
} from '../helpers/intervalFromDates';
import { AddResource } from './_addResource';
import { useState } from 'react';
import { dbInterval, useBooking } from '~/hooks/useBooking';
import { IntervalBooking } from './_interval';
import { trpc } from '~/utils/trpc';
import Resource from './_resource';
import Day from './_day';

import type { Project as ProjectType } from '@prisma/client';
import type { Resource } from '@prisma/client';

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
  const [resources, setResources] = useState<Resource[]>();

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

  const { loading: resourceLoading } = trpc.resource.list.useQuery(
    { projectId: project.id },
    {
      onSuccess(data) {
        setResources(data.items);
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

      {showResources &&
        resources.map((resource, index) => (
          <Resource
            key={index}
            resource={resource}
            dayWidth={dayWidth}
            weeks={weeks}
            project={project}
            viewDate={viewDate}
          />
        ))}
      {showResources && <AddResource />}
    </>
  );
}
