import React, { useEffect } from 'react';
import './TrailerModal.css';

export default function TrailerModal({ movie, onClose }) {

  // تحويل أي رابط Youtube إلى embed
  const getEmbedUrl = (url) => {
    if (!url) return null;

    const idMatch = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&#?/]+)/);
    const videoId = idMatch ? idMatch[1] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  // fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Empêcher le défilement du body quand la modal est ouverte
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!movie) return null;

  const embedUrl = getEmbedUrl(movie.trailerUrl);

  return (
    <div className="trailer-modal-overlay active" onClick={onClose}>
      <div
        className="trailer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="trailer-modal-close" onClick={onClose}>×</button>

        <div className="trailer-specific">
          <h3>Bande-annonce : {movie.title}</h3>

          <div className="trailer-video-container">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`Bande-annonce ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="no-trailer">
                <p>Bande-annonce non disponible</p>
              </div>
            )}
          </div>

          <div className="trailer-actions">
            <button
              className="btn-reserve-from-trailer"
              onClick={() => {
                onClose();
                window.location.href = `/reservation/${movie.id}`;
              }}
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}