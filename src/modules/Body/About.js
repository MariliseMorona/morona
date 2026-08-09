import './about.css';
import { Col, Container, Row } from "react-bootstrap";
import aboutProfile from '../../assets/img/about_profile.jpg';

export const About = () => {
    return (
        <section className="about" id="about">
            <Container className="about-content">
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={6} className="about-img-col">
                        <div className="about-img-wrap">
                            <img src={aboutProfile} alt="Marilise Morona" className="about-img" />
                        </div>
                    </Col>
                    <Col xs={12} md={6} xl={6}>
                        <h2 className="tagline">Software Engineer focused on iOS, Spatial Computing & Digital Transformation</h2>
                        <p> I build software experiences that connect technology, data and the physical world.
                        With a background in both Agronomy and Software Engineering, I bring a multidisciplinary 
                        perspective to complex problems — from mobile applications and digital products to AR/VR, 3D and spatial computing.
                        I turn complex ideas into practical, scalable digital experiences.
                        I build software experiences that connect technology, data My career sits at the intersection of science, technology and innovation.
                        I started in Agronomy, where I developed a strong foundation in analytical thinking and real-world problem solving. I later moved 
                        into Software Engineering, combining that scientific perspective with technology to build digital solutions.
                        Today, I work primarily with iOS development while exploring the next generation of computing through AR/VR, 3D and spatial experiences.
                        This multidisciplinary background allows me to approach technology not only from an engineering perspective, but also from the perspective 
                        of the problem it is meant to solve.</p>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}