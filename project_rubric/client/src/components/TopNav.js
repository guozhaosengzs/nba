import React from 'react';

import { Navbar, Nav } from 'rsuite';

class TopNav extends React.Component {
    render() {
        return (
            <Navbar appearance="inverse">
                <NavbarBrand href="/">
                    NBA Database
                </NavbarBrand>
                <Nav>
                    <Nav.Item icon={<Home />} active href="/">
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
