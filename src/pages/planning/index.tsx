import { useState } from 'react';
import { DateTime, Interval } from 'luxon';
import { intervalFromDates } from '../helpers/intervalFromDates';
import Header from './_header';
import Project from './_project';
import { AddProject } from './_addProject';
import { getProjects } from '../api/strapi';
import { useQuery } from '@tanstack/react-query';

import type { ProjectResult as ProjectResultType } from '../api/strapi';

export default function Planning() {
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('week'),
  );
  const [dayWidth, setDayWidth] = useState<number>(24);
  const [projects, setProjects] = useState<ProjectResultType>();
  const later = startDate.plus({ months: 4 }).endOf('week').endOf('day');
  const interval = Interval.fromDateTimes(startDate, later);

  const weeks = intervalFromDates(interval).weeks();

  const { isLoading } = useQuery(['projects'], getProjects, {
    onSuccess: (data) => {
      setProjects(data);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Header
        weeks={weeks}
        dayWidth={dayWidth}
        startDate={startDate}
        setStartDate={setStartDate}
        setDayWidth={setDayWidth}
      />
      {projects &&
        projects.data.map((project, index) => (
          <Project
            key={`${project.attributes.name}${index + 1}`}
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
