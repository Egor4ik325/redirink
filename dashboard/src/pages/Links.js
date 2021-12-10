import { useState, useEffect } from "react";
import { faHome, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Row,
  Col,
  Card,
  Table,
} from "@themesberg/react-bootstrap";
import { client } from "../api";

const LinkRow = ({ id, fromUrl, toUrl, createTime }) => {
  return <></>;
};

const Links = () => {
  const [links, setLinks] = useState({ count: null, results: null });

  useEffect(() => {
    // Constructor
    const fetchLinks = async () => {
      try {
        const linksData = await client.getLinks();
        console.log("Links are fetched: ", linksData);
        setLinks(linksData);
      } catch (e) {
        console.log("Error while fetching links: ", e.message);
      }
    };

    fetchLinks();

    // Destructor
    return () => {};
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{
              className: "breadcrumb-dark breadcrumb-transparent",
            }}
          >
            <Breadcrumb.Item>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Links</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Links</h4>
          <p>You short redirect links dashboard</p>
        </div>
        {/* Toolbar */}
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="primary" size="sm">
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Create Link
          </Button>
        </div>

        {/* Settings */}
        {/* <div className="table-settings mb-4">
          <Col xs={4} md={2} xl={1} className="ps-md-0 text-end"></Col>
        </div> */}
      </div>

      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th>#</th>
                <th>From URL</th>
                <th>To URL</th>
                <th>Create time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>21</td>
                <td>
                  <a href="https://localhost:8000/abc" className="link-primary">
                    https://localhost:8000/abc
                  </a>
                </td>
                <td>https://github.com/Egor4ik325</td>
                <td>2012-238-23</td>
              </tr>
              {links.results ? (
                links.results.map((link) => (
                  <tr key={link.pk}>
                    <td>{link.pk}</td>
                    <td>
                      <a href={link.from_url}>{link.from_url}</a>
                    </td>
                    <td>
                      <a href={link.to_url}>{link.to_url}</a>
                    </td>
                    <td>{link.create_time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default Links;
