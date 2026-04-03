import { createRoot } from 'react-dom/client'
import MainForm from './MainForm'
import "../css/index.css"
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router'
import GameJamForm from './GameJamForm'
import { useEffect } from 'react'
import InfoForm from './InfoForm'
import SecretQuoteForm from './SecretQuoteForm'
import { getNavigationNoHook } from './utils'
import LifelineForm from './LifelineForm'
import KatsisForm from './KatsisForm'
import OCForm from './OCForm'
import ProjectForm from './ProjectForm'
import NotFoundForm from './NotFoundForm'
import BoxForm from './BoxForm'
import LoreForm from './LoreForm'
import StoryForm from './StoryForm'

function RedirectCompat()
{
    const { hash } = useLocation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (hash === '#gamejam') {
            navigate(getNavigationNoHook("/gamejam", searchParams), { replace: true })
        }
    }, [hash, navigate])

    return null
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <RedirectCompat />
        <Routes>
            <Route path='*' element={<NotFoundForm />} />
            <Route path='/' element={<MainForm/>} />
            <Route path='/gamejam' element={<GameJamForm/>} />
            <Route path='/info' element={<InfoForm />} />
            <Route path='/life' element={<LifelineForm />} />
            <Route path='/katsis' element={<KatsisForm />} />
            <Route path='/oc' element={<OCForm />} />
            <Route path='/lore' element={<LoreForm />} />
            <Route path='/project' element={<ProjectForm />} />
            <Route path='/box' element={<BoxForm />} />
            <Route path='/story' element={<StoryForm />} />
            <Route path='/secret/quote' element={<SecretQuoteForm />} />
        </Routes>
    </BrowserRouter>
)