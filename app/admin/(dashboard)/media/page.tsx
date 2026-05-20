'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  modified: string;
  usedIn: string[];
}

interface ProjectOption {
  id: number;
  title: string;
}

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProjectId, setUploadProjectId] = useState('');
  const [associatingFile, setAssociatingFile] = useState('');
  const [assocProjectId, setAssocProjectId] = useState('');

  const loadFiles = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/media').then(r => r.json()),
      fetch('/api/admin/projects').then(r => r.json()),
    ]).then(([media, projs]) => {
      setFiles(media);
      setProjects(projs.map((p: { id: number; title: string }) => ({ id: p.id, title: p.title })));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const { url } = await res.json();
      if (uploadProjectId) {
        const isVideo = /\.(mp4|webm|ogg)$/i.test(file.name);
        await fetch('/api/admin/media/associate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: Number(uploadProjectId), url, type: isVideo ? 'video' : 'image' }),
        });
      }
      loadFiles();
    }
    setUploading(false);
  }

  async function associateFile(file: MediaFile) {
    if (!assocProjectId) return;
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file.name);
    await fetch('/api/admin/media/associate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: Number(assocProjectId), url: file.url, type: isVideo ? 'video' : 'image' }),
    });
    setAssociatingFile('');
    setAssocProjectId('');
    loadFiles();
  }

  async function handleDelete(file: MediaFile) {
    if (!confirm(`Delete "${file.name}"?`)) return;
    const param = file.url.startsWith('http') ? `url=${encodeURIComponent(file.url)}` : `name=${encodeURIComponent(file.name)}`;
    const res = await fetch(`/api/admin/media?${param}`, { method: 'DELETE' });
    if (res.ok) setFiles(prev => prev.filter(f => f.name !== file.name));
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  const selectStyle = {
    padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(210,180,140,0.15)',
    background: 'rgba(255,255,255,0.03)', color: '#f0e6d3', fontSize: '0.85rem',
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Media Library</h1>

      <div style={{
        marginBottom: 24, padding: 20, borderRadius: 10,
        border: '2px dashed rgba(210,180,140,0.15)',
        background: 'rgba(255,255,255,0.01)',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <label style={{
          background: '#c9973a', color: '#0a0907', padding: '10px 24px', borderRadius: 6,
          fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
        }}>
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" onChange={handleUpload} disabled={uploading}
            style={{ display: 'none' }} accept="image/*,video/*" />
        </label>
        <select value={uploadProjectId} onChange={e => setUploadProjectId(e.target.value)} style={selectStyle}>
          <option value="" style={{ color: '#000' }}>No project (just upload)</option>
          {projects.map(p => (
            <option key={p.id} value={p.id} style={{ color: '#000' }}>{p.title}</option>
          ))}
        </select>
        <span style={{ fontSize: '0.8rem', color: 'rgba(240,220,190,0.4)' }}>
          Images &amp; video up to 50MB
        </span>
      </div>

      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {files.map(file => (
            <div key={file.name} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(210,180,140,0.08)',
              borderRadius: 10, overflow: 'hidden',
            }}>
              {/\.(mp4|webm|ogg)$/i.test(file.name) ? (
                <video src={file.url} style={{ width: '100%', height: 130, objectFit: 'cover' }} muted />
              ) : (
                <div style={{ position: 'relative', width: '100%', height: 130 }}>
                  <Image src={file.url} alt={file.name} fill style={{ objectFit: 'cover' }} unoptimized
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: '0.8rem', color: '#f0e6d3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(240,220,190,0.4)', marginTop: 2 }}>{formatSize(file.size)}</div>
                <div style={{ fontSize: '0.7rem', marginTop: 4 }}>
                  {file.usedIn.length > 0 ? (
                    <span style={{ color: '#4a9eff' }}>Used in: {file.usedIn.join(', ')}</span>
                  ) : associatingFile === file.name ? (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <select value={assocProjectId} onChange={e => setAssocProjectId(e.target.value)}
                        style={{ ...selectStyle, fontSize: '0.75rem', padding: '4px 8px', flex: 1, minWidth: 100 }}>
                        <option value="" style={{ color: '#000' }}>Select project...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id} style={{ color: '#000' }}>{p.title}</option>
                        ))}
                      </select>
                      <button onClick={() => associateFile(file)}
                        disabled={!assocProjectId}
                        style={{
                          background: '#4a9eff', border: 'none', color: '#fff', padding: '4px 8px',
                          borderRadius: 4, cursor: assocProjectId ? 'pointer' : 'not-allowed', fontSize: '0.7rem',
                        }}>
                        Save
                      </button>
                      <button onClick={() => { setAssociatingFile(''); setAssocProjectId(''); }}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.7rem', padding: 0 }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(240,220,190,0.25)' }}>
                      Unused
                      <button onClick={() => setAssociatingFile(file.name)}
                        style={{ background: 'none', border: 'none', color: '#c9973a', cursor: 'pointer', fontSize: '0.7rem', padding: 0, marginLeft: 6 }}>
                        Associate
                      </button>
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <a href={file.url} target="_blank"
                    style={{ color: '#4a9eff', textDecoration: 'none', fontSize: '0.8rem' }}>View</a>
                  <button onClick={() => handleDelete(file)}
                    style={{ background: 'none', border: 'none', color: '#ff5252', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
