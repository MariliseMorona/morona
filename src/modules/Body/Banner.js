import './banner.css';
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

export const Banner = () => {

    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Marilise Morona"];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        },delta)
        return () => {clearInterval(ticker)};
    }, [text])

const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);
    if (isDeleting){
        setDelta(prevDelta => prevDelta/2)
    }

    if (!isDeleting && updatedText === fullText){
        setIsDeleting(true);
        setDelta(period);
    }else if (isDeleting && updatedText === ''){
        setIsDeleting(false);
        setLoopNum(loopNum + 1)
        setDelta(500);
    }
}

    return (
        <section className="banner" id="home">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={4}>
                        <h2 className="tagline">Olá Mundo!</h2>
                        <h1>{`Eu sou `}<span className="wrap">{text}</span></h1>
                        <p> Sou uma Agrônoma apaixonada por tecnologia e inovação. Minha jornada na programação começou de forma curiosa, por meio de <i>hackathons</i> e como <i>co-founder</i> de uma AgriTech, onde mergulhei no desenvolvimento mobile e na cultura <i>DevOps</i>. Desde então, venho expandindo meu conhecimento para transformar ideias em soluções digitais escaláveis. Hoje, sou <i>Software Engineer</i> na ZarpSystem e também atuo de forma autônoma como consultora de transformação digital, ajudando empresas a otimizar processos e impulsionar a inovação.</p>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}