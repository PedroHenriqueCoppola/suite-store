import './Footer.css';
import '../../App.css';
import logo from '../../assets/logo.png'

function Footer() {
    return (
        <div className="footerApp">
            <footer>
                <div className="content">
                    <div className="info">
                        <div className="pages">
                            <span>PAGES</span>
                            <div className="texts">
                                <a href="/">Home</a>
                                <a href="/products">Products</a>
                                <a href="/categories">Categories</a>
                                <a href="/history">History</a>
                            </div>
                        </div>
        
                        <div className="social">
                            <span>SOCIAL</span>
                            <div className="texts">
                                <a href="https://github.com/PedroHenriqueCoppola" target='_blank'>GitHub</a>
                                <a href="https://www.linkedin.com/in/pedro-henrique-coppola-071baa225/" target='_blank'>LinkedIn</a>
                                <a href="https://www.softexpert.com/pt-BR/" target='_blank'>SoftExpert</a>
                            </div>
                        </div>
                    </div>
                
                    <img src={logo}/>
                </div>

                <div className="line"></div>

                <p className="rights">© 2024 SoftExpert. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default Footer