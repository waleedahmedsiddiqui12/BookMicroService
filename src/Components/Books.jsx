import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';

// npm install bootstrap@4 react-bootstrap@1
// import 'bootstrap/dist/css/bootstrap.min.css';
// npm install --save react-modal

function Books() {
  const [ListOfBooks, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isModalState, setModalState] = useState(false);
  const [show, setShow] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publicationYear: "",
  });

  const handleClose = () => {
    setModalState(false);
    setShow(false);
  };

  useEffect(() => {
    fetch("http://192.168.3.141:8080/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setBooks(json);
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
      });
  }, []);

  const handleShow = () => {
    setModalState(true);
    setShow(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value,
    });
  };

  const handleAddBook = (e) => {
    console.log("Adding book:", newBook);


    e.preventDefault();

    fetch('http://192.168.3.141:8080/books/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Book added:', data);
        handleClose();
        window.location.reload();
        // Reset form or perform any other actions as needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });


  };

  return (
    <>
      <div className="wrapper">
        <div className="container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Publication Year</th>
              </tr>
            </thead>
            <tbody>
              {ListOfBooks.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.author}</td>
                  <td>{p.publicationYear}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button className="btn btn-primary" onClick={handleShow}>
            Add a Book
          </Button>
        </div>

      </div>


      {isModalState && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="title">
                <Form.Label>Book Name</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="author">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="publicationYear">
                <Form.Label>Publication Year</Form.Label>
                <Form.Control
                  type="number"
                  name="publicationYear"
                  value={newBook.publicationYear}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddBook}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Books;
