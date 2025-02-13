import './skills.css';
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import skillsBg from '../../assets/img/banner_home.png';
import agritech from '../../assets/img/agritech_lineWhite.png';
import developerMobile from '../../assets/img/developer_mobile_lineWhite.png';
import engineer from '../../assets/img/engineerSoftware_lineWhite.png';
import business from '../../assets/img/business_lineWhite.png';
import esg from '../../assets/img/esg_lineWhite.png';

export const Projects = () => {
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
                        <h2>Projetos</h2>
                        <Carousel responsive={responsive} infinite={true} className="skill-slider">
                            <div className="item">
                            <p>Um pouco sobre atuar em uma fintech.</p>
                                <img src={agritech} alt="Image"/>
                                <h5>Agrônoma</h5>
                            </div>
                            <div className="item">
                            <p>Um pouco sobre atuar em uma healthcare.</p>
                                <img src={developerMobile} alt="Image"/>
                                <h5>Desenvolvedora Mobile</h5>
                            </div>
                            <div className="item">
                            <p>Um pouco sobre atuar em uma agritech.</p>
                                <img src={engineer} alt="Image"/>
                                <h5>Engenheira de Software</h5>
                            </div>
                            <div className="item">
                            <p>Um pouco sobre ...</p>
                                <img src={business} alt="Image"/>
                                <h5>Especialista em Negócios Digital</h5>
                            </div>
                            <div className="item">
                            <p>Um pouco sobre ....</p>
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