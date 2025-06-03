import './experience.css';
import { Col, Container, Tab, Row, Nav } from "react-bootstrap";
import { ExperienceCard } from "./cards/ExperienceCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import background from "../../assets/img/banner_home_bg.png";
import java from "../../assets/img/langJava.png";
import js from "../../assets/img/langJavascript.png";
import dart from "../../assets/img/langDart.png";
import swift from "../../assets/img/langSwift.png";
import ktn from "../../assets/img/langKotlin.png";
import php from "../../assets/img/langPhp.png";
import rn from "../../assets/img/langReactNative.png";
import projImg1 from "../../assets/img/agritech_lineWhite.png";
import projImg2 from "../../assets/img/developer_mobile_lineWhite.png";
import projImg3 from "../../assets/img/engineerSoftware_lineWhite.png";
import projImg4 from "../../assets/img/business_lineWhite.png";
import projImg5 from "../../assets/img/business.png";
import projImg6 from "../../assets/img/agritech.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';


export const Experience = () => {
    const techExperiences = [
        {
            title: "Mobile Native - iOS",
            description: "",
            imgUrl: swift
        },
        {
            title: "Mobile Native - Kotlin",
            description: "",
            imgUrl: ktn
        },
        {
            title: "Multiplataforma - Dart",
            description: "",
            imgUrl: dart
        },
        {
            title: "Multiplataforma - React Native",
            description: "",
            imgUrl: rn
        },
        {
            title: "FullStack - Java",
            description: "",
            imgUrl: java
        },
        {
            title: "FullStack - PHP",
            description: "",
            imgUrl: php
        },
        {
            title: "FullStack - JS",
            description: "",
            imgUrl: js
        }
    ];

    const agroExperiences = [
        {
            title: "Analista de dados - BI",
            description: "Atuei com o levantamento e análise de dados da safra nacional de feijão e internacional de outras pulses, como grão de bico, lentilha. ",
            imgUrl: projImg1
        },
        {
            title: "Geoprocessamento",
            description: "Tratamento de imagens georreferenciadas e produção de mapas temáticos das bacias do estado do Paraná. Ferramentas: gvSIG e o QGIS.",
            imgUrl: projImg1
        },
        {
            title: "Paisagismo",
            description: "Projetos paisagísticos em 3d, orçamentos, gestão de equipe de campo. Ferramenta: SketchUp.",
            imgUrl: projImg4
        },
        {
            title: "Assistente P&D",
            description: "Produção e pesquisa de plantas nativas com potencial ornamental, técnicas de propagação e substratos recomendados.",
            imgUrl: projImg4
        },
    ];

    const businessExperiences = [
        {
            title: "Analista de dados",
            description: "Atuei com o levantamento e análise de dados da safra nacional de feijão e internacional de outras pulses, como grão de bico, lentilha. Ferramentas: Excel, Power BI.",
            imgUrl: projImg3
        },
        {
            title: "Gestão de documentos",
            description: "Organização de documentos físicos e digitais",
            imgUrl: projImg4
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
                             <Col sx={12}>
                                <h2>Experiências</h2>
                            </Col>
                            <Row>
                                <Col sx={12}>
                                <Tab.Container id="experiences-tabs" defaultActiveKey="first" unmountOnExit={false}>
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
                                                <Col sx={12}>
                                                    <Row>
                                                    {
                                                        techExperiences.map((experience, index) => (
                                                            <ExperienceCard 
                                                            className="exp-card" 
                                                            key={index} 
                                                            {...experience} 
                                                            />
                                                        ))
                                                    }
                                                    </Row>
                                                </Col>
                                                <Col sx={4}>
                                                    <p> Iniciei como qualquer aspirante meu estudos voltados a entender as stacks, 
                                                        principalmente back-end e front-end web. Percebi não haver mais volta quando conheci o desenvolvimento mobile através do Kotlin, 
                                                        porém foi com o Swift que pude startar minha carreira, foi quando pude dizer, sou dev.
                                                        Desenvolver um produto digital vai além da escolha da linguagem, essa por si, é só uma etapa do processo produtivo,
                                                        a linguagem e/os frameworks devem ser escolhidos para atender a necessidade do projeto e este por si, deve, sobretudo atender de forma eficiente,
                                                        eficaz e segura as necessidades que o cliente procura no produto.
                                                    </p>
                                                </Col>
                                                                
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
                                </Col>
                            </Row>
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