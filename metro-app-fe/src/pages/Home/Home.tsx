import Background from '../../components/Background'
import Title from './components/Section_1/Title'
import Carousel from './components/Section_1/Carousel'
import 'fullpage.js/dist/fullpage.min.css'
import ADS from './components/Section_2/ADS'
import ADSImage from './components/Section_2/ADSImage'
import MetroAdsCarousel from './components/Section_3/MetroAdsCarousel'
import AboutUsMetro from './components/Section_4/AboutUsMetro'
import CustomerTestimonials from './components/Section_5/CustomerTestimonials'

export default function Home() {
  return (
    <div className='flex flex-col gap-10'>
      <div className='relative'>
        <div className='absolute top-0 left-0 w-1/2 h-full -z-10'>
          <Background />
        </div>
        <div className='flex justify-center items-center lg:px-30'>
          <div className='lg:w-1/2 md:w-full flex md:justify-center'>
            <Title />
          </div>
          <div className='lg:w-1/2 md:w-0'>
            <Carousel />
          </div>
        </div>
      </div>
      <div>
        <div className='flex lg:flex-row justify-center lg:px-30 gap-10 pt-5 flex-col-reverse '>
          <div className='lg:w-1/3 w-full flex'>
            <ADS />
          </div>
          <div className='lg:w-2/3 w-full'>
            <ADSImage />
          </div>
        </div>
      </div>
      <div>
        <div className='lg:px-30'>
          <MetroAdsCarousel />
        </div>
      </div>
      <div>
        <AboutUsMetro />
      </div>
      <div>
        <CustomerTestimonials />
      </div>
    </div>
  )
}
