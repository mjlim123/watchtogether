import React from "react";
import { useState } from "react";
import { Form, ModalHeader, ModalTitle } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import  { useNavigate } from 'react-router-dom'


export default function JoinRoomModal() {
  
  const url = process.env.REACT_APP_FETCH_URL;
  const key = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [roomCode, setRoomCode] = useState();

  
  const handleSubmit = async (room) => {
    try {
      const response = await fetch(`${url}/api/Room/roomCode?roomCode=${roomCode}`, 
      {
        method: 'GET',
        headers: {
            'x-api-key': key}
      });
      const roomData = await response.json();
      if (roomData.length != 0)
        navigate(`/room/${room}`);
    } catch (error) {
      console.log("Ouch")
    }
}
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Join Room
      </Button>
      <Modal show={show} onHide={handleClose}>
        <ModalHeader><h1>Enter room code</h1></ModalHeader>
        <Modal.Body>
        <Form id="myForm" onSubmit={e => {
          e.preventDefault();
          handleSubmit(roomCode)}}>
          <Form.Group>
            <Form.Control onChange={e => setRoomCode(e.target.value)} placeholder="Room code" />
          </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" form="myForm">
            Join
          </Button>
        </Modal.Footer>
      </Modal>
  </>
  );
}