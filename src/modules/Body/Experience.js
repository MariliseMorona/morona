import './experience.css';
import { Col, Container, Tab, Row, Nav } from "react-bootstrap";
import { ExperienceCard } from "./cards/ExperienceCard";
import FallingLeaf from "../Animations/FallingLeaf";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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
import qgis from "../../assets/img/qgis.png";
import gvsis from "../../assets/img/gvsig.png";
import sketchup from "../../assets/img/sketchup.png";
import plant from "../../assets/img/plant.png";
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
            title: "GVSIG",
            description: "",
            imgUrl: gvsis
        },
        {
            title: "QGIS",
            description: "",
            imgUrl: qgis
        },
        {
            title: "SketchUp",
            description: "",
            imgUrl: sketchup
        },
        {
            title: "Assistente P&D",
            description: "",
            imgUrl: plant
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
            <div className="banner-background">
                <Canvas style={{ width: "100%", height: "100%", pointerEvents: "none" }} camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ambientLight intensity={1} />
                    <directionalLight position={[5, 5, 5]} intensity={2} />
                    <FallingLeaf />
                    <EffectComposer>
                        <Bloom intensity={1.5} luminanceThreshold={0.2} />
                    </EffectComposer>
                </Canvas>
            </div>
             <Container>
                <Row>
                    <Col sx={12}>
                        <TrackVisibility>
                        {({ isVisible }) => 
                        <div className={isVisible ? "animate_animated animate_fadeIn" : ""}>
                             <Col sx={12} style={{ marginBottom: "8px" }}>
                                <h2>Experiências</h2>
                            </Col>
                            <Row style={{ paddingTop: 50 }}>
                                <Col sx={12}>
                                <Tab.Container id="experiences-tabs" defaultActiveKey="first" unmountOnExit={false}>
                                    <Nav variant="pills" className="nav-pills justify-content-center align-items-center" id="pills-tab" style={{ marginBottom: 0 }}>
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
                                            <Row style={{ paddingTop: 30 }}>
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
                                                <Col sx={4}>
                                                    <p> Tenho experiência no levantamento e análise de dados da safra nacional de feijão, além de culturas internacionais como grão-de-bico e lentilha, 
                                                        o que me proporcionou uma visão ampla do mercado agrícola. Também atuei no tratamento de imagens georreferenciadas e na produção de mapas temáticos 
                                                        das bacias do estado do Paraná, utilizando ferramentas como gvSIG e QGIS. No campo de projetos, desenvolvi soluções paisagísticas em 3D com o SketchUp, 
                                                        incluindo orçamentos e gestão de equipes em campo. Além disso, trabalhei como assistente de P&D, focando na produção e 
                                                        pesquisa de plantas nativas com potencial ornamental, explorando técnicas de propagação e recomendação de substratos adequados.
                                                    </p>
                                                </Col>    
                                                <Col sx={12}>
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
                                                </Col>
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
             {/* <img className="background-image" src={background}></img> */}
        </section>
    )
} 
