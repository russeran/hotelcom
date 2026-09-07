import AvatarUpload from '../../components/AvatarUpload/AvatarUpload';
import './ProfilePage.css';

export default function ProfilePage({ user, setUser }) {
    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Your Profile</h1>
                    <p className="section-subtitle">Manage your account settings</p>
                </div>
            </header>

            <div className="surface-card page-card profile-card">
                <div className="profile-info">
                    <div className="profile-detail">
                        <span className="profile-label">Name</span>
                        <span className="profile-value">{user.name}</span>
                    </div>
                    <div className="profile-detail">
                        <span className="profile-label">Email</span>
                        <span className="profile-value">{user.email}</span>
                    </div>
                    <div className="profile-detail">
                        <span className="profile-label">Role</span>
                        <span className={`role-badge role-${user.role || 'staff'}`}>{user.role || 'staff'}</span>
                    </div>
                    {user.department && (
                        <div className="profile-detail">
                            <span className="profile-label">Department</span>
                            <span className="profile-value">{user.department}</span>
                        </div>
                    )}
                </div>

                <div className="profile-divider"></div>

                <div className="profile-photo-section">
                    <h2 className="section-subtitle">Profile Photo</h2>
                    <p className="muted mb-3">Upload a profile picture to personalize your account</p>
                    <AvatarUpload user={user} setUser={setUser} />
                </div>
            </div>
        </div>
    );
}
