"use client"
import React from 'react'
import AdminSidebar from "../../components/Admin/sidebar/AdminSideBar";
import Heading from "../../../app/utils/Heading";
import CreatCourse from '../../components/Admin/Course/CreateCourse';
import DashboardHeader from '../../../app/components/Admin/DashboardHeader';
import CreateCourse from '../../components/Admin/Course/CreateCourse';

type Props = {}

const page = (props: Props) => {
  return (
      <div>
          <Heading
              title='Elearning- Admin'
              description='ELearning is platform for students to learn and get help from teachers'
              keywords='Programing, MERN, Redux, Machine Learning'
          />
          <div className="flex">
              <div className="1500px:w-[16%] w-1/5">
              <AdminSidebar/>
              </div>
              <div className='w-[85%]'>
                  <DashboardHeader />
                  <CreateCourse/>
                  
              </div>
          </div>
          
    </div>
  )
}

export default page