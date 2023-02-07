/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Project, ProjectResource, Resource } from '@prisma/client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { number } from 'zod';
import { toast } from 'react-toastify';
import { trpc } from '~/utils/trpc';

type Props = {
  project: Project;
};

export function AddResource({ project }: Props) {
  const [selected, setSelected] = useState<Resource>();
  const [resources, setResources] = useState<Resource[]>([]);

  const { loading: resourceLoading } = trpc.resource.list.useQuery(
    {},
    {
      onSuccess(data) {
        setResources(data.items);
      },
    },
  );
  const mutation = trpc.projectResource.add.useMutation();
  const utils = trpc.useContext();

  const handleSelected = (selected: Resource) => {
    setSelected(null);
    mutation.mutate(
      { projectId: project.id, resourceId: selected.id },
      {
        onSuccess: () => {
          utils.projectResource.list.refetch({ projectId: project.id });
          toast.success('Tilføjede medarbejer til projektet');
        },
        onError: () => {
          toast('Wow so easy!');
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
          getOptionLabel={(option) => option.name}
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
