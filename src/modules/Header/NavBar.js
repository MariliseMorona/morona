import './header.css';
import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logoColor from '../../assets/img/logo_color.png';
import iconLinkedin from '../../assets/img/icon_linkedin.png';
import iconInstagram from '../../assets/img/icon_instagram.png';
import iconFacebook from '../../assets/img/icon_facebook.png';

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

    const getPersonalSocialPaddingStart = () => 5;

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
                        <Nav.Link href="#experience" className={activeLink === 'experience' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('experience')}>Experiências</Nav.Link>
                        <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projetos</Nav.Link>
                    </Nav>
                    <span className="navbar-text">
                        <div className="social-icon" style={{ paddingInlineStart: getPersonalSocialPaddingStart() }}>
                            <a
                                href="https://www.linkedin.com/in/marilise-morona/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                            >
                                <img src={iconLinkedin} alt="LinkedIn" />
                            </a>
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                            >
                                <img src={iconInstagram} alt="Instagram" />
                            </a>
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                            >
                                <img src={iconFacebook} alt="Facebook" />
                            </a>
                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                            >
                                <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                                    <path d="M12 0.5C5.73 0.5.75 5.64.75 12.02c0 5.11 3.2 9.45 7.64 10.98.56.1.77-.25.77-.55v-2.05c-3.11.69-3.77-1.53-3.77-1.53-.51-1.33-1.25-1.69-1.25-1.69-1.02-.71.08-.69.08-.69 1.13.08 1.72 1.18 1.72 1.18 1 .176 1.54 1.05 1.54 1.05.9 1.58 2.36 1.12 2.94.86.1-.67.35-1.12.64-1.38-2.48-.29-5.09-1.26-5.09-5.61 0-1.24.43-2.25 1.13-3.05-.11-.29-.49-1.46.11-3.04 0 0 .92-.3 3.02 1.17.88-.25 1.82-.37 2.76-.38.94.01 1.88.13 2.76.38 2.1-1.47 3.02-1.17 3.02-1.17.6 1.58.22 2.75.11 3.04.7.8 1.13 1.81 1.13 3.05 0 4.36-2.61 5.32-5.1 5.61.36.32.68.95.68 1.92v2.85c0 .3.2.66.78.55 4.43-1.53 7.63-5.87 7.63-10.98C23.25 5.64 18.27.5 12 .5z" />
                                </svg>
                            </a>
                        </div>
                        <button className="navbar-button" onClick={() => window.open('https://wa.me/5541988379881?text=Olá, gostaria de saber mais sobre seus serviços!')}><span>Contato</span></button>
                    </span>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
