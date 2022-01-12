import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faUnlockAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faGithub,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  FormCheck,
  Container,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import Preloader from "../../components/Preloader";

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
// import { signin } from "../../api/authentication";
import ApiClient from "../../api";

const Signin = ({ setToken, ...props }) => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [googleUrl, setGoogleUrl] = useState(null);

  useEffect(() => {
    const fetchGoogleUrl = async () => {
      const url = await ApiClient.getRedirectGoogle();
      console.log("Redirect url: ", url);
      setGoogleUrl(url);
    };
    fetchGoogleUrl();
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    // Attempt to login with provided credentials
    try {
      console.log(username, password);
      const { key } = await ApiClient.signin(username, password);
      console.log(`Token: ${key}`);

      // Save token in the local storage for later use
      localStorage.setItem("token", key);

      // Trigger complete update and rerender of the HomePage (routes)
      setToken(key);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSigninGoogle = (e) => {
    window.location.href = googleUrl;
  };

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <p className="text-center">
            <Card.Link
              as={Link}
              to={Routes.DashboardOverview.path}
              className="text-gray-700"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
              Back to homepage
            </Card.Link>
          </p>
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Sign in to Redirink account</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSigninSubmit}>
                  <Form.Group id="username" className="mb-4">
                    <Form.Label>Your Username</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        onChange={handleUsernameChange}
                        autoFocus
                        required
                        type="text"
                        placeholder="Username"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control
                          onChange={handlePasswordChange}
                          required
                          type="password"
                          placeholder="Password"
                        />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label
                          htmlFor="defaultCheck5"
                          className="mb-0"
                        >
                          Remember me
                        </FormCheck.Label>
                      </Form.Check>
                      <Card.Link
                        as={Link}
                        to={Routes.ForgotPassword.path}
                        className="small text-end"
                      >
                        Lost password?
                      </Card.Link>
                    </div>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Sign in
                  </Button>
                </Form>

                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal">
                    Not registered?
                    <Card.Link
                      as={Link}
                      to={Routes.Signup.path}
                      className="fw-bold"
                    >
                      {` Create account `}
                    </Card.Link>
                  </span>
                </div>

                {googleUrl && (
                  <div>
                    <Button color="white" onClick={handleSigninGoogle}>
                      Sign in with Google
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Signin;
