import { useState, useEffect } from 'react';
import './Offers.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/offers');
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchOffers();
    };
    load();
  }, []);

  return (
    <section className="offers" id="offers">
      <div className="container">
        <h2>Daily Offers & Discounts</h2>
        <div className="offers-grid">
          {offers.map(offer => {
            const imageUrl = offer.image
              ? offer.image.startsWith('http')
                ? offer.image
                : `http://localhost:5000${offer.image}`
              : null;

            return (
              <div key={offer._id || offer.id} className="offer-card">
                {imageUrl && <img src={imageUrl} alt={offer.title} />}
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                {offer.discount && (
                  <p className="discount">
                    <strong>Discount:</strong> {offer.discount}
                    {offer.discountType === 'percentage' ? '%' : '$'}
                  </p>
                )}
                <p><strong>Valid From:</strong> {new Date(offer.validFrom).toLocaleDateString()}</p>
                <p><strong>Valid To:</strong> {new Date(offer.validTo).toLocaleDateString()}</p>
                {offer.applicableTo && <p><strong>Applicable To:</strong> {offer.applicableTo}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Offers;