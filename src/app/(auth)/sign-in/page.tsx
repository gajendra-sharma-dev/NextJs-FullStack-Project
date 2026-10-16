'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import {z}  from "zod" 
import axios,{AxiosError} from 'axios'
import { Controller, useForm } from 
"react-hook-form"
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signupSchema } from '@/schema/signupSehema'
import { ApiResponse } from '@/types/ApiResponse'


function Signin() {
  const router = useRouter()
 const [username,setUsername] = useState('') 
 const [usernameMessage,setUsernameMessage] = useState("")
 const [isCheckingUsername,setCheckingUsername] = useState(false)
 const [isSubmitting,setSubmtting] = useState(false)
 const debounceUsername = useDebounceValue(username,300)
 const form = useForm({
  resolver:zodResolver(signupSchema),
  defaultValues:{
    username:"",
    email:"",
    password:""
  }
 })
 useEffect(()=>{
  const checkUsernameunique = async()=>{
    if(debounceUsername){
      setCheckingUsername(true)
      setUsernameMessage("")
      try{
 const response =  await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
  console.log(response);
  setUsernameMessage(response.data.message)
  

      }catch(error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage((axiosError.response?.data. message as string)?? "Error checking username")

      }
    }
  }
  checkUsernameunique()

 },[debounceUsername])

  return (
    <div>page</div>
  )
}

export default Signin