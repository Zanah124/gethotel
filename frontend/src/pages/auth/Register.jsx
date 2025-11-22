import React from 'react'
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className='flex flex-col items-center justify-center px-6 md:px-16 
    lg:px-24 xl:px-32 text-white bg-[url("/src/assets/acc.png")] bg-no-repeat bg-cover bg-center h-screen brightness-80'>
        <RegisterForm/>
    </div>
  )
}

export default Register