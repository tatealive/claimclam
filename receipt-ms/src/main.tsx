import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from '@heroui/toast'
import { router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
    <ToastProvider placement="bottom-center" maxVisibleToasts={2} />
      <RouterProvider router={router} />
    </HeroUIProvider>
  </React.StrictMode>,
)
