
import { useState, useEffect } from 'react';
import './UserProfile.css';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, getSubscription } from '../../service/apiService'; 

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  const { user, isLoading: authLoading, isInitialized, fetchProfile } = useAuth();
    const [subscription, setSubscription] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        country: user.country || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      });
      
      const fetchSubscription = async () => {
        try {
          const subData = await getSubscription();
          setSubscription(subData);
        } catch (err) {
          console.error("Failed to fetch subscription:", err);
        }
      };
      fetchSubscription();
    }
  }, [user]); 

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
      
      if (fetchProfile) {
        await fetchProfile(localStorage.getItem('authToken'));
      }
      setTimeout(() => setSuccess(''), 3000); 
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      setTimeout(() => setError(''), 5000); 
    } finally {
      setIsUpdating(false);
    }
  };
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');
    console.log("Password change submitted:", passwordData);
        setTimeout(() => {
      setSuccess('Password change requested! (Implement API call)');
      setIsUpdating(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };


  const renderTabContent = () => {
    if (!user) return <div className="loading-state">Loading details...</div>;

    switch (activeTab) {
      case 'billing':
        const billingHistory = user.billingHistory || []; 
        return (
          <div className="tab-pane">
            <h3>Billing History</h3>
            <p style={{color: '#a0a6b1', fontStyle: 'italic'}}>Note: Billing history is not yet connected to the backend.</p>
            {billingHistory.length > 0 ? (
              <table className="billing-table">
              </table>
            ) : <p style={{color:"#fff"}}>No billing history found.</p>}
          </div>
        );
      case 'notifications':
        const notifications = user.notifications || {};
        return (
          <div className="tab-pane">
            <h3>Notification Settings</h3>
            <p style={{color: '#a0a6b1', fontStyle: 'italic'}}>Note: Notification settings are not yet connected to the backend.</p>
             <div className="notification-item">
               <div className="notification-text"><h4>New Film Announcements</h4><p>...</p></div>
               <label className="switch"><input type="checkbox" defaultChecked={notifications.newFilms} /><span className="slider"></span></label>
             </div>
             <button className="profile-submit-btn" style={{marginTop: '2rem'}}>Save Settings</button>
          </div>
        );
      case 'account':
      default:
        return (
          <div className="tab-pane">
            <h3>Account Details</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <form className="profile-form" onSubmit={handleProfileUpdateSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} disabled={isUpdating} />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} disabled={isUpdating} />
                </div>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} disabled={isUpdating} />
                </div>
                <div className="input-group">
                  <label htmlFor="gender">Gender</label>
                  <select id="gender" value={formData.gender} onChange={handleInputChange} disabled={isUpdating}>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
               <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="country">Country</label>
                  <input type="text" id="country" value={formData.country} onChange={handleInputChange} disabled={isUpdating} />
                </div>
                 <div className="input-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input type="tel" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} disabled={isUpdating} />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" value={user.email} readOnly disabled />
                <small>Email and username cannot be changed.</small>
              </div>
              <button type="submit" className="profile-submit-btn" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <h3 className="form-divider">Change Password</h3>
            <form className="profile-form" onSubmit={handlePasswordChangeSubmit}>
              <div className="input-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} disabled={isUpdating} />
              </div>
              <div className="input-group">
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} disabled={isUpdating} />
              </div>
              <button type="submit" className="profile-submit-btn" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        );
    }
  };

  if (!isInitialized || authLoading) {
    return <div className="loading-state profile-loading">Loading Your Profile...</div>;
  }
  
  if (!user) {
    return <div className="error-state profile-error">
      <p>Could not load user profile. Please log in again.</p>
    </div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img src={user.profilePictureUrl || `https://placehold.co/100x100/23282E/EAEAEA?text=${(user.firstName || user.username)[0]}`} alt="User Avatar" className="profile-avatar" />
        <div className="profile-header-text">
          <h1>Welcome, {user.firstName || user.username}</h1>
          <p>Manage your account, membership, and preferences.</p>
        </div>
      </header>

      <main className="profile-content">
        <aside className="profile-sidebar">
          <div className="membership-card">
            <h4>Membership Status</h4>
            {subscription ? (
              <>
                <p className="plan-name">{subscription.planType}</p>
                <p className={`status-${subscription.status.toLowerCase()}`}>{subscription.status}</p>
                <div className="billing-info">
                  <p>Next billing date:</p>
                  <p>{new Date(subscription.expiryDate).toLocaleDateString()}</p>
                </div>
              </>
            ) : (
              <p>No active subscription found.</p>
            )}
            <button className="manage-plan-btn" onClick={() => navigate('/membership')}>Manage Plan</button>
          </div>
        </aside>

        <div className="profile-main">
          <div className="tab-nav">
            <button className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Account</button>
            <button className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>Billing</button>
            <button className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
          </div>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

