import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonInput,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
} from '@ionic/react';
import { search } from 'ionicons/icons';
import { AramaYap } from '../utils/api';

const AraPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSegment, setActiveSegment] = useState<'movie' | 'tv'>('movie');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (searchValue) {
      handleArama();
    } else {
      setSearchResults([]);
    }
  }, [searchValue, activeSegment]);

  const handleArama = async () => {
    if (searchValue) {
      try {
        const data = await AramaYap(searchValue, activeSegment);
        if (data) {
          setSearchResults(data);
          setSearchError(null);
        } else {
          setSearchResults([]);
          setSearchError('Arama sırasında bir hata oluştu.');
        }
      } catch (error) {
        console.error('Arama hatası: ' + error);
        setSearchResults([]);
        setSearchError('Arama sırasında bir hata oluştu.');
      }
    } else {
      setSearchResults([]);
      setSearchError(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ara</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IonInput
            value={searchValue}
            placeholder="Ara"
            onIonChange={(e) => setSearchValue(e.detail.value!)}
            style={{ flex: '1' }}
          />
          <IonButton onClick={handleArama}>
            <IonIcon icon={search} />
          </IonButton>
        </div>
        <IonSegment
          value={activeSegment}
          onIonChange={(e) => setActiveSegment(e.detail.value as 'movie' | 'tv')}
        >
          <IonSegmentButton value="movie">Filmler</IonSegmentButton>
          <IonSegmentButton value="tv">Diziler</IonSegmentButton>
        </IonSegment>
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <IonCard key={index}>
               <Link to={`/icerik/${activeSegment}/${result.id}`} style={{ textDecoration: 'none', color: '#ebebeb' }}>
              <IonCardHeader>
                <IonCardTitle>{activeSegment === 'movie' ? result.title : result.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {result.poster_path ? (
                  <IonImg
                    style={{ maxWidth: '50px', float: 'left', marginRight: '10px' }}
                    src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                    alt={result.title || result.name}
                  />
                ) : null}
                <p>Tür: {activeSegment === 'movie' ? 'Film' : 'Dizi'}</p>
                <p>{activeSegment === 'movie' ? 'Yayın Tarihi' : 'İlk Yayın Tarihi'}: {activeSegment === 'movie' ? result.release_date : result.first_air_date}</p>
                <p>Oy Oranı: {result.vote_average}</p>
              </IonCardContent>
              </Link>
            </IonCard>
          ))
        ) : (
          searchError ? (
            <p>{searchError}</p>
          ) : (
            <p>Aranan içerik bulunamadı.</p>
          )
        )}
      </IonContent>
    </IonPage>
  );
};

export default AraPage;