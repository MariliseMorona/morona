import './banner.css';
import { Canvas } from "@react-three/fiber";
import ParticlesNetwork from "../Animations/ParticlesNetwork";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

const TO_ROTATE = ["Marilise Morona"];

export const Banner = () => {

    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        const tick = () => {
            let i = loopNum % TO_ROTATE.length;
            let fullText = TO_ROTATE[i];
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

        let ticker = setInterval(() => {
            tick();
        },delta)
        return () => {clearInterval(ticker)};
    }, [text, delta, isDeleting, loopNum, period])

    return (
        <section className="banner" id="home">
            <div className="banner-background">
                <Canvas style={{ width: "100%", height: "80%", pointerEvents: "none" }} camera={{ position: [0, 0, 50], fov: 75 }}>
                    <EffectComposer>
                        <Bloom intensity={1.5} luminanceThreshold={0.2} />
                        <ParticlesNetwork />
                    </EffectComposer>
                </Canvas>
            
            <Container className="banner-content">
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={6}>
                        
                        <div className="container-text">
                            <h1><span className="wrap">{text}</span></h1>
                        </div>
                        <h2 className="tagline">Software Engineer combining iOS, spatial computing and digital transformation 
                            to turn complex ideas into practical digital experiences</h2>
                    </Col>
                </Row>
            </Container>
            </div>
        </section>
    )
}
