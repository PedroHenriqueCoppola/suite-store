import './Header.css';
import '../../App.css';

function Header() {
    return (
        <div className="headerApp">
            <header>
                <a className="title">Suite Store</a>

                <nav className="nav">
                    <a href="/">Home</a>
                    <a href="/products">Products</a>
                    <a href="/categories">Categories</a>
                    <a href="/history">History</a>
                </nav>
            </header>
        </div>
    )
}

export default Header