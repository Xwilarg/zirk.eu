import { createRoot } from 'react-dom/client'
import MainForm from './MainForm'
import "../css/index.css"
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router'
import GameJamForm from './GameJamForm'
import { useEffect } from 'react'

function RedirectCompat()
{
    const { hash } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (hash === '#gamejam') {
        navigate('/gamejam', { replace: true })
        }
    }, [hash, navigate])

    return null
}

createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <RedirectCompat />
        <Routes>
            <Route path='/' element={<MainForm/>} />
            <Route path='/gamejam' element={<GameJamForm/>} />
        </Routes>
    </HashRouter>
)