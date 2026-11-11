import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';import App from './App';import {ContentProvider} from './components/Content';import './index.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><ContentProvider><App/></ContentProvider></BrowserRouter>);
