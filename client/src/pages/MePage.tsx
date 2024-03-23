import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonThumbnail, IonImg, IonButtons, IonMenuButton } from '@ionic/react';
import { getİzlemeListesi, getPuanlarim, Movie, getBilgi } from '../utils/api';

const MePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'izlemelistesi' | 'puanlarim'>('izlemelistesi');
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [puanlarim, setPuanlarim] = useState<Movie[]>([]);
  const [filmDataList, setFilmDataList] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'izlemelistesi') {
      fetchWatchlist();
    } else if (activeTab === 'puanlarim') {
      fetchPuanlarim();
    }
  }, [activeTab]);

  const fetchWatchlist = async () => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };
    const watchlistData = await getİzlemeListesi(headers);
    setWatchlist(watchlistData);
    fetchFilmDataList(watchlistData);
  };

  const fetchPuanlarim = async () => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };
    const puanlarimData = await getPuanlarim(headers);
    setPuanlarim(puanlarimData);
    fetchFilmDataList(puanlarimData);
  };

  const fetchFilmDataList = async (movies: Movie[]) => {
    const dataPromises = movies.map(async (movie:any) => {
      const filmDetails = (await getBilgi(movie.filmId, movie.tur)).data;
      return { ...filmDetails, puan: movie.puan, filmid: movie.filmId, tur: movie.tur, date: formatDate(movie.date) };
    });

    const filmDataList = await Promise.all(dataPromises);
    setFilmDataList(filmDataList);
  };

  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Profilim</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSegment
          value={activeTab}
          onIonChange={(e) => setActiveTab(e.detail.value as 'izlemelistesi' | 'puanlarim')}
        >
          <IonSegmentButton value="izlemelistesi">
            <IonLabel>İzleme Listesi</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="puanlarim">
            <IonLabel>Değerlendirme</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonList>
         {filmDataList.length == 0 ? (
            <IonItem>
            <IonLabel>
              <h2>Henüz bir şey eklenmemiş</h2>
            </IonLabel>
          </IonItem>
         ) : (
          filmDataList.map((filmData, index) => (
            <IonItem key={index}>
              <Link to={`/icerik/${filmData.tur}/${filmData.filmid}`} style={{ textDecoration: 'none', color: '#ebebeb' }}>
              <IonThumbnail slot="start">
                <IonImg src={filmData.tur === 'local' ? filmData.poster_path : `https://image.tmdb.org/t/p/w500${filmData.poster_path}`} alt={filmData.original_title} />
              </IonThumbnail>
              <IonLabel>
                <h2>{filmData.original_title}</h2>
                <p>{filmData.date}</p>
                {activeTab === 'puanlarim' && <p>Puan: {filmData.puan}</p>}
              </IonLabel>
              </Link>
            </IonItem>
          ))
         )
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default MePage;