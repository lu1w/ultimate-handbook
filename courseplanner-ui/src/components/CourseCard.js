import React from 'react';
import Card from 'react-bootstrap/Card';
import './CourseCard.css';

const typeColors = {
    'COMPULSORY': 'LightPink',
    'DISCIPLINE': 'Bisque',
    'MAJOR CORE': 'LightBlue',
};

const CourseCard = ({ type, code, level, points, name, term, state}) => {
    // Determine the background color based on type
    const headerBackgroundColor = typeColors[type] || 'defaultColor';
    const headerStyle = {
      backgroundColor: headerBackgroundColor,
    };
  
    return (
      <Card border="black" style={{ width: '18rem' }}>
        <Card.Header style={headerStyle}>{type}</Card.Header>
        <Card.Body>
          <Card.Text>{code} | Level {level} | {points} points</Card.Text>
          <Card.Title>{name}</Card.Title>
        </Card.Body>
      </Card>
    );
  };
  
  export default CourseCard;
