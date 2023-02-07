/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { DateTime } from 'luxon';
import { FormEvent, useState } from 'react';
import { trpc } from '~/utils/trpc';
import { toast } from 'react-toastify';

export function AddProject(props) {
  const [showProjectAdd, setShowProjectAdd] = useState<boolean>(false);
  function toggleProjectAdd(value: boolean) {
    setShowProjectAdd(value);
  }

  const utils = trpc.useContext();
  const mutation = trpc.project.add.useMutation();
  const createProject = (newProject) => {
    mutation.mutate(
      { ...newProject },
      {
        onError: () => {
          toast.error('Error');
        },
        onSuccess: () => {
          toast.success('Tilføjede et nyt projekt');
          utils.project.list.refetch();
        },
      },
    );
  };

  function onSubmitHandler(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const duration_in_days = ev.target.elements.duration_in_days.value;
    const startDate = DateTime.fromFormat(
      ev.target.elements.date.value,
      'yyyy-m-d',
    );
    const endDate = startDate.plus({ days: duration_in_days });
    const name = ev.target.elements.project_name.value;

    const newProject = {
      name: name,
      startIntervals: {
        startDate: startDate.toMillis(),
        endDate: endDate.toMillis(),
      },
    };

    createProject(newProject);
    setShowProjectAdd(false);
  }

  return (
    <>
      <div className="relative">
        {showProjectAdd && (
          <div className="absolute top-0 left-10">
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={(ev) => onSubmitHandler(ev)}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="project_name"
                >
                  Projekt navn
                </label>
                <input
                  name="project_name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="project_name"
                  type="text"
                  placeholder="Projekt navn"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="duration_in_days"
                >
                  Længde i dage
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="duration_in_days"
                  type="number"
                  placeholder="Længde i dage"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="duration_in_days"
                >
                  Start dato
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="date"
                  type="date"
                  placeholder="Længde i dage"
                  pattern="\d{4}-\d{2}-\d{2}"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Opret
                </button>

                <button
                  onClick={() => toggleProjectAdd(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Afbryd
                </button>
              </div>
            </form>
          </div>
        )}

        <button onClick={() => toggleProjectAdd(true)}>Tilføj projekt</button>
      </div>
    </>
  );
}
