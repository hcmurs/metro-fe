import { useEffect, useRef } from 'react'
import Background from '../../components/Background'
import Title from './components/Section_1/Title'
import Carousel from './components/Section_1/Carousel'
import Fullpage from 'fullpage.js'
import 'fullpage.js/dist/fullpage.min.css'
import ADS from './components/Section_2/ADS'
import ADSImage from './components/Section_2/ADSImage'
import MetroAdsCarousel from './components/Section_3/MetroAdsCarousel'
import AboutUsMetro from './components/Section_4/AboutUsMetro'
import CustomerTestimonials from './components/Section_5/CustomerTestimonials'
import Footer from '../../components/Footer/Footer'

export default function Home() {
  const fullpageInstance = useRef<any>(null)

  useEffect(() => {
    fullpageInstance.current = new Fullpage('#fullpage', {
      autoScrolling: true,
      navigation: true,
      licenseKey: "null",
    })

    return () => {
      if (fullpageInstance.current && typeof fullpageInstance.current.destroy === 'function') {
        fullpageInstance.current.destroy('all')
      }
    }
  }, [])

  return (
    <div id='fullpage'>
      <div className='section'>
        <div className='absolute top-0 left-0 w-1/2 h-full -z-10'>
          <Background />
        </div>
        <div className='flex justify-center items-center px-30'>
          <div className='w-1/2 flex'>
            <Title />
          </div>
          <div className='w-1/2'>
            <Carousel />
          </div>
        </div>
      </div>
      <div className='section'>
        <div className='flex justify-center px-30 gap-10 pt-5 '>
          <div className='w-1/3 flex'>
            <ADS />
          </div>
          <div className='w-2/3'>
            <ADSImage />
          </div>
        </div>
      </div>
      <div className='section'>
        <div className='px-30'>
          <MetroAdsCarousel />
        </div>
      </div>
      <div className='section'>
        <AboutUsMetro />
      </div>
      <div className='section'>
        <CustomerTestimonials />
      </div>
      <div className='section'>
        <div className='max-h-screen'>
          <Footer />
        </div>
        
      </div>
    </div>
  )
}
