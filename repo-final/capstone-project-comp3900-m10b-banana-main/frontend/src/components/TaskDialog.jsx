import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { SelectAssigneeDropdown, TaskDependencyDropdown } from '../components';
import { editTask } from '../helper/ApiHelper';

function TaskDialog(props) {
  const { task, canEdit, isOpen, handleClose } = props;

  // state variables to store dialog field values
  const [title, setTitle] = useState(task['title']);
  const [description, setDescription] = useState(task['description']);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState(task['assignee_ids']);
  const [deadline, setDeadline] = useState(task['deadline']);
  const [hoursToComplete, setHoursToComplete] = useState(task['hours_to_complete']);
  const [taskDependencies, setTaskDependencies] = useState(task['dependency_ids']);

  // fields are disabled when editMode is false
  // fields are enabled when editMode is true
  const [editMode, setEditMode] = useState(false);

  // when dialog is closed without saving changes, reset fields to their default values
  const handleOnClose = () => {
    setTitle(task['title']);
    setDescription(task['description']);
    setSelectedAssigneeIds(task['assignee_ids']);
    setDeadline(task['deadline']);
    setHoursToComplete(task['hours_to_complete'])
    setTaskDependencies(task['dependency_ids'])
    setEditMode(false);
    handleClose();
  };

  // when Edit button is clicked, enable edit mode
  const handleToEdit = () => {
    if (canEdit) {
      setEditMode(true);
    }
  };

  // send request to backend to update the task with its new changes
  const handleEditTask = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const utcDeadline = deadline ? new Date(deadline).toISOString() : deadline;
    editTask(task['task_id'], title, description, selectedAssigneeIds, utcDeadline, hoursToComplete, taskDependencies, token)
      .then(() => {
        setEditMode(false);
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // format the backend deadline so that the date picker on the frontend can read it 
  const formatDialogDeadline = (deadline) => {
    if (deadline === '') {
      return deadline;
    }

    const timeNotFormated = new Date(deadline);
    const year = timeNotFormated.getFullYear();
    const month = (timeNotFormated.getMonth() + 1).toString().padStart(2, '0');
    const day = timeNotFormated.getDate().toString().padStart(2, '0');
    const hours = timeNotFormated.getHours().toString().padStart(2, '0');
    const minutes = timeNotFormated.getMinutes().toString().padStart(2, '0');

    const localTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    return localTime;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleOnClose}
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="task-dialog-title"
      aria-describedby="task-dialog-details"
    >
      <DialogTitle
        id="task-dialog-title"
        sx={{ fontSize: 22, fontWeight: '500' }}
      >
        Task ID {task['task_id']}
      </DialogTitle>
      <DialogContent id="task-dialog-details">
        <TextField
          fullWidth
          required
          disabled={!editMode}
          defaultValue={task['title']}
          label="Title"
          onClick={handleToEdit}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          required
          disabled={!editMode}
          defaultValue={task['description']}
          label="Description"
          multiline={true}
          rows={6}
          onClick={handleToEdit}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
        {editMode ? (
          <SelectAssigneeDropdown
            selectedAssigneeIds={selectedAssigneeIds}
            setSelectedAssigneeIds={setSelectedAssigneeIds}
          />
        ) : (
          <TextField
            fullWidth
            disabled={!editMode}
            defaultValue={task['assignee_names'].length ? task['assignee_names'].join(', ') : 'This task has no assignees.'}
            label="Assignee(s)"
            multiline={true}
            onClick={handleToEdit}
            sx={{ mt: 2 }}
          />
        )}
        <TextField
          disabled={!editMode}
          defaultValue={formatDialogDeadline(task['deadline'])}
          label="Deadline"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          onClick={handleToEdit}
          onChange={(e) => setDeadline(e.target.value)}
          sx={{ width: 300, mt: 2 }}
        />
        <TextField
          required
          disabled={!editMode}
          type="number"
          defaultValue={task['hours_to_complete']}
          label="Hours To Complete"
          onClick={handleToEdit}
          onChange={(e) => setHoursToComplete(e.target.value)}
          sx={{ width: 150, mt: 2, ml: 2 }}
        />
        {editMode ? (
          <TaskDependencyDropdown
            taskDependencies={taskDependencies}
            setTaskDependencies={setTaskDependencies}
          />
        ) : (
          <TextField
            fullWidth
            disabled={!editMode}
            defaultValue={task['dependency_titles'].length ? task['dependency_titles'].join(', ') : 'This task has no dependencies.'}
            label="Task Dependencies"
            multiline={true}
            onClick={handleToEdit}
            sx={{ mt: 2 }}
          />
        )}

      </DialogContent>
      <DialogActions sx={{ mb: 2 }}>
        {editMode ? (
          <>
            <Button onClick={handleOnClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleEditTask}
              autoFocus
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} variant="outlined" color="primary">
              Cancel
            </Button>
            <Button
              disabled={!canEdit}
              onClick={handleToEdit}
              autoFocus
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              Edit
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default TaskDialog;
