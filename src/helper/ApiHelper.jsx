import 'dotenv/config';
import toast from 'react-hot-toast';

const backendUrl = 'https://tuesday-dyvr.onrender.com';

// general API call function
export async function makeAPICall(url, init) {
  try {
    const response = await fetch(url, init);
    if (response.ok) {
      const data = await response.json();
      toast.remove();
      return data;
    } else {
      await response.json().then((err) => {
        throw new Error(err.message, { cause: err.cause });
      });
    }
  } catch (error) {
    toast.error(error.message, { id: error.cause });
    throw new Error(error.message);
  }
}

////////////////////////////////////////// AUTH ROUTES //////////////////////////////////////////

// check if user registration details are valid
export async function registerCheck(
  firstName,
  lastName,
  weeklyWorkHours,
  email,
  password
) {
  const url = `${backendUrl}/auth/register/check`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      weekly_work_hours: weeklyWorkHours,
      email,
      password,
    }),
  };

  return makeAPICall(url, init);
}

// register a new user
export async function register(
  firstName,
  lastName,
  weeklyWorkHours,
  email,
  password,
  avatar
) {
  const url = `${backendUrl}/auth/register`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      weekly_work_hours: weeklyWorkHours,
      email,
      password,
      avatar,
    }),
  };

  return makeAPICall(url, init);
}

// login a user
export async function login(email, password) {
  const url = `${backendUrl}/auth/login`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };

  return makeAPICall(url, init);
}

// logout a user
export async function logout(token) {
  const url = `${backendUrl}/auth/logout`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

////////////////////////////////////////// TASK ROUTES //////////////////////////////////////////

// create a new task
export async function createTask(
  title,
  description,
  assigneeIds,
  deadline,
  hoursToComplete,
  priority,
  taskDependencies,
  token
) {
  const url = `${backendUrl}/task/create`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      title,
      description,
      assignee_ids: assigneeIds,
      deadline,
      hours_to_complete: hoursToComplete,
      priority,
      dependency_ids: taskDependencies,
    }),
  };

  return makeAPICall(url, init);
}

// update a task's status
export async function updateTaskStatus(status, taskId, token) {
  const url = `${backendUrl}/task/status`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      status,
      task_id: taskId,
    }),
  };

  return makeAPICall(url, init);
}

// update a task's priority
export async function updateTaskPriority(priority, taskId, token) {
  const url = `${backendUrl}/task/priority`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      priority,
      task_id: taskId,
    }),
  };

  return makeAPICall(url, init);
}

// get all the tasks
export async function getAllTasks(token) {
  const url = `${backendUrl}/task/alltasks`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// get tasks matching user's search query (e.g. id, task title, description or deadline)
export async function searchTasks(query, token, tasklistType) {
  const url = `${backendUrl}/task/search`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      search_query: query,
      tasklist_type: tasklistType,
    }),
  };

  return makeAPICall(url, init);
}

// get user's assigned tasks
export async function getAssignedTasks(token) {
  const url = `${backendUrl}/task/assignedtasks`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// edit an existing task
export async function editTask(
  taskId,
  title,
  description,
  assigneeIds,
  deadline,
  hoursToComplete,
  taskDependencies,
  token
) {
  const url = `${backendUrl}/task/edit`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      task_id: taskId,
      title,
      description,
      assignee_ids: assigneeIds,
      deadline,
      hours_to_complete: hoursToComplete,
      dependency_ids: taskDependencies,
    }),
  };

  return makeAPICall(url, init);
}

// get tasks sorted by their sortType (creation, deadline or priority)
// creation: get tasks sorted by last created
// deadline: get tasks sorted by deadline (earliest to latest deadline)
// priority: get tasks sorted by priority algorithm
export async function getSortedTasks(token, userId, tasklistType, sortType) {
  const url = `${backendUrl}/task/sort`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      target_id: userId,
      tasklist_type: tasklistType,
      sort_type: sortType,
    }),
  };

  return makeAPICall(url, init);
}

////////////////////////////////////////// USER ROUTES //////////////////////////////////////////

// get user's profile details
export async function getProfile(token) {
  const url = `${backendUrl}/user/profile/details`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// get user's avatar
export async function getAvatar(token) {
  const url = `${backendUrl}/user/profile/avatar`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// edit user's profile avatar and maximum weekly working hours
export async function editProfile(token, weeklyWorkHours, avatar) {
  const url = `${backendUrl}/user/edit`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      weekly_work_hours: weeklyWorkHours,
      avatar,
    }),
  };

  return makeAPICall(url, init);
}

// get all users
export async function getAllUsers(token) {
  const url = `${backendUrl}/user/allusers/details`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// get a list of the user's connected task masters including yourself
export async function getConnectedUsers(token) {
  const url = `${backendUrl}/user/connected/details`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// get connected user details after checks
export async function getAnyUserProfile(token, userId) {
  const url = `${backendUrl}/user/any/details`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  };

  return makeAPICall(url, init);
}

// get connected user tasks after checks
export async function getAnyUserTasks(token, userId) {
  const url = `${backendUrl}/user/any/tasks`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  };

  return makeAPICall(url, init);
}

// get user's report
export async function getReport(token) {
  const url = `${backendUrl}/user/report`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

////////////////////////////////////////// CONNECTION ROUTES //////////////////////////////////////////

// get a list of the user's connected task masters excluding yourself
export async function getConnectedTaskMasters(token) {
  const url = `${backendUrl}/connection/connected`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// user sends a connection request to another user by email
export async function sendConnectionRequest(token, email) {
  const url = `${backendUrl}/connection/requests/send`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      connection_email: email,
    }),
  };

  return makeAPICall(url, init);
}

// get the user's connection requests sent from other users
export async function getConnectionRequests(token) {
  const url = `${backendUrl}/connection/requests`;

  const init = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
  };

  return makeAPICall(url, init);
}

// accept a connection request
export async function acceptConnectionRequest(token, userId) {
  const url = `${backendUrl}/connection/requests/accept`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      accept_user_id: userId,
    }),
  };

  return makeAPICall(url, init);
}

// remove a task master from the user's list of connected task masters
export async function removeConnection(token, userId) {
  const url = `${backendUrl}/connection/unconnect`;

  const init = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      other_user_id: userId,
    }),
  };

  return makeAPICall(url, init);
}
