import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './modules/Header/NavBar';
import { Banner } from './modules/Body/Banner';
import { Skills } from './modules/Body/Skills';
import { Experience } from './modules/Body/Experience';
import { Projects } from './modules/Body/Projects';
import { Footer } from './modules/Footer/Footer';


function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner/>
      <Skills />
      <Experience/>
      <Projects/>
      <Footer/>
    </div>
  );
}

export default App;
