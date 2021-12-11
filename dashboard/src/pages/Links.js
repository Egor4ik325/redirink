import { useState, useEffect } from "react";
import {
  faHome,
  faPlusCircle,
  faEdit,
  faTrashAlt,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  Button,
  Row,
  Col,
  Card,
  Table,
  Modal,
  Form,
  Dropdown,
  ButtonGroup,
} from "@themesberg/react-bootstrap";
import { client } from "../api";

const LinkRow = ({ id, fromUrl, toUrl, createTime }) => {
  return <></>;
};

const Links = () => {
  const [refresh, setRefresh] = useState(true); // data refresh is needed
  const [links, setLinks] = useState({
    count: null,
    next: null,
    previous: null,
    results: null,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUrl, setCreateUrl] = useState(null);

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

    if (refresh) {
      fetchLinks();
      setRefresh(false);
    }

    // Destructor
    return () => {};
  }, [refresh]);

  const handleCreateUrlChange = (e) => {
    setCreateUrl(e.target.value);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    // Create new link
    try {
      await client.createLink(createUrl);
      e.target.reset(); // clear all fields
      setRefresh(true); // refetch data
      setShowCreateModal(false); // close modal
    } catch (e) {
      // handle
      console.error("Error creating new link: ", e.message);
    }
  };

  const handelCancelModal = () => {};

  const handleDelete = () => {};

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
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
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
              <tr key={21}>
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
                    <td>1{link.pk}</td>
                    <td>
                      <a href={link.fromUrl}>{link.fromUrl}</a>
                    </td>
                    <td>
                      <a href={link.toUrl}>{link.toUrl}</a>
                    </td>
                    <td>{link.createTime}</td>
                    <td>
                      <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle
                          as={Button}
                          split
                          variant="link"
                          className="text-dark m-0 p-0"
                        >
                          <span className="icon icon-sm">
                            <FontAwesomeIcon
                              icon={faEllipsisH}
                              className="icon-dark"
                            />
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <FontAwesomeIcon icon={faEdit} className="me-2" />{" "}
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={handleDelete}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="me-2"
                            />{" "}
                            Remove
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr key="...">
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

      <Modal
        as={Modal.Dialog}
        centered
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      >
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Header>
            <Modal.Title className="h6">Create New Link</Modal.Title>
            <Button
              variant="close"
              aria-label="Close"
              onClick={() => setShowCreateModal(false)}
            />
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control
                required
                name="create-url"
                type="url"
                placeholder="https://github.com/github"
                onChange={handleCreateUrlChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="link"
              className="text-gray"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Links;
