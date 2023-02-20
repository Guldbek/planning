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
import { toast } from 'react-toastify';
import Resource from './_resource';
import Day from './_day';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';
import ExpandLessSharpIcon from '@mui/icons-material/ExpandLessSharp';

import type {
  Project as ProjectType,
  ProjectResource,
  ProjectStartInterval,
} from '@prisma/client';

import {
  getProjectStartIntervals,
  createProjectStartIntervals,
  updateProjectStartIntervals,
  getProjectResources,
} from '../api/strapi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const [projectResources, setProjectResources] = useState<ProjectResource[]>();

  const queryClient = useQueryClient();

  useQuery(
    ['projectStartIntervals', project.id],
    () => getProjectStartIntervals(project.id),
    {
      onSuccess: (data) => {
        setIntervals(
          data.data.map((interval) => fromBookingIntervals(interval)),
        );
      },
    },
  );

  const updateMutation = useMutation({
    mutationFn: (data) => updateProjectStartIntervals(data),
  });

  const updateProjectStartInterval = (
    projectStartInterval: ProjectStartInterval,
  ) => {
    updateMutation.mutate(
      {
        id: projectStartInterval.id,
        data: {
          startDate: projectStartInterval.attributes.startDate,
          endDate: projectStartInterval.attributes.endDate,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(['projectStartIntervals', project.id], data);
          toast.success('Booking opdateret');
        },
      },
    );
  };

  const mutation = useMutation({
    mutationFn: (data) => createProjectStartIntervals(data),
  });

  function wrapperProjectInterval(intervalData) {
    mutation.mutate(
      {
        data: {
          project: project.id,
          startDate: intervalData.attributes.startDate,
          endDate: intervalData.attributes.endDate,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(['projectStartIntervals', project.id], data);
        },
      },
    );
  }

  useQuery(
    ['projectResources', project.id],
    () => getProjectResources(project.id),
    {
      onSuccess: (data) => {
        setProjectResources(data.data);
      },
    },
  );

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
        <div className="w-1/5 border-r-4 border-t-4 p-2 flex justify-between z-10 bg-white items-center">
          <div>{project.attributes.name}</div>
          <button
            onClick={() => setShowResources(!showResources)}
            className="cursor-pointer"
          >
            {showResources ? <ExpandLessSharpIcon /> : <ExpandMoreSharpIcon />}
          </button>
        </div>
        <div className="w-4/5 flex flex-row border-b-2 border-t-4 relative">
          {intervals?.map((interval, index) => (
            <IntervalBooking
              key={index}
              dayWidth={dayWidth}
              viewDate={viewDate}
              interval={interval}
              updateInterval={updateProjectStartInterval}
              color={'bg-cyan-400'}
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

      {showResources &&
        projectResources.map((resource, index) => (
          <Resource
            key={index}
            projectResource={resource}
            dayWidth={dayWidth}
            weeks={weeks}
            project={project}
            viewDate={viewDate}
          />
        ))}
      {showResources && (
        <>
          <AddResource project={project} projectResources={projectResources} />
        </>
      )}
    </>
  );
}
