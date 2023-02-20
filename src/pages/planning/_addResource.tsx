/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Project, ProjectResource, Resource } from '@prisma/client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getResources, createProjectResources } from '../api/strapi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
  project: Project;
};

export function AddResource({ project }: Props) {
  const [selected, setSelected] = useState<Resource>();
  const [resources, setResources] = useState<Resource[]>([]);
  const queryClient = useQueryClient();

  const { loading: resourceLoading } = useQuery(
    ['resources'],
    () => getResources(),
    {
      onSuccess: (data) => {
        setResources(data.data);
      },
    },
  );

  const createMutation = useMutation({
    mutationFn: (data) => createProjectResources(data),
  });

  const handleSelected = (selected: Resource) => {
    setSelected(null);
    createMutation.mutate(
      { data: { project: project.id, resource: selected.id } },
      {
        onSuccess: () => {
          toast.success('Tilføjede medarbejer til projektet');
          queryClient.refetchQueries(['projectResources', project.id]);
        },
      },
    );
  };

  if (resourceLoading) return <p>Loading...</p>;
  return (
    <div className="flex flex-row hover:bg-zinc-100">
      <div className="w-1/5 p-2 border-r-4">
        <Select
          options={resources}
          isSearchable={true}
          isClearable={true}
          getOptionLabel={(option) => option.attributes.name}
          className={'rounded-none'}
          value={selected}
          placeholder={'Vælg medarbejder'}
          getOptionValue={(option) => option.id}
          onChange={(selected) => handleSelected(selected)}
          styles={{
            // Fixes the overlapping problem of the component
            menu: (provided) => ({ ...provided, zIndex: 9999, marginTop: -0 }),
          }}
        />
      </div>
      <div className="w-4/5 p-2 border-r-4 bg-slate-100"></div>
    </div>
  );
}
