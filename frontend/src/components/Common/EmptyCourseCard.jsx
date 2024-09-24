import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'; // Import Button component
import '../../styles/EmptyCourseCard.css';

const EmptyCourseCard = ({ onAdd }) => {
  return (
    <Card className="empty-course-card" border="black">
      <Card.Body className="d-flex justify-content-center align-items-center">
        <Button variant="outline-secondary" className="add-button" onClick={onAdd}>
          <img src="/plus.svg" alt="Add" className="plus-icon" />
        </Button>
      </Card.Body>
    </Card>
  );
};

export default EmptyCourseCard;
