
import React, { useState } from 'react';
import '../style/ContactUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

export default function ContactUs() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Thanks for contacting us!');
        setFormData({ name: '', email: '', message: '' }); // Reset form
        setShowForm(false);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      alert('❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-toggle" onClick={toggleForm}>
        <FontAwesomeIcon icon={faComments} size="lg" />
      </div>

      {showForm && (
        <div className="contact-overlay" onClick={() => setShowForm(false)}>
          <div className="contact-form" onClick={(e) => e.stopPropagation()}>
            <h3>Contact Us</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
