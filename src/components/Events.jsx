import { useState, useEffect } from 'react';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <section className="events" id="events">
      <div className="container">
        <h2>Daily Events</h2>
        <div className="events-grid">
          {events.map(event => {
            const imageUrl = event.image
              ? event.image.startsWith('http')
                ? event.image
                : `${event.image}`
              : null;

            return (
              <div key={event._id || event.id} className="event-card">
                {imageUrl && <img src={imageUrl} alt={event.title} />}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                {event.time && <p><strong>Time:</strong> {event.time}</p>}
                {event.location && <p><strong>Location:</strong> {event.location}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Events;