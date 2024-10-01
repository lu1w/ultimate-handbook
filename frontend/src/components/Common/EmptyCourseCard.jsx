import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'; // Import Button component
import '../../styles/EmptyCourseCard.css';
import PropTypes from 'prop-types'; // Import prop types
const EmptyCourseCard = ({ onAdd }) => {
  return (
    <Card className="empty-course-card" border="black">
      <Card.Body className="d-flex justify-content-center align-items-center">
        <Button
          variant="outline-secondary"
          className="add-button"
          onClick={onAdd}
        >
          <img src="/plus.svg" alt="Add" className="plus-icon" />
        </Button>
      </Card.Body>
    </Card>
  );
};

// add prop types for EmptyCourseCard
EmptyCourseCard.propTypes = {
  onAdd: PropTypes.func.isRequired, // onAdd is a function and is required
};
export default EmptyCourseCard;
