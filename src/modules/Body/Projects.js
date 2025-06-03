import './projects.css';
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
            breakpoint: { max: 4000, min: 3001 },
            items: 4
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 2
        }, 
        tablet: {
            breakpoint: { max: 1024, min: 465 },
            items: 2
        }, 
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <section className="project" id="projects">
            <Container>
                <Row>
                    <Col>
                    <div className="project-bx">
                        <h2>Projetos</h2>
                        <Carousel responsive={responsive} infinite={true} className="project-slider">
                            <div className="item">
                                <p>
                                    Como desenvolvedora atuei em dois produtos financeiros, acompanhando tambem o desenvolvimento do projeto em Android (Kotlin), desevolvi habilidades 
                                    relacionadas as arquiteturas VIPER e MVVM, white-label, autenticação multifator (OAuth), modularização e gestão de SDK<br />
                                    <span style={{ textIndent: '1.5em', display: 'inline-block' }}>
                                    Além atuar em toda a esteira de produção do aplicativo desde a entrada de um novo cliente via implantação da label até a distribuição em loja e 
                                    versionamentos.
                                    </span><br/>
                                </p>
                                {/* <img src={agritech} alt="Image"/> */}
                                <h5>Fintech</h5>
                            </div>
                            <div className="item">
                                <p>
                                    Como desenvolvedora, atuei em dois produtos nas áreas de saúde e odontologia, focados em soluções digitais para melhorar a experiência do paciente
                                    e integrar informações clínicas com segurança.<br />
                                    <span style={{ textIndent: '1.5em', display: 'inline-block' }}>
                                    Aprofundei meus conhecimentos em Swift, arquitetura MVVM, APIs REST, Core Data e boas práticas de UX/UI com foco em acessibilidade (WCAG 2.2).
                                    </span><br/>
                                    <span style={{ textIndent: '1.5em', display: 'inline-block' }}>
                                    Também trabalhei com criptografia de dados e conformidade com a LGPD.
                                    </span>
                                </p>
                                {/* <img src={developerMobile} alt="Image"/> */}
                                <h5>Healthcare</h5>
                            </div>
                            <div className="item">
                            <p>Atuo como engenheira de software no desenvolvimento de um ERP, participei ativamente da definição de requisitos de negócio, arquitetura da aplicação, 
                                planejamento de infraestrutura, modelagem e administração de banco de dados, além do desenvolvimento de back-end.<br />
                                <span style={{ textIndent: '1.5em', display: 'inline-block' }}>
                                Aprofundei meus conhecimentos em tecnologias server-side, design de sistemas escaláveis, integração de serviços, segurança e performance.
                                </span><br/>
                                </p>
                                {/* <img src={engineer} alt="Image"/> */}
                                <h5>ERP - Saas</h5>
                            </div>
                            <div className="item">
                            <p>Um pouco sobre ...</p>
                                {/* <img src={business} alt="Image"/> */}
                                <h5>Especialista em Negócios Digital</h5>
                            </div>
                            <div className="item">
                            <p>Um pouco sobre ....</p>
                                {/* <img src={esg} alt="Image"/> */}
                                <h5>Especialista em Economia e Gestão Ambiental</h5>
                            </div>
                        </Carousel>
                    </div>
                    </Col>
                </Row>
            </Container>
            {/*<img className="projectsBg" src={projectsBg} alt="Image" />*/}
        </section>
    )
}