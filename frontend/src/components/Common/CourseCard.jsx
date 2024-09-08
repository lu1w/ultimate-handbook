import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'; // Import Button component
import '../../styles/CourseCard.css';

const typeColors = {
  'COMPULSORY': 'LightPink',
  'DISCIPLINE': 'Bisque',
  'MAJOR CORE': 'LightBlue',
};

const CourseCard = ({ type, code, level, points, name, term = [], state }) => {
  const headerBackgroundColor = typeColors[type] || 'defaultColor';
  const headerStyle = {
    backgroundColor: headerBackgroundColor,
  };

  return (
    <Card className="course-card" border="black">
      <Card.Header style={headerStyle} className="d-flex justify-content-between align-items-center">
        <span>{type}</span>
        <Button variant="outline-secondary" className="close-button">×</Button>
      </Card.Header>
      <Card.Body>
        <Card.Text>{code} | Level {level} | {points} points</Card.Text>
        <Card.Title>{name}</Card.Title>
        
        {/* Render terms in a 2-column flex grid */}
        <div className="term-buttons">
          {term.map((termName, index) => (
            <Button variant = "secondary" key={index} className="term-button">{termName}</Button>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
