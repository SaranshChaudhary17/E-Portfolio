import {Link} from 'react-router-dom';import Seo from '../components/Seo';
export default function NotFound(){return <div className="wrap py-32"><Seo title="Not found"/><h1 className="display">404</h1><p className="text-mute mt-4">This page doesn't exist.</p><Link to="/" className="btn mt-8">Back Home</Link></div>}
