import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logoColor from '../assets/img/logo_color.png';
import iconLinkedin from '../assets/img/icon_linkedin.png';
import iconInstagram from '../assets/img/icon_instagram.png';
import iconFacebook from '../assets/img/icon_facebook.png';

export const NavBar = () => {

    const [activeLink, setActiveLink] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [])

    const onUpdateActiveLink = (value) => {
        setActiveLink(value);
    }

    const autoOpenAlink = (url = ``) => {
        window.open(url, "open testing page in a same tab page");
      }

    return (
        <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
            <Container>
                <Navbar.Brand href="#home">
                    <img src={logoColor} alt="Logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Sobre</Nav.Link>
                        <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Formações</Nav.Link>
                        <Nav.Link href="#experience" className={activeLink === 'experience' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projetcs')}>Experiências</Nav.Link>
                        <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projetcs')}>Projetos</Nav.Link>
                    </Nav>
                    <span className="navbar-text">
                        <div className="social-icon">
                            <a href="#"><img src={iconLinkedin} alt="" target="_self" onClick= {() => autoOpenAlink('https://www.linkedin.com/in/marilise-morona/')}/></a>
                            <a href="#"><img src={iconInstagram} alt=""/></a>
                            <a href="#"><img src={iconFacebook} alt=""/></a>
                        </div>
                        <button className="vvd"><span>Contato</span></button>
                    </span>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}