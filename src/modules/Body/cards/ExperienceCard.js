import './experienceCard.css';
import { Col } from "react-bootstrap";

export const ExperienceCard = ({ title, description, imgUrl }) => {
    return (
        <Col className="expo-col-card" xs={12} sm={6} md={4}>
            <div className="exp-imgbx">
                    <img className="exp-img" src={imgUrl} />
                    <h4>{title}</h4>
                    <span>{description}</span>
            </div>
        </Col>
    )
}