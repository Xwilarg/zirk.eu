import { createRoot } from 'react-dom/client'
import MainForm from './MainForm'
import "../css/index.css"
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import GameJamForm from './GameJamForm'
import { useEffect } from 'react'
import InfoForm from './InfoForm'
import SecretQuoteForm from './SecretQuoteForm'
import { getNavigation } from './utils'

function RedirectCompat()
{
    const { hash } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (hash === '#gamejam') {
            navigate(getNavigation("/gamejam"), { replace: true })
        }
    }, [hash, navigate])

    return null
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <RedirectCompat />
        <Routes>
            <Route path='/' element={<MainForm/>} />
            <Route path='/gamejam' element={<GameJamForm/>} />
            <Route path='/info' element={<InfoForm />} />
            <Route path='/secret/quote' element={<SecretQuoteForm />} />
        </Routes>
    </BrowserRouter>
)