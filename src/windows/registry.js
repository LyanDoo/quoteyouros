import AboutMe from './AboutMe';
import Projects from './Projects';
import Blog from './Blog';
import Resume from './Resume';
import Contact from './Contact';

export function getAppContent(moduleName) {
  switch (moduleName) {
    case 'about-me':
      return { title: 'About Me.txt - Notepad', width: 520, height: 460, component: AboutMe };
    case 'projects':
      return { title: 'My Projects - Windows Explorer', width: 650, height: 450, component: Projects };
    case 'blog':
      return { title: 'Blog - Internet Explorer', width: 600, height: 480, component: Blog };
    case 'resume':
      return { title: 'Resume.doc - WordPad', width: 580, height: 520, component: Resume };
    case 'contact':
      return { title: 'Contact - Outlook Express', width: 500, height: 480, component: Contact };
    default:
      return null;
  }
}
