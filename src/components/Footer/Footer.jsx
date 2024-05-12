import './Footer.css';
import uai from '../../Img/uai.png'

const Footer = () => {

    return (
        <footer className="footer-contenedor">
        <div className="footer-div">
            <ul className="footer-lista">
                <li>Facundo Romeu</li>
                <li>Facundo Garcia</li>
                <li>Lucas Gino</li>
            </ul>
        </div>
        <div className="footer-div">
            <img className="footer-imagen" src={uai} alt="logo" />
            <p className="footer-texto">Desarrollo y Arquitecturas Web</p>
        </div>

    </footer>
    )
}

export default Footer;