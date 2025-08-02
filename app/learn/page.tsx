'use client'
import { BookOpen, CheckCircle, ChevronUp, ExternalLink, Play } from 'lucide-react';
import { useState } from 'react';
import ReactPlayer from 'react-player';
// import { useTheme } from './ThemeProvider'; // Import your theme context
import { useTheme } from '../components/ThemeProvider';

interface Topic {
  id: string;
  icon: string;
  title: string;
  description: string;
  wcagLink: string;
  wcagTitle: string;
  videoUrl: string;
  codeExample?: string;
  learned: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const LearnAccessibility = () => {
  const { theme } = useTheme(); // Use the theme context
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: 'alt-text',
      icon: '🖼️',
      title: 'Missing Alt Text',
      description: 'Images without alternative text make content inaccessible to screen readers and users with visual impairments.',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
      wcagTitle: 'WCAG 2.1 - Non-text Content',
      videoUrl: 'https://www.youtube.com/watch?v=flf2vS0IoRs',
      codeExample: `<!-- Bad -->
<img src="product.jpg">

<!-- Good -->
<img src="product.jpg" alt="Blue wireless headphones with noise cancellation">`,
      learned: false
    },
    {
      id: 'color-contrast',
      icon: '🎨',
      title: 'Color Contrast',
      description: 'Insufficient color contrast between text and background makes content difficult to read for users with visual impairments.',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
      wcagTitle: 'WCAG 2.1 - Contrast (Minimum)',
      videoUrl: 'https://www.youtube.com/watch?v=Hui87z2Vx8o',
      codeExample: `/* Bad - Low contrast ratio (2.1:1) */
.text-low-contrast {
  color: #999999;
  background-color: #ffffff;
}

/* Good - High contrast ratio (7:1) */
.text-high-contrast {
  color: #333333;
  background-color: #ffffff;
}`,
      learned: false
    },
    {
      id: 'keyboard-navigation',
      icon: '⌨️',
      title: 'Keyboard Navigation',
      description: 'Ensuring all interactive elements can be accessed and operated using only the keyboard for users who cannot use a mouse.',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html',
      wcagTitle: 'WCAG 2.1 - Keyboard',
      videoUrl: 'https://www.youtube.com/watch?v=cOmehxAU_4s',
      codeExample: `/* Ensure focus indicators are visible */
button:focus,
a:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Make custom elements keyboard accessible */
<div role="button" tabindex="0" onKeyDown={handleKeyDown}>
  Custom Button
</div>`,
      learned: false
    },
    {
      id: 'aria-labels',
      icon: '🧭',
      title: 'ARIA Labels',
      description: 'ARIA attributes provide semantic information about elements to assistive technologies when HTML alone is insufficient.',
      wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
      wcagTitle: 'WCAG 2.1 - Name, Role, Value',
      videoUrl: 'https://www.youtube.com/watch?v=0hqhzWAmHJE',
      codeExample: `<!-- Descriptive button -->
<button aria-label="Close dialog">×</button>

<!-- Form input with label -->
<input type="email" aria-labelledby="email-label" aria-describedby="email-help">
<label id="email-label">Email Address</label>
<div id="email-help">We'll never share your email</div>

<!-- Navigation landmark -->
<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>`,
      learned: false
    }
  ]);

  const [quizQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: 'What does "alt" stand for in the alt attribute?',
      options: ['Alternative Name', 'Alternative Text', 'Audio Tag', 'Automatic Label'],
      correctAnswer: 1,
      explanation: 'Alt stands for "Alternative Text" - it provides a text alternative for images when they cannot be displayed or accessed.'
    },
    {
      id: 2,
      question: 'What is the minimum color contrast ratio required by WCAG AA standards for normal text?',
      options: ['3:1', '4.5:1', '7:1', '2.1:1'],
      correctAnswer: 1,
      explanation: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.'
    },
    {
      id: 3,
      question: 'Which key is commonly used to navigate through interactive elements on a webpage?',
      options: ['Arrow keys', 'Tab key', 'Space key', 'Enter key'],
      correctAnswer: 1,
      explanation: 'The Tab key is the primary method for navigating through interactive elements in sequential order.'
    },
    {
      id: 4,
      question: 'What does ARIA stand for?',
      options: ['Accessible Rich Internet Applications', 'Advanced Responsive Interface Attributes', 'Automated Reader Interface Access', 'Alternative Resources for Internet Access'],
      correctAnswer: 0,
      explanation: 'ARIA stands for "Accessible Rich Internet Applications" - a set of attributes that provide semantic information to assistive technologies.'
    },
    {
      id: 5,
      question: 'Which ARIA attribute is used to provide an accessible name for an element?',
      options: ['aria-describedby', 'aria-label', 'aria-hidden', 'aria-expanded'],
      correctAnswer: 1,
      explanation: 'aria-label provides an accessible name for an element when the visible text is not sufficient or appropriate.'
    }
  ]);

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const toggleLearned = (topicId: string) => {
    setTopics(prev => 
      prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, learned: !topic.learned }
          : topic
      )
    );
  };

  const allTopicsLearned = topics.every(topic => topic.learned);
  const learnedCount = topics.filter(topic => topic.learned).length;

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuiz] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuiz < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuiz(prev => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
  };

  const getBadgeInfo = () => {
    const score = showResults ? calculateScore() : 0;
    
    if (allTopicsLearned && score >= 4) {
      return { title: 'Accessibility Expert', icon: '🏆', color: 'text-yellow-400' };
    } else if (allTopicsLearned) {
      return { title: 'Accessibility Practitioner', icon: '🎯', color: 'text-blue-400' };
    } else if (learnedCount >= 2) {
      return { title: 'Accessibility Learner', icon: '📚', color: 'text-green-400' };
    } else if (learnedCount >= 1) {
      return { title: 'Accessibility Beginner', icon: '🌱', color: 'text-purple-400' };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🧠 Learn Web Accessibility</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Understand common accessibility issues and how to fix them. Follow guidelines, watch short videos, and test your knowledge.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg p-6 mb-8 transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{learnedCount}/{topics.length} topics completed</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(learnedCount / topics.length) * 100}%` }}
            ></div>
          </div>

          {getBadgeInfo() && (
            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
              <span className="text-2xl">{getBadgeInfo()?.icon}</span>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Current Badge:</span>
                <div className={`font-semibold ${getBadgeInfo()?.color}`}>
                  {getBadgeInfo()?.title}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Learning Topics */}
        <div className="space-y-4 mb-12">
          {topics.map((topic) => {
            const [isOpen, setIsOpen] = useState(false);
            
            return (
              <div key={topic.id} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-200">
                <button 
                  className="flex justify-between items-center w-full px-6 py-4 text-left"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{topic.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{topic.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{topic.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {topic.learned && <CheckCircle className="w-6 h-6 text-green-400" />}
                    <ChevronUp className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                      {/* WCAG Link */}
                      <div className="mb-6">
                        <a 
                          href={topic.wcagLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          {topic.wcagTitle}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Video Player */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Video Tutorial
                        </h4>
                        <div className="bg-black rounded-lg overflow-hidden">
                          <ReactPlayer
                            url={topic.videoUrl}
                            width="100%"
                            height="300px"
                            controls
                            light
                          />
                        </div>
                      </div>

                      {/* Code Example */}
                      {topic.codeExample && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Code Example</h4>
                          <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-sm overflow-x-auto">
                            <code className="text-green-600 dark:text-green-400">{topic.codeExample}</code>
                          </pre>
                        </div>
                      )}

                      {/* Learned Button */}
                      <button
                        onClick={() => toggleLearned(topic.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          topic.learned 
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        {topic.learned ? 'Learned ✓' : 'Mark as Learned'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quiz Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-lg p-6 transition-colors duration-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">🎯 Test Your Knowledge</h2>
            <p className="text-gray-600 dark:text-gray-400">Take our quick quiz to see how much you've learned!</p>
          </div>

          {!quizStarted && !showResults ? (
            <div className="text-center">
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ) : showResults ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {calculateScore()}/{quizQuestions.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {calculateScore() >= 4 ? 'Excellent work! 🎉' : 
                   calculateScore() >= 3 ? 'Good job! 👍' : 
                   'Keep learning! 📚'}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="text-left bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="font-medium mb-2">{question.question}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Your answer: <span className={selectedAnswers[index] === question.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {question.options[selectedAnswers[index]]}
                      </span>
                    </div>
                    {selectedAnswers[index] !== question.correctAnswer && (
                      <div className="text-sm text-green-600 dark:text-green-400 mb-2">
                        Correct answer: {question.options[question.correctAnswer]}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 dark:text-gray-400">{question.explanation}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={resetQuiz}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Question {currentQuiz + 1} of {quizQuestions.length}</span>
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuiz + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {quizQuestions[currentQuiz].question}
                </h3>
                <div className="space-y-3">
                  {quizQuestions[currentQuiz].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={selectedAnswers[currentQuiz] !== undefined}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedAnswers[currentQuiz] === index
                          ? index === quizQuestions[currentQuiz].correctAnswer
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-red-600 border-red-500 text-white'
                          : selectedAnswers[currentQuiz] !== undefined && index === quizQuestions[currentQuiz].correctAnswer
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnAccessibility;