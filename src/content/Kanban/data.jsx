// data.js

// Sample data for kanban columns and cards
export const kanbanColumns = [
    {
      id: 'col-1',
      title: 'To Do',
      cards: [
        {
          id: 'card-1',
          title: 'Task 1',
          description: 'This is the first task.',
          tags: ['urgent', 'backend'],
          assign: 'User 1',
          dueDate: '2023-10-10',
        },
        {
          id: 'card-2',
          title: 'Task 2',
          description: 'This is the second task.',
          tags: ['frontend'],
          assign: 'User 2',
          dueDate: '2023-10-15',
        },
        {
            id: 'card-7',
            title: '+ Add New Task',
            description: '',
            tags: [],
            assign: '',
            dueDate: '',
          },
      ],
    },
    {
      id: 'col-2',
      title: 'In Progress',
      cards: [
        {
          id: 'card-3',
          title: 'Task 3',
          description: 'This task is in progress.',
          tags: ['bug'],
          assign: 'User 3',
          dueDate: '2023-10-20',
        },
        {
            id: 'card-6',
            title: '+ Add New Task',
            description: '',
            tags: [],
            assign: '',
            dueDate: '',
          },
      ],
    },
    {
      id: 'col-3',
      title: 'Done',
      cards: [
        {
          id: 'card-4',
          title: 'Task 4',
          description: 'This task is completed.',
          tags: ['feature'],
          assign: 'User 1',
          dueDate: '2023-09-30',
        },
        {
            id: 'card-5',
            title: '+ Add New Task',
            description: '',
            tags: [],
            assign: '',
            dueDate: '',
          },
      ],
    },
    {
        id: 'col-4',
        title: '+ Add New Column',
        cards: [
          
        ],
    },
  ];
  
  // Sample data for comments
  export const commentsData = [
    {
      id: 'comment-1',
      cardId: 'card-1',
      user: 'User 1',
      text: 'This is a comment for Task 1.',
      date: '2023-10-01',
    },
    {
      id: 'comment-2',
      cardId: 'card-2',
      user: 'User 2',
      text: 'This is a comment for Task 2.',
      date: '2023-10-02',
    },
    {
      id: 'comment-3',
      cardId: 'card-3',
      user: 'User 3',
      text: 'This is a comment for Task 3.',
      date: '2023-10-03',
    },
  ];