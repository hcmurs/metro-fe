import { Circle } from 'lucide-react'
import React from 'react'
import type { UserType } from '../Type/UserType'

type Prop = {
  users: UserType[]
}
export default function UserDetail({users}: Prop) {
  return (
    <div className='flex flex-col gap-3'>
        {users.map(user => (
          <div key={user.user_id} className="bg-white rounded-[10px] p-3">
            <div className='flex w-full gap-2 items-center'>
              <div className='w-1/14'>
                <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS79bKDKktxtrYpKZy7bram5zhg9suqAb_Yjg&s`} alt="Avatar" className='w-10 h-10 rounded-full' />
              </div>
              <div className='w-4/14 flex flex-col gap-1'>
                <div className='text-[20px]'>
                  {user.username}
                </div>
                <div className='text-gray-500 text-[14px]'>
                  {user.email}
                </div>
              </div>
              {user.status === 'active' ? (
                <div className='w-2/14 text-black flex items-center gap-2'>
                  <Circle className='fill-green-500 text-green-500 flex size-[10px]' /> Active
                </div>
              ) : (
                <div className='w-2/14 text-black flex items-center gap-2'>
                  <Circle className='fill-red-500 text-red-500 flex size-[10px]' /> Banned
                </div>
              )}
              <div className='w-3/14'>
                {user.phone}
              </div>
              {user.role === 'admin' ? (
                <div className='w-2/14 '>
                  <div className='text-white bg-blue-500 w-22 flex justify-center items-center rounded-[4px]'>
                    Admin
                  </div>
                </div>
              ) : (
                <div className='w-2/14 text-green-500'>
                  <div className='text-white bg-green-500 w-22 flex justify-center items-center rounded-[4px]'>
                    Customer
                  </div>
                </div>
              )
              }

              <div className='w-2/14'>
                <button className='bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-400'>Edit</button>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
