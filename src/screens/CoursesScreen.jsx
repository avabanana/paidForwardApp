import React from 'react';
import { courses } from '../data/courses'; // Import the main list
import CourseCard from '../components/CourseCard';

const CoursesScreen = () => {
  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.title}>Available Courses</h2>
        <p style={styles.subtitle}>Tailored learning for your journey.</p>
      </div>

      <div style={styles.courseGrid}>
        {courses.map(course => (
          <div key={course.id} style={styles.cardWrapper}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ... keep the same styles as we used before
const styles = {
  container: { width: '100%' },
  headerSection: { marginBottom: '30px' },
  title: { fontSize: '2rem', color: '#333', margin: '0 0 10px 0' },
  subtitle: { color: '#666', fontSize: '1.1rem' },
  courseGrid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  cardWrapper: { flex: '1 1 300px', maxWidth: '100%' }
};

export default CoursesScreen;