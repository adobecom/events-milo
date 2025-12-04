import { useState, useRef, useEffect } from '../../scripts/deps/preact/hooks/index.js';
import html from '../../scripts/html.js';
import { useSessions } from './sessionProvider.js';

const BEDROCK_API_URL = 'https://bedrock-runtime.us-west-2.amazonaws.com/model/us.anthropic.claude-sonnet-4-5-20250929-v1:0/converse';
const BEDROCK_API_KEY = () => window.BEDROCK_API_KEY

const SUGGESTED_QUESTIONS = [
  "I'm a Graphic Designer getting started with Photography. Which sessions will help?",
  'Show me sessions about Adobe Firefly and generative AI',
  "What's new in Photoshop this year?",
  'I want to learn video editing with Premiere Pro',
  'What are the latest features in Illustrator?',
];

/**
 * Common keywords to expand for better matching
 */
const KEYWORD_EXPANSIONS = {
  photo: ['photoshop', 'photography', 'lightroom', 'camera raw'],
  video: ['premiere', 'after effects', 'video editing', 'motion graphics'],
  design: ['illustrator', 'indesign', 'graphic design', 'typography'],
  ai: ['firefly', 'generative', 'artificial intelligence', 'machine learning', 'sensei'],
  web: ['dreamweaver', 'xd', 'figma', 'responsive', 'ux', 'ui'],
  '3d': ['dimension', 'substance', 'aero', 'three dimensional'],
};

/**
 * Extract and expand keywords from user query
 */
function extractKeywords(query) {
  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  
  const expanded = new Set(words);
  words.forEach((word) => {
    Object.entries(KEYWORD_EXPANSIONS).forEach(([key, expansions]) => {
      if (word.includes(key) || expansions.some((e) => word.includes(e))) {
        expanded.add(key);
        expansions.forEach((e) => expanded.add(e));
      }
    });
  });
  
  return Array.from(expanded);
}

/**
 * Score a session based on keyword matches
 */
function scoreSession(session, keywords) {
  const title = (session.title || session.sessionTitle || '').toLowerCase();
  const tagText = (session.tags || []).map((t) => t.title || '').join(' ').toLowerCase();
  const searchText = `${title} ${tagText}`;
  
  let score = 0;
  keywords.forEach((kw) => {
    if (title.includes(kw)) score += 3; // Title match worth more
    if (tagText.includes(kw)) score += 1;
  });
  return score;
}

/**
 * Build a condensed sessions index for the AI model
 * Pre-filters to relevant sessions and uses short field names to reduce tokens
 */
function buildSessionsContext(sessions, userQuery) {
  const keywords = extractKeywords(userQuery);
  const MAX_SESSIONS = 75;
  
  // Score and sort sessions by relevance
  const scored = sessions.map((session) => ({
    session,
    score: scoreSession(session, keywords),
  }));
  
  // Get top matching sessions, or random sample if no matches
  let selected;
  const matching = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  
  if (matching.length >= 10) {
    selected = matching.slice(0, MAX_SESSIONS).map((s) => s.session);
  } else {
    // Not enough keyword matches - include some general sessions too
    const nonMatching = scored.filter((s) => s.score === 0);
    const shuffled = nonMatching.sort(() => Math.random() - 0.5).slice(0, MAX_SESSIONS - matching.length);
    selected = [...matching.map((s) => s.session), ...shuffled.map((s) => s.session)];
  }
  
  // Build condensed list with short field names
  const condensed = selected.map((session) => {
    const tags = (session.tags || [])
      .filter((tag) => tag.tagId?.includes('products/') || tag.tagId?.includes('track/') || tag.tagId?.includes('category/'))
      .map((tag) => tag.title)
      .join(', ');

    return {
      i: session.id, // id
      t: session.title || session.sessionTitle, // title
      g: tags, // tags
      s: session.sessionStartTime?.slice(0, 16), // start (truncate seconds)
    };
  });

  return JSON.stringify(condensed);
}

/**
 * Build the system prompt with sessions context
 */
function buildSystemPrompt(sessionsContext) {
  return `You are the Adobe MAX+ Schedule Assistant. Help attendees find relevant sessions.

Sessions (i=id, t=title, g=tags, s=start time):
${sessionsContext}

Respond with JSON only:
{"message":"Brief explanation","sessions":["id1","id2"]}

Rules:
- Return 3-5 session IDs from the "i" field
- Match user interests to session titles and tags
- Keep message under 2 sentences
- Empty sessions array if no matches`;
}

/**
 * Parse the AI response to extract message and session IDs
 */
function parseAIResponse(responseText) {
  try {
    // Try to parse as JSON directly
    const parsed = JSON.parse(responseText);
    return {
      message: parsed.message || responseText,
      sessionIds: parsed.sessions || [],
    };
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: parsed.message || responseText,
          sessionIds: parsed.sessions || [],
        };
      } catch {
        // Fall through
      }
    }
    // Return as plain message
    return {
      message: responseText,
      sessionIds: [],
    };
  }
}

/**
 * Format date for display
 */
function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format time for display
 */
function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Group sessions by date
 */
function groupSessionsByDate(sessionsList) {
  const groups = {};
  if (!Array.isArray(sessionsList)) return groups;
  
  sessionsList.forEach((session) => {
    const dateKey = session.sessionStartTime ? formatDate(session.sessionStartTime) : 'Unknown Date';
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
  });
  return groups;
}

/**
 * Parse simple markdown (bold) to HTML
 */
function parseMessageText(text) {
  if (!text) return '';
  // Convert **text** to <strong>text</strong>
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/**
 * Suggestion Button Component
 */
function SuggestionButton({ question, onClick, isLoading }) {
  return html`
    <button \
      class="schedule-assistant-suggestion" \
      onClick=${() => onClick(question)} \
      disabled=${isLoading} \
      type="button" \
    >
      <svg class="sparkle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <span>${question}</span>
    </button>
  `;
}

/**
 * Session Card Component for recommendations
 */
function SessionCard({ session, isSelected, isInSchedule, onToggle }) {
  const cardClass = `session-rec-card${isSelected ? ' selected' : ''}${isInSchedule ? ' in-schedule' : ''}`;
  
  const handleClick = () => {
    if (!isInSchedule) {
      onToggle(session.id);
    }
  };

  let checkboxEl;
  if (isInSchedule) {
    checkboxEl = html`<div class="checkbox-done"></div>`;
  } else if (isSelected) {
    checkboxEl = html`<div class="checkbox-selected"></div>`;
  } else {
    checkboxEl = html`<div class="checkbox-empty"></div>`;
  }

  return html`
    <div class=${cardClass} onClick=${handleClick}>
      <div class="session-rec-checkbox">${checkboxEl}</div>
      <div class="session-rec-info">
        <div class="session-rec-time">${formatTime(session.sessionStartTime)}</div>
        <div class="session-rec-title">${session.title || session.sessionTitle}</div>
      </div>
    </div>
  `;
}

/**
 * Session Recommendations Component
 */
function SessionRecommendations({ 
  recommendedSessions, 
  selectedSessionIds, 
  isInSchedule, 
  onToggle, 
  onAddSessions 
}) {
  if (!recommendedSessions || recommendedSessions.length === 0) return null;
  
  const groupedSessions = groupSessionsByDate(recommendedSessions);
  const dateKeys = Object.keys(groupedSessions);
  
  return html`
    <div class="session-recommendations">
      ${dateKeys.map((dateKey) => html`
        <div key=${dateKey} class="session-rec-date-group">
          <div class="session-rec-date">${dateKey}</div>
          ${groupedSessions[dateKey].map((session) => html`
            <${SessionCard} \
              key=${session.id} \
              session=${session} \
              isSelected=${selectedSessionIds.includes(session.id)} \
              isInSchedule=${isInSchedule(session.id)} \
              onToggle=${onToggle} \
            />
          `)}
        </div>
      `)}
      ${selectedSessionIds.length > 0 ? html`
        <button class="session-rec-add-btn" onClick=${onAddSessions} type="button">
          Add ${selectedSessionIds.length} session${selectedSessionIds.length > 1 ? 's' : ''} to schedule
        </button>
      ` : null}
    </div>
  `;
}

/**
 * Chat Message Component
 */
function ChatMessage({ message, selectedSessionIds, isInSchedule, onToggle, onAddSessions }) {
  const isAssistant = message.role === 'assistant';
  
  const iconEl = isAssistant ? html`
    <svg class="sparkle-icon message-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
  ` : null;
  
  const textHtml = parseMessageText(message.content);
  
  return html`
    <div class="schedule-assistant-message ${message.role}">
      ${iconEl}
      <div class="message-content">
        <div class="message-text" dangerouslySetInnerHTML=${{ __html: textHtml }}></div>
        <${SessionRecommendations} \
          recommendedSessions=${message.recommendedSessions} \
          selectedSessionIds=${selectedSessionIds} \
          isInSchedule=${isInSchedule} \
          onToggle=${onToggle} \
          onAddSessions=${onAddSessions} \
        />
      </div>
    </div>
  `;
}

/**
 * Typing Indicator Component
 */
function TypingIndicator() {
  return html`
    <div class="schedule-assistant-message assistant">
      <svg class="sparkle-icon message-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Chat Input Component
 */
function ChatInput({ query, onQueryChange, onSubmit, onKeyDown, isLoading, inputRef }) {
  return html`
    <form class="schedule-assistant-input-wrapper" onSubmit=${onSubmit}>
      <div class="schedule-assistant-input-container">
        <div class="schedule-assistant-input-row">
          <svg class="chat-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <mask id="mask-input-icon" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="6" y="6" width="20" height="20">
              <path d="M12.25 24.998C12.1504 24.998 12.0508 24.9785 11.956 24.9385C11.6797 24.8203 11.5 24.5488 11.5 24.248V20.998H10.75C8.68262 20.998 7 19.3154 7 17.248V11.748C7 9.68067 8.68262 7.99805 10.75 7.99805H14.7031C15.1172 7.99805 15.4531 8.33399 15.4531 8.74805C15.4531 9.16211 15.1172 9.49805 14.7031 9.49805H10.75C9.50977 9.49805 8.5 10.5078 8.5 11.748V17.248C8.5 18.4883 9.50977 19.498 10.75 19.498H12.25C12.6641 19.498 13 19.834 13 20.248V22.4844L15.8838 19.708C16.0234 19.5732 16.21 19.498 16.4043 19.498H21.25C22.4902 19.498 23.5 18.4883 23.5 17.248V15.9766C23.5 15.5625 23.8359 15.2266 24.25 15.2266C24.6641 15.2266 25 15.5625 25 15.9766V17.248C25 19.3154 23.3174 20.998 21.25 20.998H16.707L12.7705 24.7881C12.6279 24.9258 12.4404 24.998 12.25 24.998Z" fill="#DBDBDB"/>
              <path d="M19.2784 15.0829C19.0899 15.0829 18.9005 15.0341 18.7296 14.9355C18.3135 14.6962 18.1026 14.2206 18.2032 13.7519L18.6631 11.6269L17.2032 10.0165C16.8809 9.66105 16.8253 9.14445 17.0645 8.72941C17.3047 8.31437 17.7852 8.10343 18.2481 8.20304L20.3731 8.663L21.9835 7.20304C22.3389 6.88175 22.8585 6.82706 23.2706 7.06437C23.6866 7.30363 23.8975 7.77921 23.7969 8.24796L23.337 10.373L24.7969 11.9833C25.1192 12.3388 25.1749 12.8554 24.9356 13.2704C24.6954 13.6864 24.2188 13.8993 23.752 13.7968L21.627 13.3368L20.0167 14.7968C19.8087 14.9853 19.545 15.0829 19.2784 15.0829ZM19.1524 9.9335L19.9122 10.7714C20.1485 11.0292 20.2471 11.3925 20.1729 11.7401L19.9337 12.8476L20.7715 12.0878C21.0303 11.8515 21.3975 11.7538 21.7403 11.8271L22.8477 12.0663L22.0879 11.2284C21.8516 10.9706 21.753 10.6073 21.8272 10.2597L22.0665 9.15226L21.2286 9.91203C20.9708 10.1493 20.6055 10.2489 20.2598 10.1728L19.1524 9.9335Z" fill="#DBDBDB"/>
              <path d="M13.9326 17.5039C13.8037 17.5039 13.6748 17.4707 13.5576 17.4033C13.2754 17.2402 13.1309 16.9141 13.1992 16.5957L13.3769 15.7754L12.8135 15.1543C12.5947 14.9131 12.5566 14.5576 12.7197 14.2754C12.8828 13.9932 13.2109 13.8545 13.5273 13.917L14.3476 14.0947L14.9687 13.5312C15.2109 13.3125 15.5644 13.2744 15.8476 13.4375C16.1299 13.6006 16.2744 13.9267 16.206 14.2451L16.0283 15.0654L16.5918 15.6865C16.8105 15.9277 16.8486 16.2832 16.6855 16.5654C16.5225 16.8476 16.1933 16.9892 15.8779 16.9238L15.0576 16.7461L14.4365 17.3096C14.2949 17.4375 14.1143 17.5039 13.9326 17.5039Z" fill="#DBDBDB"/>
            </mask>
            <g mask="url(#mask-input-icon)">
              <rect x="6" y="6" width="20" height="20" fill="url(#paint-input-grad)"/>
            </g>
            <defs>
              <linearGradient id="paint-input-grad" x1="2.29167" y1="12.0741" x2="33.4393" y2="16.5098" gradientUnits="userSpaceOnUse">
                <stop offset="0.059183" stop-color="#9A3CF9"/>
                <stop offset="0.344409" stop-color="#E743C8"/>
                <stop offset="0.58317" stop-color="#ED457E"/>
                <stop offset="0.84223" stop-color="#FF7918"/>
              </linearGradient>
            </defs>
          </svg>
          <input \
            ref=${inputRef} \
            type="text" \
            class="schedule-assistant-input" \
            placeholder="Ask me anything?" \
            value=${query} \
            onInput=${(e) => onQueryChange(e.target.value)} \
            onKeyDown=${onKeyDown} \
            disabled=${isLoading} \
          />
        </div>
        <div class="schedule-assistant-controls-row">
          <button class="schedule-assistant-add-btn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <button \
            class="schedule-assistant-send-btn" \
            type="submit" \
            disabled=${!query.trim() || isLoading} \
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 2L11 13"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    </form>
  `;
}

/**
 * ScheduleAssistant Component
 */
export default function ScheduleAssistant({ renderTrigger, showFloatingButton = true }) {
  const { sessions, addToSchedule, isInSchedule } = useSessions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSessionIds, setSelectedSessionIds] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setMessages([]);
    setQuery('');
    setSelectedSessionIds([]);
    setDragOffset(0);
  };

  // Drag handlers for swipe-to-close
  const handleDragStart = (e) => {
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setDragStartY(clientY);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const offset = clientY - dragStartY;
    
    // Only allow dragging down
    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Close if dragged more than 100px down
    if (dragOffset > 100) {
      closeModal();
    } else {
      setDragOffset(0);
    }
    setDragStartY(0);
  };

  const handleToggleSelect = (sessionId) => {
    setSelectedSessionIds((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId);
      }
      return [...prev, sessionId];
    });
  };

  const handleAddSessions = () => {
    if (selectedSessionIds.length === 0) return;
    
    const count = selectedSessionIds.length;
    selectedSessionIds.forEach((sessionId) => {
      addToSchedule(sessionId);
    });
    setSelectedSessionIds([]);
    // Show confirmation in chat
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Done! ${count} session${count > 1 ? 's have' : ' has'} been added to your schedule.`,
        sessionIds: [],
      },
    ]);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setSelectedSessionIds([]);

    try {
      // Build context dynamically based on query for cost efficiency
      const sessionsContext = buildSessionsContext(sessions, text);
      const systemPrompt = buildSystemPrompt(sessionsContext);

      const response = await fetch(BEDROCK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BEDROCK_API_KEY()}`,
        },
        body: JSON.stringify({
          system: [{ text: systemPrompt }],
          messages: [{ role: 'user', content: [{ text }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.output?.message?.content?.[0]?.text
        || data.content?.[0]?.text
        || '{"message": "I apologize, but I was unable to process your request.", "sessions": []}';

      const { message, sessionIds } = parseAIResponse(responseText);

      // Find full session objects for recommended sessions
      const recommendedSessions = sessionIds
        .map((id) => sessions.find((s) => s.id === id))
        .filter(Boolean);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: message,
          sessionIds,
          recommendedSessions,
        },
      ]);
    } catch (error) {
      console.error('Bedrock API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          sessionIds: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(query);
  };

  const handleSuggestionClick = (question) => {
    sendMessage(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(query);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Render suggestions list
  const renderSuggestions = () => html`
    <div class="schedule-assistant-suggestions">
      ${SUGGESTED_QUESTIONS.map((question, idx) => html`
        <${SuggestionButton} \
          key=${idx} \
          question=${question} \
          onClick=${handleSuggestionClick} \
          isLoading=${isLoading} \
        />
      `)}
    </div>
  `;

  // Render messages list
  const renderMessages = () => html`
    <div class="schedule-assistant-messages">
      ${messages.map((msg, idx) => html`
        <${ChatMessage} \
          key=${idx} \
          message=${msg} \
          selectedSessionIds=${selectedSessionIds} \
          isInSchedule=${isInSchedule} \
          onToggle=${handleToggleSelect} \
          onAddSessions=${handleAddSessions} \
        />
      `)}
      ${isLoading ? html`<${TypingIndicator} />` : null}
      <div ref=${messagesEndRef}></div>
    </div>
  `;

  // Render modal content
  const renderModal = () => {
    if (!isModalOpen) return null;

    const modalStyle = dragOffset > 0 ? `transform: translateY(${dragOffset}px)` : '';
    const modalClass = `schedule-assistant-modal${isDragging ? ' dragging' : ''}`;

    return html`
      <div class="schedule-assistant-overlay" onClick=${handleOverlayClick}>
        <div \
          ref=${modalRef} \
          class=${modalClass} \
          style=${modalStyle} \
          onMouseMove=${handleDragMove} \
          onMouseUp=${handleDragEnd} \
          onMouseLeave=${handleDragEnd} \
          onTouchMove=${handleDragMove} \
          onTouchEnd=${handleDragEnd} \
        >
          <div class="schedule-assistant-handle"></div>
          
          <div \
            class="schedule-assistant-header" \
            onMouseDown=${handleDragStart} \
            onTouchStart=${handleDragStart} \
          >
            <button class="schedule-assistant-close" onClick=${closeModal} type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <h2 class="schedule-assistant-title">Ask Adobe MAX+ <em>anything</em></h2>
          </div>

          <div class="schedule-assistant-content">
            ${messages.length === 0 ? renderSuggestions() : renderMessages()}
          </div>

          <form class="schedule-assistant-input-wrapper" onSubmit=${handleSubmit}>
            <div class="schedule-assistant-input-container">
              <div class="schedule-assistant-input-row">
                <svg class="chat-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <mask id="mask-input-icon" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="6" y="6" width="20" height="20">
                    <path d="M12.25 24.998C12.1504 24.998 12.0508 24.9785 11.956 24.9385C11.6797 24.8203 11.5 24.5488 11.5 24.248V20.998H10.75C8.68262 20.998 7 19.3154 7 17.248V11.748C7 9.68067 8.68262 7.99805 10.75 7.99805H14.7031C15.1172 7.99805 15.4531 8.33399 15.4531 8.74805C15.4531 9.16211 15.1172 9.49805 14.7031 9.49805H10.75C9.50977 9.49805 8.5 10.5078 8.5 11.748V17.248C8.5 18.4883 9.50977 19.498 10.75 19.498H12.25C12.6641 19.498 13 19.834 13 20.248V22.4844L15.8838 19.708C16.0234 19.5732 16.21 19.498 16.4043 19.498H21.25C22.4902 19.498 23.5 18.4883 23.5 17.248V15.9766C23.5 15.5625 23.8359 15.2266 24.25 15.2266C24.6641 15.2266 25 15.5625 25 15.9766V17.248C25 19.3154 23.3174 20.998 21.25 20.998H16.707L12.7705 24.7881C12.6279 24.9258 12.4404 24.998 12.25 24.998Z" fill="#DBDBDB"/>
                    <path d="M19.2784 15.0829C19.0899 15.0829 18.9005 15.0341 18.7296 14.9355C18.3135 14.6962 18.1026 14.2206 18.2032 13.7519L18.6631 11.6269L17.2032 10.0165C16.8809 9.66105 16.8253 9.14445 17.0645 8.72941C17.3047 8.31437 17.7852 8.10343 18.2481 8.20304L20.3731 8.663L21.9835 7.20304C22.3389 6.88175 22.8585 6.82706 23.2706 7.06437C23.6866 7.30363 23.8975 7.77921 23.7969 8.24796L23.337 10.373L24.7969 11.9833C25.1192 12.3388 25.1749 12.8554 24.9356 13.2704C24.6954 13.6864 24.2188 13.8993 23.752 13.7968L21.627 13.3368L20.0167 14.7968C19.8087 14.9853 19.545 15.0829 19.2784 15.0829ZM19.1524 9.9335L19.9122 10.7714C20.1485 11.0292 20.2471 11.3925 20.1729 11.7401L19.9337 12.8476L20.7715 12.0878C21.0303 11.8515 21.3975 11.7538 21.7403 11.8271L22.8477 12.0663L22.0879 11.2284C21.8516 10.9706 21.753 10.6073 21.8272 10.2597L22.0665 9.15226L21.2286 9.91203C20.9708 10.1493 20.6055 10.2489 20.2598 10.1728L19.1524 9.9335Z" fill="#DBDBDB"/>
                    <path d="M13.9326 17.5039C13.8037 17.5039 13.6748 17.4707 13.5576 17.4033C13.2754 17.2402 13.1309 16.9141 13.1992 16.5957L13.3769 15.7754L12.8135 15.1543C12.5947 14.9131 12.5566 14.5576 12.7197 14.2754C12.8828 13.9932 13.2109 13.8545 13.5273 13.917L14.3476 14.0947L14.9687 13.5312C15.2109 13.3125 15.5644 13.2744 15.8476 13.4375C16.1299 13.6006 16.2744 13.9267 16.206 14.2451L16.0283 15.0654L16.5918 15.6865C16.8105 15.9277 16.8486 16.2832 16.6855 16.5654C16.5225 16.8476 16.1933 16.9892 15.8779 16.9238L15.0576 16.7461L14.4365 17.3096C14.2949 17.4375 14.1143 17.5039 13.9326 17.5039Z" fill="#DBDBDB"/>
                  </mask>
                  <g mask="url(#mask-input-icon)">
                    <rect x="6" y="6" width="20" height="20" fill="url(#paint-input-grad)"/>
                  </g>
                  <defs>
                    <linearGradient id="paint-input-grad" x1="2.29167" y1="12.0741" x2="33.4393" y2="16.5098" gradientUnits="userSpaceOnUse">
                      <stop offset="0.059183" stop-color="#9A3CF9"/>
                      <stop offset="0.344409" stop-color="#E743C8"/>
                      <stop offset="0.58317" stop-color="#ED457E"/>
                      <stop offset="0.84223" stop-color="#FF7918"/>
                    </linearGradient>
                  </defs>
                </svg>
                <input \
                  ref=${inputRef} \
                  type="text" \
                  class="schedule-assistant-input" \
                  placeholder="Ask me anything?" \
                  value=${query} \
                  onInput=${(e) => setQuery(e.target.value)} \
                  onKeyDown=${handleKeyDown} \
                  disabled=${isLoading} \
                />
              </div>
              <div class="schedule-assistant-controls-row">
                <button class="schedule-assistant-add-btn" type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <button \
                  class="schedule-assistant-send-btn" \
                  type="submit" \
                  disabled=${!query.trim() || isLoading} \
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>

          <p class="schedule-assistant-disclaimer">
            AI responses may be inaccurate and any offers provided are non-binding. <a href="#">Terms.</a>
          </p>
        </div>
      </div>
    `;
  };

  // Default floating button
  const renderDefaultButton = () => {
    if (!showFloatingButton) return null;
    
    return html`
      <button class="schedule-assistant-btn" onClick=${openModal} type="button">
        <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="btn-chat-grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF4DD8"/>
              <stop offset="0.5" stop-color="#FF6B6B"/>
              <stop offset="1" stop-color="#FFB84D"/>
            </linearGradient>
          </defs>
          <path d="M21 11.5C21 12.82 20.7 14.12 20.1 15.3C19.39 16.71 18.31 17.9 16.97 18.73C15.63 19.56 14.08 20 12.5 20C11.18 20 9.88 19.7 8.7 19.1L3 21L4.9 15.3C4.3 14.12 4 12.82 4 11.5C4 9.92 4.44 8.37 5.27 7.03C6.1 5.69 7.29 4.61 8.7 3.9C9.88 3.3 11.18 3 12.5 3H13C15.08 3.12 17.05 3.99 18.53 5.47C20.01 6.95 20.89 8.92 21 11V11.5Z" stroke="url(#btn-chat-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 10L9.5 9L10.5 8.5L9.5 8L9 7L8.5 8L7.5 8.5L8.5 9L9 10Z" fill="url(#btn-chat-grad)"/>
          <path d="M14 12L14.75 10.75L16 10L14.75 9.25L14 8L13.25 9.25L12 10L13.25 10.75L14 12Z" fill="url(#btn-chat-grad)"/>
        </svg>
        <span>Schedule Assistant</span>
      </button>
    `;
  };

  return html`
    <div>
      ${renderTrigger ? renderTrigger({ onClick: openModal }) : renderDefaultButton()}
      ${renderModal()}
    </div>
  `;
}
