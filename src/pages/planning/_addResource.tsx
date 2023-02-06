/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Project } from '@prisma/client';

type Props = {
  project: Project;
};

export function AddResource({ project }) {
  return (
    <div className="w-1/5">
      <input type="text" className="w-3/5" />
      <input type="button" value="Add" className="w-2/5" />
    </div>
  );
}
