import React from "react";
import { useState } from "react";
import { Form, ModalHeader, ModalTitle } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import  { useNavigate } from 'react-router-dom'


export default function CreateRoomModal() {
  
  const url = process.env.REACT_APP_FETCH_URL;
  const key = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState();

  const randomString = (length) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

  const handleSubmit = (room) => {
    let roomCode = randomString(8);

    fetch(`${url}/api/Room`, {
    method: 'POST',
    headers: {
        'x-api-key': key,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "id": 0,
        "roomName": name,
        "roomCode": roomCode
      })
})
  setTimeout(() => {navigate(`/room/${roomCode}`)}, 1000);
}
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Room
      </Button>
      <Modal show={show} onHide={handleClose}>
        <ModalHeader><h1>Create Room</h1></ModalHeader>
        <Modal.Body>
        <Form id="myForm" onSubmit={e => {
          e.preventDefault();
          handleSubmit(name)}}>
          <Form.Group>
            <Form.Control onChange={e => setName(e.target.value)} placeholder="Room name" />
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" form="myForm">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
  </>
  );
}