import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NightSky from './modules/Animations/NightSky';
import AsteroidCursor from './modules/Animations/AsteroidCursor';
import { NavBar } from './modules/Header/NavBar';
import { Banner } from './modules/Body/Banner';
import { About } from './modules/Body/About';
import { Skills } from './modules/Body/Skills';
import { Experience } from './modules/Body/Experience';
import { Projects } from './modules/Body/Projects';
import { Footer } from './modules/Footer/Footer';


function App() {
  return (
    <div className="App">
      <NightSky />
      <NavBar />
      <Banner />
      <About />
      <Skills />
      <Experience/>
      <Projects/>
      <Footer/>
      <AsteroidCursor />
    </div>
  );
}

export default App;
