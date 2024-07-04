import React, { useState } from 'react';
import { Column, Tile, Button, Modal, TextInput, TextArea, Tag, Dropdown, DatePicker, DatePickerInput, ClickableTile, Layer } from '@carbon/react';
import { Grid, Row } from '@carbon/react';
import { commentsData, kanbanColumns } from './data'; // Import your data or use state management
import ComponentPlayground from './component-playground/ComponentPlayground';

const KanbanBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Function to handle card click
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  return (
    <ComponentPlayground />
  );
};

export default KanbanBoard;