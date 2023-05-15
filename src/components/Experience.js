import { Col, Container, Tab, Row, Nav } from "react-bootstrap";
import { ExperienceCard } from "./ExperienceCard";
import background from "../assets/img/banner_home_bg.png";
import projImg1 from "../assets/img/agritech.png";
import projImg2 from "../assets/img/developer.png";
import projImg3 from "../assets/img/agritech.png";
import projImg4 from "../assets/img/agritech.png";
import projImg5 from "../assets/img/business.png";
import projImg6 from "../assets/img/agritech.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';


export const Experience = () => {
    const experiences = [
        {
            title: "Desenvolvedora iOS",
            description: "Empresa: ZarpSystem<br> Projeto: S3Bank",
            imgUrl: projImg1
        },
        {
            title: "Desenvolvedora iOS",
            description: "Empresa: Selecionar<br> Projeto: SERASA",
            imgUrl: projImg2
        },
        {
            title: "Analista de dados",
            description: "Empresa: IBRAFE<br> Projeto: Produção e mercado de importação e exportação.",
            imgUrl: projImg3
        },
        {
            title: "Estágio em análise de geoprocessamento",
            description: "Empresa: EMATER<br> Projeto: Microbacias do Paraná",
            imgUrl: projImg4
        },
        {
            title: "Assistente de vendas",
            description: "Empresa: Grupo Esalflores<br> Projeto: Paisagismo",
            imgUrl: projImg5
        },
        {
            title: "OI",
            description: "HELLLOW",
            imgUrl: projImg6
        },
    ];
    return (
        <section className="experience" id="experience">
             <Container>
                <Row>
                    <Col size={12}>
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
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Row>
                                        {
                                            experiences.map((experience, index)=> {
                                                return (
                                                    <ExperienceCard
                                                    key={index}
                                                    {...experience}
                                                    />
                                                )
                                            })
                                        }
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">Second</Tab.Pane>
                                <Tab.Pane eventKey="third">Third</Tab.Pane>
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