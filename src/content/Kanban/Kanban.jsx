import React, { useState } from 'react';
import { Column, Tile, Button, Modal, TextInput, TextArea, Tag, Dropdown, DatePicker, DatePickerInput, ClickableTile, Layer } from '@carbon/react';
import { Grid, Row } from '@carbon/react';
import { commentsData, kanbanColumns } from './data'; // Import your data or use state management

const KanbanBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Function to handle card click
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  return (
    <Grid>
      
      {kanbanColumns.map(column => (
          <Column key={column.id} sm={4} md={4} lg={4}>
            <Layer level={1}>
            <h2 style={{marginBottom:"3rem"}}>{column.title}</h2>
            <Layer level={2}>
            {column.cards.map(card => (
              <ClickableTile key={card.id} onClick={() => handleCardClick(card)}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </ClickableTile>
            ))}
            </Layer>
            </Layer>
          </Column>
        ))}

      {/* Modal for Card Details */}
      {selectedCard && (
        <Modal
        open={isModalOpen}
        modalHeading="Task Details"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        size='md'
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Grid className="modal-content">
            <Column sm={6} md={6} lg={9}>
              <TextInput
                id="title-input"
                labelText="Title"
                defaultValue={selectedCard.title}
              />
              <TextArea
                id="description-textarea"
                labelText="Description"
                defaultValue={selectedCard.description}
              />
            </Column>
            <Column sm={2} md={2} lg={3}>
              <div>
                <h4>Tags</h4>
                {selectedCard.tags.map((tag) => (
                  <Tag key={tag} type="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div>
                <h4>Assign</h4>
                <Dropdown
                  id="assign-dropdown"
                  titleText="Assign to"
                  label="Select a user"
                  items={['User 1', 'User 2', 'User 3']}
                />
              </div>
              <div>
                <h4>Time</h4>
                <DatePicker dateFormat="m/d/Y" datePickerType="single">
                  <DatePickerInput
                    id="date-picker-input-id-start"
                    placeholder="mm/dd/yyyy"
                    labelText="Due Date"
                    type="text"
                  />
                </DatePicker>
              </div>
            </Column>
          <br />
          
            <Column sm={4} md={4} lg={6}>
              <div className="comments-section">
                <h4>Comments</h4>
                {commentsData.map((comment) => (
                  <div key={comment.id}>
                    <strong>{comment.user}</strong>
                    <p>{comment.text}</p>
                    <small>{comment.date}</small>
                  </div>
                ))}
              </div>
            </Column>
          
        </Grid>
      </Modal>
      )}
    </Grid>
  );
};

export default KanbanBoard;