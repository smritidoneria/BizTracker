"use client"
import React from 'react'
import NavbarAdmin from '../adminNavbar/page'
import UserCrudTable from './CrudTable'
// import UserAnalysis from './Analysis'
import SpecificUserAnalysis from './SpecificUserAnalysis'

const page = () => {
  return (
   <>
   <NavbarAdmin />
   <UserCrudTable />
   {/* <UserAnalysis /> */}
   <SpecificUserAnalysis />
   </>
  )
}

export default page