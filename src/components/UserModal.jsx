import { useState } from "react";
import { Form, ModalHeader, ModalTitle } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";


export default function UserModal({username}) {

    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setData] = useState("")

    function handleClick() {
        username(data);
      }

    return (
        <>
          <Modal show={show} backdrop="static" keyboard={false}>
            <ModalHeader><h1>Enter username</h1></ModalHeader>
            <Modal.Body>
            <Form id="myForm" onSubmit={e => {
              e.preventDefault();
              handleClick();
              }}>
              <Form.Group>
                <Form.Control onChange={e => {setData(e.target.value)}} placeholder="Username"/>
              </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" form="myForm" onClick={handleClose}>
                Join
              </Button>
            </Modal.Footer>
          </Modal>
      </>
      );
}