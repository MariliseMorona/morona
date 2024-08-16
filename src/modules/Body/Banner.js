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
                        <p>Sou uma Agrônoma apaixonada por tecnologia. Curiosamente entrei no mundo da programação através de <i>hackathons</i> e ao ser <i>co-founder</i> de uma <i>AgroTech</i>. Desde então venho buscando conhecimento sobre tecnologia e inovação, apreendendo muito sobre o desenvolvimento <i>mobile</i>, sobre a cultura <i>DevOps</i>. 
                        Hoje atuo como desenvolvedora iOS na ZarpSystem. Além de atuar, de forma autônoma, como consultora de transformação digital.</p>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}