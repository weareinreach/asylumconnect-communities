import React from  'react'

import {Route,BrowserRouter } from 'react-router-dom'

import Login from '../screens/Login'
import Forum from  '../screens/Forum'
import MainPage from '../screens/MainPage'
import CreateForum from '../screens/CreateForum'
import Registration from '../screens/Registration'



const Routes =()=>(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={Login}/>
      <Route exact path="/Forum" component={Forum}/>
      <Route exact path="/Main" component={MainPage}/>

      <Route exact path = "/CreateForum" component ={CreateForum}/>
      <Route exact path = "/Registration" component ={Registration}/>

    </div>
  </BrowserRouter>
)

export default Routes
