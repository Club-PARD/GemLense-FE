import React from 'react'
import { Route, Routes } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import HomePage from './pages/HomePage'
import RegisterPage1 from './pages/RegisterPage1'
import RegisterPage2 from './pages/RegisterPage2'
import RegisterPage3 from './pages/RegisterPage3'
import RegisterPage4 from './pages/RegisterPage4'
import RecruitingsPage from './pages/RecruitingsPage'
import LandPage from './pages/LandPage'
import DetailPage from './pages/DetailPage'
import MyPage from './pages/MyPage'
import Layout from './components/Layout'

const Routers = () => {
  return (
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/register/1" element={<RegisterPage1 />}/>
        <Route path="/register/2" element={<RegisterPage2 />}/>
        <Route path="/register/3" element={<RegisterPage3 />}/>
        <Route path="/register/4" element={<RegisterPage4 />}/>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/recruiting" element={<RecruitingsPage />}/>
          <Route path="/detail/:postId" element={<DetailPage />}/>
          <Route path="/mypage" element={<MyPage/>}/>
        </Route>
        <Route path="/land/:landId" element={<LandPage/>}/>
      </Routes>
  )
}

export default Routers;