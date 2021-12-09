import React from 'react';

import { Navbar, Nav } from 'rsuite';

class TopNav extends React.Component {
    render() {
        return (
            <Navbar appearance="default">
                <Navbar.Brand>
                    NBA Database
                </Navbar.Brand>
                <Nav>
                    <Nav.Item active href="/">
                        Home
                    </Nav.Item>
                    <Nav.Item active href="/players">
                        Players
                    </Nav.Item>
                    <Nav.Item active href="/games">
                        Games
                    </Nav.Item>
                    <Nav.Item active href="/facts">
                        Fun Facts
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}


export default TopNav
