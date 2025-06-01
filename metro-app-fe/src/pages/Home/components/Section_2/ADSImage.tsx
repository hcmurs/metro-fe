import { motion } from "framer-motion";
import { CalendarClock, Landmark, Map, Ticket } from "lucide-react";

export default function ADSImage() {
  return (
    <div className="xl:w-[750px]">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex justify-center"
      >
        <div className="grid grid-rows-2 xl:gap-5 lg:gap-0">
          <div className="grid grid-cols-2 gap-10 lg:gap-0">
            <div
              className="bg-white lg:w-60 lg:h-60 w-40 h-40 sm:w-50 sm:h-50 xl:translate-y-20
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg"
            >
              <div className="text-2xl font-bold">TICKETING</div>
              <Ticket size={100} className="text-teal-500" />
            </div>
            <div
              className=" lg:w-60 lg:h-60 w-40 h-40 sm:w-50 sm:h-50 bg-white xl:-translate-x-27 lg:translate-x-5 
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg"
            >
              <div className="text-2xl font-bold">ROUTE MAP</div>
              <Map size={100} className="text-orange-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 xl:pl-[255px] pb-10 gap-10 lg:gap-0">
            <div
              className="lg:w-60 lg:h-60 w-40 h-40 sm:w-50 sm:h-50 bg-white xl:translate-x-1 xl:-translate-y-7 lg:translate-y-0
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg"
            >
              <div className="text-2xl font-bold">STATIONS</div>
              <Landmark size={100} className="text-teal-500" />
            </div>
            <div
              className="lg:w-60 lg:h-60 w-40 h-40 sm:w-50 sm:h-50 bg-white xl:-translate-y-20 xl:translate-x-6 lg:translate-x-5
                        shadow-[0_10px_30px_rgba(0,0,0,0.7)]
                        flex flex-col items-center justify-center rounded-lg"
            >
              <div className="text-2xl font-bold">SCHEDULE</div>
              <CalendarClock size={100} className="text-orange-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
