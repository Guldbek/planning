import { useState } from 'react';
import { DateTime, Interval } from 'luxon';
import { intervalFromDates } from '../helpers/intervalFromDates';
import Header from './_header';
import Project from './_project';
import { AddProject } from './_addProject';
import type { Project as ProjectType } from '@prisma/client';
import { trpc } from '~/utils/trpc';

export default function Planning() {
  const { data, isLoading: loading } = trpc.project.list.useQuery();
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('week'),
  );
  const [dayWidth, setDayWidth] = useState<number>(24);
  const [projects, setProjects] = useState<ProjectType[]>();
  const later = startDate.plus({ months: 4 }).endOf('week').endOf('day');
  const interval = Interval.fromDateTimes(startDate, later);

  if (loading) return <p>Loading...</p>;

  const weeks = intervalFromDates(interval).weeks();

  return (
    <>
      <Header
        weeks={weeks}
        dayWidth={dayWidth}
        startDate={startDate}
        setStartDate={setStartDate}
        setDayWidth={setDayWidth}
      />
      {!loading &&
        data.items.map((project, index) => (
          <Project
            key={`${project.name}${index + 1}`}
            weeks={weeks}
            dayWidth={dayWidth}
            viewDate={startDate}
            project={project}
          />
        ))}
      <AddProject projects={projects} setProjects={setProjects} />
    </>
  );
}
