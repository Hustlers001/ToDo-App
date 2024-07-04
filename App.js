import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const updateInput = (value) => {
    setUserInput(value);
  };

  const addItem = () => {
    if (userInput.trim() !== "") {
      const newItem = {
        id: Math.random(),
        value: userInput,
        completed: false,
        dueDate: selectedDate,
      };

      setList([...list, newItem]);
      setUserInput("");
      setSelectedDate(null);
    }
  };

  const deleteItem = (id) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
  };

  const editItem = (id) => {
    const editedValue = prompt("Edit the item:");
    if (editedValue && editedValue.trim() !== "") {
      const updatedList = list.map((item) =>
        item.id === id ? { ...item, value: editedValue } : item
      );
      setList(updatedList);
    }
  };

  const toggleComplete = (id) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  };

  const clearAll = () => {
    setList([]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setList(items);
  };

  const filteredList = list.filter((item) =>
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      style={{
        backgroundImage: darkMode
          ? "url('https://th.bing.com/th/id/OIP.eYO54imCQa9tptRj_ojWUgHaEo?w=275&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7')"
          : "url('https://th.bing.com/th/id/OIP.94sBHQEGxjQjTtrQPJNr4QHaEo?w=278&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7')",
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "20px",
        color: darkMode ? "white" : "black",
      }}
    >
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3rem",
          fontWeight: "bolder",
        }}
      >
        TODO LIST
      </Row>

      <hr />
      <Row>
        <Col md={{ span: 5, offset: 4 }}>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="add item..."
              size="lg"
              value={userInput}
              onChange={(e) => updateInput(e.target.value)}
              aria-label="add something"
              aria-describedby="basic-addon2"
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Select due date"
              className="ml-2"
            />
            <InputGroup>
              <Button variant="dark" className="mt-2" onClick={addItem}>
                ADD
              </Button>
            </InputGroup>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 5, offset: 4 }}>
          <FormControl
            placeholder="Search..."
            size="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="search something"
            aria-describedby="basic-addon2"
            className="mb-3"
          />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <ListGroup
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredList.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListGroup.Item
                            variant="dark"
                            action
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              textDecoration: item.completed
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {item.value}
                            {item.dueDate && (
                              <span style={{ marginLeft: "10px" }}>
                                Due: {item.dueDate.toLocaleDateString()}
                              </span>
                            )}
                            <span>
                              <Button
                                style={{ marginRight: "10px" }}
                                variant="light"
                                onClick={() => deleteItem(item.id)}
                              >
                                Delete
                              </Button>
                              <Button variant="light" onClick={() => editItem(item.id)}>
                                Edit
                              </Button>
                              <Button
                                variant="light"
                                onClick={() => toggleComplete(item.id)}
                              >
                                {item.completed ? "Undo" : "Complete"}
                              </Button>
                            </span>
                          </ListGroup.Item>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ListGroup>
              )}
            </Droppable>
          </DragDropContext>
          {list.length > 0 && (
            <Button variant="danger" className="mt-3" onClick={clearAll}>
              Clear All
            </Button>
          )}
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle {darkMode ? "Day" : "Night"} Mode
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
