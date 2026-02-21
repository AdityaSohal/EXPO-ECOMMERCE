import { SignIn } from '@clerk/clerk-react'
import React from 'react'

const LoginPage = () => {
  return (
    <div>
        <h1>login</h1>
        <SignIn/>
    </div>
  )
}

export default LoginPage