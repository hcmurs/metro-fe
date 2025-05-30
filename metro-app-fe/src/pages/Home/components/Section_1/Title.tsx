import { motion } from "framer-motion";
export default function Title() {
  return (
    <div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col gap-5"
      >
        <div className="lg:text-6xl md:text-4xl font-bold text-slate-800">
          <p>Metro HCMR</p>
          <p>Boost Your Day</p>
        </div>
        <div className="text-2xl text-slate-600">
          Start your journey smarter <br />
          Metro HCMR gets you there, faster.
        </div>
        <div>
          <button className="bg-slate-800 cursor-pointer text-white px-6 py-3 rounded-md hover:bg-[#0097a7] transition-colors duration-300">
            Get Started
          </button>
        </div>
      </motion.div>
    </div>
  );
}
