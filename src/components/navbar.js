import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar as BootstrapNavbar, Nav, Button } from 'react-bootstrap';

function NavbarComponent() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    };

    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';
    const isLoggedIn = !!localStorage.getItem('token'); // Check if logged in
    const isHomePage = location.pathname === '/';
    const isFeedPage = location.pathname === '/feed';

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">
                    Digi Tapri (Your Social Media)
                </BootstrapNavbar.Brand>
                {/* Hamburger menu toggle button */}
                <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
                <BootstrapNavbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        {/* Conditional rendering based on route */}
                        {!isLoginPage && !isRegisterPage && !isLoggedIn &&(
                            <Button variant="outline-light" as={Link} to="/">
                                Home
                            </Button>
                        )}
                        {isLoginPage && (
                            <Button variant="outline-light" as={Link} to="/register">
                                Register
                            </Button>
                        )}
                        {isRegisterPage && (
                            <Button variant="outline-light" as={Link} to="/login">
                                Login
                            </Button>
                        )}
                        {isLoggedIn ? (
                            <>
                                {/* Render Feed button only once for logged-in users */}
                                {!isFeedPage && (
                                    <Button variant="outline-light" as={Link} to="/feed" className="mx-2">
                                        Feed
                                    </Button>
                                )}
                                {!isHomePage && (
                                    <Button variant="outline-light" as={Link} to="/" className="mx-2">
                                        Home
                                    </Button>
                                )}
                                <Button variant="outline-light" onClick={handleLogout} className="mx-2">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            isHomePage && (
                                <Button variant="outline-light" as={Link} to="/feed" className="mx-2">
                                    Feed
                                </Button>
                            )
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default NavbarComponent;