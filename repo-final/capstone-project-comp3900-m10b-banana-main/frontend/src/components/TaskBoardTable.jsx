import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Task from './Task';

function TaskBoardTable({ allTasks }) {
  return (
    <Box sx={{ m: { xs: '15px 20px 40px', md: '10px 80px 80px' } }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 550 }} aria-label="simple table">
          {/* taskboard table headings */}
          <TableHead>
            <TableRow sx={{ bgcolor: 'secondary.light' }}>
              <TableCell>Title</TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Assignee</TableCell>
            </TableRow>
          </TableHead>

          {/* taskboard table body/tasks */}
          <TableBody>
            {allTasks.map((task, index) => (
              <Task key={index} task={task}></Task>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TaskBoardTable;
