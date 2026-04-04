import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: ''
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    discountType: 'percentage',
    validFrom: '',
    validTo: '',
    applicableTo: '',
    image: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchEvents();
      await fetchOffers();
      await fetchUsers();
    };
    load();
  }, []);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', eventForm.title);
    formData.append('description', eventForm.description);
    formData.append('date', eventForm.date);
    formData.append('time', eventForm.time);
    formData.append('location', eventForm.location);
    if (eventForm.image) {
      if (typeof eventForm.image === 'string') {
        formData.append('image', eventForm.image);
      } else {
        formData.append('image', eventForm.image);
      }
    }

    const method = editingEvent ? 'PUT' : 'POST';
    const url = editingEvent 
      ? `/api/events/${editingEvent}` 
      : '/api/events';

    try {
      const response = await fetch(url, {
        method: method,
        body: formData
      });
      if (response.ok) {
        alert(`Event ${editingEvent ? 'updated' : 'added'} successfully!`);
        setEventForm({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          image: null
        });
        setEditingEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', offerForm.title);
    formData.append('description', offerForm.description);
    formData.append('discount', offerForm.discount);
    formData.append('discountType', offerForm.discountType);
    formData.append('validFrom', offerForm.validFrom);
    formData.append('validTo', offerForm.validTo);
    formData.append('applicableTo', offerForm.applicableTo);
    if (offerForm.image) {
      if (typeof offerForm.image === 'string') {
        formData.append('image', offerForm.image);
      } else {
        formData.append('image', offerForm.image);
      }
    }

    const method = editingOffer ? 'PUT' : 'POST';
    const url = editingOffer 
      ? `/api/offers/${editingOffer}` 
      : '/api/offers';

    try {
      const response = await fetch(url, {
        method: method,
        body: formData
      });
      if (response.ok) {
        alert(`Offer ${editingOffer ? 'updated' : 'added'} successfully!`);
        setOfferForm({
          title: '',
          description: '',
          discount: '',
          discountType: 'percentage',
          validFrom: '',
          validTo: '',
          applicableTo: '',
          image: null
        });
        setEditingOffer(null);
        fetchOffers();
      }
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Event deleted successfully!');
          fetchEvents();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        const response = await fetch(`/api/offers/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Offer deleted successfully!');
          fetchOffers();
        }
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || '',
      location: event.location || '',
      image: event.image || ''
    });
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer.id);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      discount: offer.discount || '',
      discountType: offer.discountType || 'percentage',
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      applicableTo: offer.applicableTo || '',
      image: offer.image || ''
    });
  };



  const cancelEdit = () => {
    setEditingEvent(null);
    setEditingOffer(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      image: ''
    });
    setOfferForm({
      title: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      validFrom: '',
      validTo: '',
      applicableTo: '',
      image: ''
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Ooveva Cafe Admin Panel</h1>
        <Link to="/" className="back-link">← Back to Website</Link>
      </header>
      <div className="admin-content">
        <div className="admin-section">
          <h2>Manage Events</h2>
          <div className="admin-grid">
            <div className="form-section">
              <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
            <form onSubmit={handleEventSubmit}>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Event Description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                />
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  required
                />
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventForm({...eventForm, image: e.target.files[0]})}
                />
                {eventForm.image && typeof eventForm.image === 'string' && (
                  <p>Current image: {eventForm.image}</p>
                )}
                <div className="form-buttons">
                  <button type="submit">{editingEvent ? 'Update Event' : 'Add Event'}</button>
                  {editingEvent && <button type="button" onClick={cancelEdit} className="cancel-btn">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="list-section">
              <h3>Existing Events</h3>
              <div className="items-list">
                {events.map(event => (
                  <div key={event.id} className="item-card">
                    <div className="item-info">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                      <small>{new Date(event.date).toLocaleDateString()}</small>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEditEvent(event)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p>No events found.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Manage Offers</h2>
          <div className="admin-grid">
            <div className="form-section">
              <h3>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
              <form onSubmit={handleOfferSubmit}>
                <input
                  type="text"
                  placeholder="Offer Title"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Offer Description"
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Discount Amount"
                  value={offerForm.discount}
                  onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})}
                />
                <select
                  value={offerForm.discountType}
                  onChange={(e) => setOfferForm({...offerForm, discountType: e.target.value})}
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Amount ($)</option>
                </select>
                <input
                  type="date"
                  placeholder="Valid From"
                  value={offerForm.validFrom}
                  onChange={(e) => setOfferForm({...offerForm, validFrom: e.target.value})}
                  required
                />
                <input
                  type="date"
                  placeholder="Valid To"
                  value={offerForm.validTo}
                  onChange={(e) => setOfferForm({...offerForm, validTo: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Applicable To (e.g., all, coffee)"
                  value={offerForm.applicableTo}
                  onChange={(e) => setOfferForm({...offerForm, applicableTo: e.target.value})}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOfferForm({...offerForm, image: e.target.files[0]})}
                />
                {offerForm.image && typeof offerForm.image === 'string' && (
                  <p>Current image: {offerForm.image}</p>
                )}
                <div className="form-buttons">
                  <button type="submit">{editingOffer ? 'Update Offer' : 'Add Offer'}</button>
                  {editingOffer && <button type="button" onClick={cancelEdit} className="cancel-btn">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="list-section">
              <h3>Existing Offers</h3>
              <div className="items-list">
                {offers.map(offer => (
                  <div key={offer.id} className="item-card">
                    <div className="item-info">
                      <h4>{offer.title}</h4>
                      <p>{offer.description}</p>
                      <small>
                        {offer.discount && `${offer.discount}${offer.discountType === 'percentage' ? '%' : '$'}`} | 
                        Valid: {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleEditOffer(offer)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteOffer(offer.id)} className="delete-btn">Delete</button>
                    </div>
                  </div>
                ))}
                {offers.length === 0 && <p>No offers found.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Registered Users</h2>
          <div className="list-section">
            <h3>All Users</h3>
            <div className="items-list">
              {users.map(user => (
                <div key={user.id} className="item-card">
                  <div className="item-info">
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                    <small>Role: {user.role || 'user'}</small>
                    <small>Registered: {new Date(user.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p>No users found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;