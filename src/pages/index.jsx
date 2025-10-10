import Layout from "./Layout.jsx";

import TranscriptionDetails from "./TranscriptionDetails";

import Dashboard from "./Dashboard";

import Upload from "./Upload";

import Library from "./Library";

import Analytics from "./Analytics";

import ContentStudio from "./ContentStudio";

import SearchHub from "./SearchHub";

import Teams from "./Teams";

import LiveMeeting from "./LiveMeeting";

import Integrations from "./Integrations";

import License from "./License";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    TranscriptionDetails: TranscriptionDetails,
    
    Dashboard: Dashboard,
    
    Upload: Upload,
    
    Library: Library,
    
    Analytics: Analytics,
    
    ContentStudio: ContentStudio,
    
    SearchHub: SearchHub,
    
    Teams: Teams,
    
    LiveMeeting: LiveMeeting,
    
    Integrations: Integrations,
    
    License: License,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<TranscriptionDetails />} />
                
                
                <Route path="/TranscriptionDetails" element={<TranscriptionDetails />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Upload" element={<Upload />} />
                
                <Route path="/Library" element={<Library />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/ContentStudio" element={<ContentStudio />} />
                
                <Route path="/SearchHub" element={<SearchHub />} />
                
                <Route path="/Teams" element={<Teams />} />
                
                <Route path="/LiveMeeting" element={<LiveMeeting />} />
                
                <Route path="/Integrations" element={<Integrations />} />
                
                <Route path="/License" element={<License />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}