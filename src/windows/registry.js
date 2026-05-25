import AboutMe from './AboutMe';
import Projects from './Projects';
import Blog from './Blog';
import Resume from './Resume';
import Contact from './Contact';
import AdminPanel from './AdminPanel';
import PhotoViewer from './PhotoViewer';

// Valid route slugs that map to app modules
// The key is the URL path segment, the value is the appModule key
export const VALID_ROUTES = {
  'about-me': { appModule: 'about-me', icon: '📝' },
  'projects': { appModule: 'projects', icon: '📁' },
  'blog': { appModule: 'blog', icon: '🌐' },
  'resume': { appModule: 'resume', icon: '📄' },
  'contact': { appModule: 'contact', icon: '📧' },
  'admin': { appModule: 'admin', icon: '⚙️' },
  'gallery': { appModule: 'gallery', icon: '🖼️' },
};

export function getAppContent(moduleName) {
  switch (moduleName) {
    case 'about-me':
      return { title: 'LyanDoo.txt - Notepad', width: 520, height: 460, component: AboutMe };
    case 'projects':
      return { title: 'My Projects - Windows Explorer', width: 650, height: 450, component: Projects };
    case 'blog':
      return { title: 'Blog - Internet Explorer', width: 600, height: 480, component: Blog };
    case 'resume':
      return { title: 'Resume.doc - WordPad', width: 580, height: 520, component: Resume };
    case 'contact':
      return { title: 'Contact - Overlook Express', width: 500, height: 480, component: Contact };
    case 'admin':
      return { title: 'Administrative Tools', width: 720, height: 480, component: AdminPanel };
    case 'gallery':
      return { title: 'Windows Picture and Fax Viewer', width: 620, height: 500, component: PhotoViewer };
    default:
      return null;
  }
}

