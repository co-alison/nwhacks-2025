import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Individual page type components
const LearnPage = ({ module /*isCompleted, onComplete*/ }) => (
    <div>
        <h1>{module.title}</h1>
        <p>This is a Learn page. Study the material carefully.</p>
        {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Completed' : 'Mark as Complete'}
        </button> */}
    </div>
);

const PracticeQuizPage = ({ module /*isCompleted, onComplete*/ }) => (
    <div>
        <h1>{module.title}</h1>
        <p>This is a Practice Quiz page. Proceed with the practice.</p>
        {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Practice Quiz Completed' : 'Submit Practice Quiz'}
        </button> */}
    </div>
);

const QuizPage = ({ module /*isCompleted, onComplete*/ }) => (
    <div>
        <h1>{module.title}</h1>
        <p>This is a Quiz page. Answer the questions below:</p>
        {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Quiz Completed' : 'Submit Quiz'}
        </button> */}
    </div>
);

const IntroductionPage = ({ module /*isCompleted, onComplete*/ }) => (
    <div>
        <h1>{module.title}</h1>
        <p>This is an Introduction page. Read the instructions.</p>
        {/* <button onClick={onComplete} disabled={isCompleted}>
            {isCompleted ? 'Practice Quiz Completed' : 'Submit Practice Quiz'}
        </button> */}
    </div>
);

const ModulePage = ({ modules /*completedModules, markComplete*/ }) => {
    const { moduleId } = useParams(); // get module id from parameters
    const navigate = useNavigate();

    // Find the current module based on the route parameter
    const module = modules.find((mod) => mod.id === moduleId);

    if (!module) {
        return <div>Module not found</div>;
    }

    // const isCompleted = completedModules[moduleId] || false;

    // Render the appropriate page type
    const renderPage = () => {
        switch (module.type) {
            case 'learn':
                return (
                    <LearnPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'practice-quiz':
                return (
                    <PracticeQuizPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'quiz':
                return (
                    <QuizPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            case 'introduction':
                return (
                    <IntroductionPage
                        module={module}
                        // isCompleted={isCompleted}
                        // onComplete={() => markComplete(moduleId)}
                    />
                );
            default:
                return <div>Unknown module type</div>;
        }
    };

    return (
        <div>
            {renderPage()}
            <button onClick={() => navigate('/learn')}>Back to Learn</button>
        </div>
    );
};

export default ModulePage;
