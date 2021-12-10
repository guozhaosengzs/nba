import React from 'react';

import { Navbar, Nav } from 'rsuite';
import { IoIosHome, IoMdPerson, IoMdBasketball, IoIosHappy, IoIosInformationCircle } from "react-icons/io";

class TopNav extends React.Component {
    render() {
        return (
            <Navbar appearance="default">
                <Navbar.Brand>
                    NBA Database
                </Navbar.Brand>
                <Nav>
                    <Nav.Item active icon={<IoIosHome />} href="/">
                        Home
                    </Nav.Item>
                    <Nav.Item active icon={<IoMdPerson />} href="/players">
                        Players
                    </Nav.Item>
                    <Nav.Item active icon={<IoMdBasketball />} href="/games">
                        Games
                    </Nav.Item>
                    <Nav.Item active icon={<IoIosHappy />} href="/facts">
                        Fun Facts
                    </Nav.Item>
                </Nav>
                <Nav pullRight>
                    <Nav.Item active icon={<IoIosInformationCircle />} href="https://www.basketball-reference.com/about/glossary.html" target="_blank">
                        NBA Glossary
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}


export default TopNav
