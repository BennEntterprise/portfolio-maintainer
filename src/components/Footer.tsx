import { Settings as SettingsCog } from 'lucide-react'
import { toggleSettings } from '../redux/settingsSlice'
import { useDispatch } from 'react-redux'

export const Footer = () => {
  const dispatch = useDispatch()
  
  return(  
    <footer className='flex justify-end'>
      <SettingsCog onClick={() => dispatch(toggleSettings())}/>
    </footer>
  )
}