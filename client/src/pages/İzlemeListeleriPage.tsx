import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { starSharp } from 'ionicons/icons';
import 'swiper/swiper-bundle.css';
import { getİzlemeListeleri, Movie } from '../utils/api';
import './İzlemeListeleriPage.css';
import { Link } from 'react-router-dom';

const IzlemeListeleriPage: React.FC = () => {
  const [izlemeListeleri, setIzlemeListeleri] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const izlemeListeleriResponse = await getİzlemeListeleri();
        setIzlemeListeleri(izlemeListeleriResponse);
      } catch (error) {
        console.error('error: ' + error);
      }
    };

    fetchData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>İzleme Listeleri</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {izlemeListeleri.map((izlemeListesi) => (
          <div key={izlemeListesi.kullaniciAdi} >
            <h1>{izlemeListesi.kullaniciAdi}'nin İzleme Listesi</h1>
            <Swiper slidesPerView={2}>
              {izlemeListesi.izlemeListesi.map((movie: Movie) => (
                <SwiperSlide key={movie.id}>
                  <Link to={`/icerik/${movie.tur}/${movie.id}`}>
                    <div className="movie-card">
                      <div className="movie-image-container">,
                        <img src={movie.poster_path} alt={movie.title} />
                        <div className="movie-info">
                          <h3>{movie.title}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default IzlemeListeleriPage;