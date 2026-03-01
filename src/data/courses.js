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
  {
    id: 2,
    title: 'Budgeting Basics',
    category: 'Finance',
    summary: 'Understand how to manage your money month-to-month and make smart spending decisions.',
    progress: 0,
    quiz: [
      {
        question: "What should you do if your expenses exceed your income?",
        options: ["Spend more", "Cut some expenses", "Borrow from friends"],
        correct: 1
      },
      {
        question: "Which is a good way to track your spending?",
        options: ["Ignore it", "Write it down or use an app", "Ask someone else to guess"],
        correct: 1
      }
    ]
  }
];