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
  const [updateKey, setUpdateKey] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLink, setDeleteLink] = useState(null);

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

  // Save key and display modal
  const handleUpdate = (pk) => {
    console.log("Handle update for ", pk);
    setUpdateKey(pk);
    setShowUpdateModal(true);
  };

  const handleDelete = (pk) => {
    console.log("Handle delete for ", pk);
    setDeleteLink(links.results.find((link) => link.pk === pk));
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = () => {
    console.log("Handle delete submit");
  };

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
                          <Dropdown.Item onClick={() => handleUpdate(link.pk)}>
                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => handleDelete(link.pk)}
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="me-2"
                            />
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
      <LinkUpdateModal
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        setRefresh={setRefresh}
        links={links}
        setLinks={setLinks}
        pk={updateKey}
      />
      <LinkDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        setRefresh={setRefresh}
        link={deleteLink}
        setLink={setDeleteLink}
      />
    </>
  );
};

function LinkUpdateModal({
  showUpdateModal,
  setShowUpdateModal,
  setRefresh,
  links,
  setLinks,
  pk,
  ...rest
}) {
  const link = links.results
    ? links.results.find((link) => link.pk === pk)
    : null;
  const [updateUrl, setUpdateUrl] = useState(null);

  const handleUpdateUrlChange = (e) => {
    setUpdateUrl(e.target.value);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Create new link
    try {
      await client.changeLink(pk, updateUrl);
      // Immediately rerender with updated data
      const updatedLinkIndex = links.results.findIndex(
        (link) => link.pk === pk
      );
      let updatedLinks = links;
      updatedLinks.results[updatedLinkIndex] = { ...link, toUrl: updateUrl };
      setLinks(updatedLinks);
      setRefresh(true); // refetch data
      setShowUpdateModal(false); // close modal
    } catch (e) {
      // handle
      console.error(`Error updating link ${pk}: `, e.message);
    }
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setUpdateUrl(null);
  };

  return (
    <Modal
      as={Modal.Dialog}
      centered
      show={showUpdateModal}
      onHide={handleCloseModal}
    >
      <Form onSubmit={handleUpdateSubmit}>
        <Modal.Header>
          <Modal.Title className="h6">Update Link</Modal.Title>
          <Button
            variant="close"
            aria-label="Close"
            onClick={handleCloseModal}
          />
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Control
              required
              name="update-url"
              type="url"
              placeholder="https://github.com/github"
              value={
                updateUrl === null ? (link ? link.toUrl : null) : updateUrl
              }
              onChange={handleUpdateUrlChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            className="text-gray"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function LinkDeleteModal({
  showModal,
  setShowModal,
  setRefresh,
  link,
  setLink,
}) {
  const handleClose = () => {
    setShowModal(false);
    setLink(null);
  };
  const handleDeleteClick = async () => {
    try {
      await client.deleteLink(link.pk);
      setRefresh(true); // refetch data
      handleClose(); // close modal
    } catch (e) {
      console.error(`Error deleting link ${link.pk}: `, e.message);
    }
  };
  return (
    <Modal as={Modal.Dialog} centered show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title className="h6">Delete Link</Modal.Title>
        <Button variant="close" aria-label="Close" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this link?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="text-gray" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleDeleteClick}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Links;
