import React from "react";
import {
  Box,
  Flex,
  Heading,
  Link,
  Spacer,
  IconButton,
  Stack,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

interface NavBarProps {
  title: string;
}

const NavBar: React.FC<NavBarProps> = ({ title }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box bg="gray.800" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Heading as="h1" size="lg" className="navbar-item nav-title" mr={4}>
            <Link
              as={RouterLink}
              to="/"
              _hover={{ textDecoration: "none" }}
              color="white"
            >
              {title}
            </Link>
          </Heading>
        </Flex>
        <Spacer />
        <Flex alignItems="center" display={{ base: "none", md: "flex" }}>
          <NavLinks />
        </Flex>
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
          color="white"
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack mt={2} display={{ md: "none" }} bg="gray.800" p={4} spacing={4}>
          <NavLinks />
        </Stack>
      </Collapse>
    </Box>
  );
};

const NavLinks = () => (
  <>
    <Link as={RouterLink} to="/status" mr={4} color="white">
      User Status
    </Link>
    <Link as={RouterLink} to="/about" mr={4} color="white">
      About
    </Link>
    <Link as={RouterLink} to="/register" mr={4} color="white">
      Register
    </Link>
    <Link as={RouterLink} to="/login" mr={4} color="white">
      Log In
    </Link>
    <Link as={RouterLink} to="/logout" color="white">
      Log Out
    </Link>
  </>
);

export default NavBar;
