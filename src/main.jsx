import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './App.css'
import router from "./router/Router"
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store'
import { ToastProvider } from './components/ToastProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
  </StrictMode>,
)
