import { useState } from 'react';
import { DateTime, Interval } from 'luxon';
import { intervalFromDates } from '../helpers/intervalFromDates';
import Header from './_header';
import Project from './_project';
import { AddProject } from './_addProject';
import { getProjects } from '../api/strapi';
import { useQuery } from '@tanstack/react-query';

import type { Project as ProjectType } from '../api/strapi';

export default function Planning() {
  const {
    isLoading,
    error,
    data: result,
  } = useQuery(['projects'], getProjects);

  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('week'),
  );
  const [dayWidth, setDayWidth] = useState<number>(24);
  const [projects, setProjects] = useState<ProjectType[]>();
  const later = startDate.plus({ months: 4 }).endOf('week').endOf('day');
  const interval = Interval.fromDateTimes(startDate, later);

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
      {!isLoading &&
        result.data.map((project, index) => (
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
