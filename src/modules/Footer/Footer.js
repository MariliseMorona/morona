import './footer.css';
import { Row, Col } from "react-bootstrap";

export const Footer = () => {
    return (
        <>
            <div className="footer">
                <div className="container">
                    <Row>
                        <Col className="expo-col-card-1" xs={12} md={6}>
                            <div className="exp-imgbx-1">
                                <h2>Cultivi IT</h2>
                                <p><i className="fa-solid fa-phone-volume"></i>Quer saber um pouco mais sobre</p>
                                <p><i className="fa-solid fa-envelope"></i>E-mail: cultivi@cultivi.com.br</p>
                                <p><i className="fa-solid fa-paper-plane"></i>Telefone: 0000-0000</p>
                            </div>
                        </Col>
                        <Col className="expo-col-card-2" xs={12} md={6}>
                            <div className="exp-imgbx-2">
                                <h2>Chama</h2>
                                <p><i className="fa-solid fa-phone-volume"></i>Quer saber um pouco mais sobre</p>
                                <p><i className="fa-solid fa-envelope"></i>E-mail: cultivi@cultivi.com.br</p>
                                <p><i className="fa-solid fa-paper-plane"></i>Telefone: 0000-0000</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className='last-footer'>
                <p>Design by Marilise Morona</p>
            </div>
        </>
    );
}