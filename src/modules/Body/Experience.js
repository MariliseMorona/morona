import './experience.css';
import { Col, Container, Tab, Row, Nav } from "react-bootstrap";
import { ExperienceCard } from "./cards/ExperienceCard";
import background from "../../assets/img/banner_home_bg.png";
import projImg1 from "../../assets/img/agritech.png";
import projImg2 from "../../assets/img/developer.png";
import projImg3 from "../../assets/img/agritech.png";
import projImg4 from "../../assets/img/agritech.png";
import projImg5 from "../../assets/img/business.png";
import projImg6 from "../../assets/img/agritech.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';


export const Experience = () => {
    const techExperiences = [
        {
            title: "Desenvolvedora iOS",
            description: "Empresa: Havan Labs Projeto: Super App",
            imgUrl: projImg6
        },
        {
            title: "Desenvolvedora iOS",
            description: "Empresa: ZarpSystem Projeto: S3Bank",
            imgUrl: projImg1
        },
        {
            title: "Desenvolvedora iOS",
            description: "Empresa: Selecionar Projeto: SERASA",
            imgUrl: projImg2
        },
        {
            title: "Analista de dados",
            description: "Empresa: IBRAFE Projeto: Produção e mercado de importação e exportação.",
            imgUrl: projImg3
        }
    ];

    const agroExperiences = [
        {
            title: "Analista de dados",
            description: "Empresa: IBRAFE Projeto: Produção e mercado de importação e exportação.",
            imgUrl: projImg3
        },
        {
            title: "Geoprocessamento",
            description: "Empresa: EMATER Projeto: Microbacias do Paraná",
            imgUrl: projImg4
        },
        {
            title: "Comercial",
            description: "Empresa: Grupo Esalflores Projeto: Paisagismo",
            imgUrl: projImg5
        }
    ];

    const businessExperiences = [
        {
            title: "Analista de dados",
            description: "Empresa: IBRAFE Projeto: Produção e mercado de importação e exportação.",
            imgUrl: projImg3
        },
        {
            title: "Comercial",
            description: "Empresa: Grupo Esalflores Projeto: Paisagismo",
            imgUrl: projImg5
        }
    ];

    return (
        <section className="experience" id="experience">
             <Container>
                <Row>
                    <Col sx={12}>
                        <TrackVisibility>
                        {({ isVisible }) => 
                        <div className={isVisible ? "animate_animated animate_fadeIn" : ""}>
                            <h2>Experiências</h2>
                            <p>Mussum Ipsum, cacilds vidis litro abertis. Manduma pindureta quium dia nois paga.Suco de cevadiss, é um leite divinis, qui tem lupuliz, matis, aguis e fermentis.Copo furadis é disculpa de bebadis, arcu quam euismod magna.Vehicula non. Ut sed ex eros. Vivamus sit amet nibh non tellus tristique interdum.</p>
                                <Tab.Container id="experiences-tabs" defaultActiveKey="first">
                                <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">Desenvolvimento</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Agronômia</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">Dados</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className="exp-col">
                                    <Tab.Pane eventKey="first">
                                        <Row>
                                            {
                                                techExperiences.map((experience, index)=> {
                                                    return (
                                                        <ExperienceCard
                                                        className="exp-card"
                                                        key={index}
                                                        {...experience}
                                                        />
                                                    )
                                                })
                                            }
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <Row>
                                            {
                                                agroExperiences.map((experience, index)=> {
                                                    return (
                                                        <ExperienceCard
                                                        className="exp-card"
                                                        key={index}
                                                        {...experience}
                                                        />
                                                    )
                                                })
                                            }
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                        <Row>
                                            {
                                                businessExperiences.map((experience, index)=> {
                                                    return (
                                                        <ExperienceCard
                                                        className="exp-card"
                                                        key={index}
                                                        {...experience}
                                                        />
                                                    )
                                                })
                                            }
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                        }
                        </TrackVisibility>
                    </Col>
                </Row>
             </Container>
             <img className="background-image" src={background}></img>
        </section>
    )
} 