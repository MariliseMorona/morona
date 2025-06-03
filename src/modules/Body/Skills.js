import './skills.css';
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import agritech from '../../assets/img/agritech_lineWhite.png';
import engineer from '../../assets/img/engineerSoftware_lineWhite.png';
import business from '../../assets/img/business_lineWhite.png';
import esg from '../../assets/img/esg_lineWhite.png';
import amb from '../../assets/img/managerAmb_lineWhite.png';

export const Skills = () => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        }, 
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        }, 
        mobile: {
            breakpoint: { max: 242, min: 0 },
            items: 1
        }
    };
    return (
        <section className="skill" id="skills">
            <Container>
                <Row>
                    <Col>
                        <div className="skill-bx">
                            <h2>Formações</h2>
                            <p> Formada em MBA em Engenharia de Software pela UTFPR e MBA em Digital Business pela ESALQ/USP, 
                                desenvolvi uma visão ampla sobre a transformação digital em uma sociedade cada vez mais tecnológica. 
                                Acredito que, mais do que simplesmente criar novos produtos, é essencial construir soluções 
                                que inspirem confiança, garantam segurança, promovam eficiência e impulsionem a sustentabilidade.</p>
                            <Carousel responsive={responsive} infinite={true} className="skill-slider">
                                <div className="item">
                                    <img src={agritech} alt="Image"/>
                                    <h5>Agrônoma</h5>
                                </div>
                                <div className="item">
                                    <img src={engineer} alt="Image"/>
                                    <h5>Engenheira de Software</h5>
                                </div>
                                <div className="item">
                                    <img src={business} alt="Image"/>
                                    <h5>Especialista em Negócios Digitais</h5>
                                </div>
                                <div className="item">
                                    <img src={esg} alt="Image"/>
                                    <h5>Especialista em Economia Ambiental - ESG</h5>
                                </div>
                                <div className="item">
                                    <img src={amb} alt="Image"/>
                                    <h5>Gestora Ambiental</h5>
                                </div>
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}