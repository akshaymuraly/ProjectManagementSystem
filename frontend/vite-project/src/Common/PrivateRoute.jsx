import React from 'react'
import { Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import { useSelector } from 'react-redux'


const PrivateRoute = () => {
    const loggedIn = useSelector(state=>state.user.userInfo.isLoggedIn)
  return loggedIn?<Dashboard/>:<Navigate to={"/"}/>
}

export default PrivateRoute