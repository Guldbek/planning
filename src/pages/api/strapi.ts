export const getProjects = async () => {
  const res = await fetch('http://localhost:1337/api/projects', {
    headers: {
      Authorization:
        'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
    },
  });
  return res.json();
};

export const getProjectStartIntervals = async (projectId: number) => {
  const res = await fetch(
    `http://localhost:1337/api/project-start-intervals?filters[project][id][$eq]=${projectId}`,
    {
      headers: {
        Authorization:
          'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
      },
    },
  );
  return res.json();
};
export const getResourceStartIntervals = async (projectResourceId: number) => {
  const res = await fetch(
    `http://localhost:1337/api/resource-start-intervals?filters[project_resource][id][$eq]=${projectResourceId}`,
    {
      headers: {
        Authorization:
          'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
      },
    },
  );
  return res.json();
};

export const createResourceStartIntervals = async (data) => {
  const res = await fetch(`http://localhost:1337/api/resource-start-intervals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateResourceStartIntervals = async (data) => {
  const res = await fetch(
    `http://localhost:1337/api/resource-start-intervals/${data.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
      },
      body: JSON.stringify(data),
    },
  );
  return res.json();
};


export const createProjectStartIntervals = async (data) => {
  const res = await fetch(`http://localhost:1337/api/project-start-intervals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateProjectStartIntervals = async (data) => {
  const res = await fetch(
    `http://localhost:1337/api/project-start-intervals/${data.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
      },
      body: JSON.stringify(data),
    },
  );
  return res.json();
};

export const getResources = async () => {
  const res = await fetch(`http://localhost:1337/api/resources`, {
    headers: {
      Authorization:
        'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
    },
  });
  return res.json();
};

export const getProjectResources = async (projectId: number) => {
  const res = await fetch(
    `http://localhost:1337/api/project-resources?filters[project][id][$eq]=${projectId}&populate=resource`,
    {
      headers: {
        Authorization:
          'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
      },
    },
  );
  return res.json();
};

export const createProjectResources = async (data) => {
  const res = await fetch(
    `http://localhost:1337/api/project-resources?populate=resource`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer d2cde11a6ebc82425b230da01fda186b93ce0d79c5555f034044a3f48b803d2f82f9ac61d1f37261c79b30c21bb86ab21ba502f73d16dee204074e3acb0b7502d78d2297c1ad4dc0fcd3242103ddcf9420269c083190107c6b30455f1b52dae3712c3120dcc71ca19447383bdcc261464240ccc77e52cc02b1604f16c242d871',
      },
      body: JSON.stringify(data),
    },
  );
  return res.json();
};

