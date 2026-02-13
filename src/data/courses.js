export const courses = [
  { 
    id: 1, 
    title: 'Financial Literacy 101', 
    category: 'Finance', 
    summary: 'Learn the essentials of budgeting, saving, and understanding interest rates to build a solid financial future.',
    progress: 0,
    quiz: [
      {
        question: "What is 'Compound Interest'?",
        options: ["Interest on the principal only", "Interest on principal plus accumulated interest", "A type of bank fee"],
        correct: 1
      },
      {
        question: "Which of these is a 'Fixed Expense'?",
        options: ["Groceries", "Movie Tickets", "Monthly Rent"],
        correct: 2
      }
    ]
  },
  { id: 2, title: 'Basic Coding Skills', category: 'Tech', summary: 'Introduction to HTML, CSS, and Logic.', progress: 0 },
];