import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/courses'
import Login from './components/pages/Login'
import Register from './components/pages/Register';
import MyCourses from './components/pages/account/MyCourses'
import WatchCourse from './components/pages/account/WatchCourse'
import MyLearning from './components/pages/account/MyLearning'
import ChangePassword from './components/pages/account/ChangePassword';
import Detail from './components/pages/Detail'
import { RequireAuth } from './components/common/RequireAuth'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import Dashboard from './components/pages/account/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditCourse from './components/pages/account/courses/EditCourse';
import EditLesson from './components/pages/account/courses/EditLesson';

import Profile from './components/pages/account/Profile';
import StudentProgress from './components/pages/account/StudentProgress';
import AdminReviews from './components/pages/account/AdminReviews';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />
          
          <Route path='/account/profile' element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
          <Route path='/account/my-courses' element={
            <RequireAuth>
              <MyCourses />
            </RequireAuth>
          } />
          <Route path='/account/my-learning' element={
            <RequireAuth>
              <MyLearning />
            </RequireAuth>
          } />
          <Route path='/account/watch-course/:id' element={
            <RequireAuth>
              <WatchCourse />
            </RequireAuth>
          } />
          <Route path='/account/change-password' element={
            <RequireAuth>
              <ChangePassword />
            </RequireAuth>
          } />

          <Route path='/account/dashboard' element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />

          <Route path='/account/student-progress' element={
            <RequireAuth>
              <StudentProgress />
            </RequireAuth>
          } />

          <Route path='/account/reviews' element={
            <RequireAuth>
              <AdminReviews />
            </RequireAuth>
          } />

          <Route path='/account/courses/create' element={
            <RequireAuth>
              <CreateCourse />
            </RequireAuth>
          } />
          <Route path='/account/courses/edit/:id' element={
            <RequireAuth>
              <EditCourse />
            </RequireAuth>
          } />
          <Route path='/account/courses/lessons/edit/:id' element={
            <RequireAuth>
              <EditLesson />
            </RequireAuth>
          } />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App
