import { useEffect, useRef } from 'react'
import Background from '../../components/Background'
import Title from './components/Section_1/Title'
import Carousel from './components/Section_1/Carousel'
import Fullpage from 'fullpage.js'
import 'fullpage.js/dist/fullpage.min.css'
import ADS from './components/Section_2/ADS'
import ADSImage from './components/Section_2/ADSImage'

export default function Home() {
  const fullpageInstance = useRef<any>(null)

  useEffect(() => {
    fullpageInstance.current = new Fullpage('#fullpage', {
      autoScrolling: true,
      navigation: true,
      licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
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
        <div className='flex justify-center items-center px-20'>
          <div className='w-1/2 flex'>
            <Title />
          </div>
          <div className='w-1/2'>
            <Carousel />
          </div>
        </div>
      </div>
      <div className='section'>
        <div className='flex justify-center h-170 p-20 gap-10 '>
          <div className='w-1/3 flex'>
            <ADS />
          </div>
          <div className='w-2/3'>
            <ADSImage />
          </div>
        </div>
      </div>
      <div className='section'>
        section 3
      </div>
      <div className='section'>
        section 4
      </div>
      {/* <div className='section'>
        section 5
      </div> */}
    </div>
  )
}
