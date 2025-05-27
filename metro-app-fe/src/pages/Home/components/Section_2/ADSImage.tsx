import React from 'react'
import { motion } from 'framer-motion';
import { CalendarClock, Landmark, Map, Ticket } from 'lucide-react';

export default function ADSImage() {
    return (
        <div>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className='flex'>
                <div className="grid grid-rows-2 gap-5">
                    <div className='grid grid-cols-2'>
                        <div className="bg-white w-60 h-60 lg:translate-y-20 
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg">
                            <div className='text-2xl font-bold'>TICKETING</div>
                            <Ticket size={100} className="text-teal-500" />
                        </div>
                        <div className=" w-60 h-60 bg-white lg:-translate-x-27 
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg">
                            <div className='text-2xl font-bold'>ROUTE MAP</div>
                            <Map size={100} className="text-orange-500" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 lg:pl-[255px] pb-10'>
                        <div className="w-60 h-60 bg-white lg:translate-x-1 lg:-translate-y-7
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg">
                            <div className='text-2xl font-bold'>STATIONS</div>
                            <Landmark size={100} className="text-teal-500" />
                        </div>
                        <div className="w-60 h-60 bg-white lg:-translate-y-20 lg:translate-x-6 
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg">
                            <div className='text-2xl font-bold'>SCHEDULE</div>
                            <CalendarClock size={100} className="text-orange-500" />
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    )
}
