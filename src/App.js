import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './components/NavBar';
import { Banner } from './components/Banner';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';


function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner/>
      <Skills />
      <Experience/>
    </div>
  );
}

export default App;
