'use client'
import React, { FC, useState } from 'react';
import Heading from './utils/Heading';
import Header from './components/Header'
import Hero from './components/Route/Hero';

interface props{ }

const Page: FC<props> = (props) => {

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login"); 
  return (
    <div>
      <Heading
        title='Elearning'
        description='This is Elon musk'
        keywords='MERN, Web Devloper, web devloper, Web'
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero/>

    </div>
  )
}
export default Page;
