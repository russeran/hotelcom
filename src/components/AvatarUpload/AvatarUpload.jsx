import { useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { updateAvatar } from '../../utilities/users-service';
import './AvatarUpload.css';

export default function AvatarUpload({ user, setUser }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!file) return;
        setError('');
        setSaving(true);
        try {
            const updatedUser = await updateAvatar(file);
            setUser(updatedUser);
            setFile(null);
            e.target.reset();
        } catch (err) {
            setError('Upload failed - try a different image');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="avatar-upload">
            <Image
                src={user.avatar || '/logo192.png'}
                roundedCircle
                width={96}
                height={96}
                alt={`${user.name} avatar`}
                className="avatar-preview"
            />
            <Form onSubmit={handleSubmit} className="avatar-form">
                <Form.Control
                    type="file"
                    accept="image/*"
                    aria-label="Choose a profile picture"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Button type="submit" variant="success" disabled={!file || saving}>
                    {saving ? 'Uploading...' : 'Upload photo'}
                </Button>
            </Form>
            {error && <p className="avatar-error">{error}</p>}
        </div>
    );
}
