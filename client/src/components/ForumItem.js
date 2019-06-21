import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

class ForumItemDisplay extends React.Component{
  render(){
    const {ForumTitle,ForumSubject,ForumText} = this.props
    return(
      <Card>
        <Card.Header as="h5">{ForumSubject}</Card.Header>
        <Card.Body>
            <Card.Title>{ForumTitle}</Card.Title>
            <Card.Text>{ForumText}</Card.Text>
          <Button variant="primary">Read More</Button>
        </Card.Body>
      </Card>
    );
  } 
}

export default  ForumItemDisplay