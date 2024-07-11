import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  SignedInHeader,
  SignedOutHeader,
} from './components';
import {
  Landing,
  About,
  Signup,
  Login,
  TaskBoard,
  CreateTask,
  Profile,
  ConnectedPeople,
  AddTaskMaster,
  Requests,
  NotFound,
  SelfReflection,
} from './pages';

function App () {
  // returns true if user is not logged in, otherwise return false
  const redirectUnauthorized = () => {
    if (!localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><SignedOutHeader /><Landing /></>} />
        <Route path="/about" element={<><SignedOutHeader /><About /></>} />
        <Route path="/signup" element={<><Signup /></>} />
        <Route path="/login" element={<><SignedOutHeader /><Login /></>} />
        <Route path="/taskboard" element={<><SignedInHeader /><TaskBoard redirectUnauthorized={redirectUnauthorized} /></>}>
          <Route path=":userId" element={<></>} />
        </Route>
        <Route path="/create-task" element={<><SignedInHeader /><CreateTask redirectUnauthorized={redirectUnauthorized} /></>} />
        <Route path="/profile" element={<><SignedInHeader /><Profile redirectUnauthorized={redirectUnauthorized} /></>}>
          <Route path=":userId" element={<></>} />
        </Route>
        <Route path="/connected-taskmasters" element={<><SignedInHeader /><ConnectedPeople redirectUnauthorized={redirectUnauthorized} /></>} />
        <Route path="/add-taskmaster" element={<><SignedInHeader /><AddTaskMaster redirectUnauthorized={redirectUnauthorized} /></>} />
        <Route path="/connection-requests" element={<><SignedInHeader /><Requests redirectUnauthorized={redirectUnauthorized} /></>} />
        <Route path="/self-reflection" element={<><SignedInHeader /><SelfReflection redirectUnauthorized={redirectUnauthorized} /></>} />
        <Route path="*" element={<><NotFound /></>} />
      </Routes>

      {/* component that creates toasts throughout the entire app */}
      <Toaster
        position="top-center"
        reverseOrder={true}
        gutter={16}
        toastOptions={{
          className: '',
          style: {
            fontFamily: 'Roboto',
            fontWeight: 500,
            color: 'hsl(0, 0%, 0%)',
            padding: '14px',
          },
          success: {
            style: { border: '2px solid hsl(120, 60%, 67%)' },
          },
          error: {
            style: { border: '2px solid hsl(3, 100%, 69%)' },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
