import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import skillsBg from '../assets/img/banner_home.png';
import agritech from '../assets/img/agritech_lineWhite.png';
import developer from '../assets/img/developer_lineWhite.png';
import engineer from '../assets/img/engineerSoftware_lineWhite.png';
import business from '../assets/img/business_lineWhite.png';
import esg from '../assets/img/esg_lineWhite.png';

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
                        <p>Formada em Agronomia pela UFPR, ingressei no MBA em Digital Business 
                            para entender como poderia contribuir para uma transformação digital 
                            num mercado cada vez mais tecnológico. Hoje ingresso no MBA em 
                            Engenharia de Software pois compreendo que mais do que oferecer 
                            um produto tecnológico, precisamos construir uma solução que confira
                            confiança, seguridade, eficiência e sustentabilidade.</p>
                        <Carousel responsive={responsive} infinite={true} className="skill-slider">
                            <div className="item">
                                <img src={agritech} alt="Image"/>
                                <h5>Agrônoma</h5>
                            </div>
                            <div className="item">
                                <img src={developer} alt="Image"/>
                                <h5>Desenvolvedora Mobile</h5>
                            </div>
                            <div className="item">
                                <img src={engineer} alt="Image"/>
                                <h5>Engenheira de Software</h5>
                            </div>
                            <div className="item">
                                <img src={business} alt="Image"/>
                                <h5>Especialista em Negócios Digital</h5>
                            </div>
                            <div className="item">
                                <img src={esg} alt="Image"/>
                                <h5>Especialista em Economia e Gestão Ambiental</h5>
                            </div>
                        </Carousel>
                    </div>
                    </Col>
                </Row>
            </Container>
            {/*<img className="skillsBg" src={skillsBg} alt="Image" />*/}
        </section>
    )
}