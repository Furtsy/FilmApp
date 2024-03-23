import React, { useState, useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonLoading } from '@ionic/react';
import { calendarClearOutline, starSharp, timeSharp } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Browser } from '@capacitor/browser';
import 'swiper/swiper-bundle.css';
import { getVizyonMovies, getPopulerMovies, getYakindaMovies, getCineverseVizyonMovies, getCineverseYakindaMovies, getIcerikler, getEniyiler,  Movie } from '../utils/api';
import './HomePage.css';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [vizyon, setVizyon] = useState<Movie[]>([]);
  const [populer, setPopuler] = useState<Movie[]>([]);
  const [yakinda, setYakinda] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [cineversevizyon, setCineverseVizyon] = useState<Movie[]>([]);
  const [cineverseyakinda, setCineverseYakinda] = useState<Movie[]>([]);
  const [icerikler, setIcerikler] = useState<Movie[]>([]);
  const [eniyiler, setEniyiler] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vizyonResponse = await getVizyonMovies();
        const populerResponse = await getPopulerMovies();
        const yakindaResponse = await getYakindaMovies();
        const cineverseVizyonResponse = await getCineverseVizyonMovies();
        const cineverseYakindaResponse = await getCineverseYakindaMovies();
        const iceriklerResponse = await getIcerikler();
        const eniyilerResponse = await getEniyiler();

        setVizyon(vizyonResponse);
        setPopuler(populerResponse);
        setYakinda(yakindaResponse);
        setCineverseVizyon(cineverseVizyonResponse);
        setCineverseYakinda(cineverseYakindaResponse);
        setIcerikler(iceriklerResponse);
        setEniyiler(eniyilerResponse);
      } catch (error) {
        console.error('error: ' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openCineversePage = async (cineverseURL:any) => {
    await Browser.open({ url: cineverseURL });
  };

  return (
    <IonPage>
      <IonHeader>
  <IonToolbar>
    <IonButtons slot="start">
      <IonMenuButton />
    </IonButtons>
    <IonTitle>Anasayfa</IonTitle>
  </IonToolbar>
</IonHeader>

<IonLoading
                isOpen={loading}
                message={'Api ile iletişim kuruluyor...'}
            />

<IonHeader collapse="condense">
  <IonToolbar>
    <IonTitle size="large">Anasayfa</IonTitle>
  </IonToolbar>
</IonHeader>

<IonContent className="ion-padding">
        <IonHeader collapse="condense">

        </IonHeader>
        <h1>Vizyondakiler</h1>
        <Swiper
  spaceBetween={10}
  slidesPerView={2}
>
  {vizyon.map((movie) => (
    <SwiperSlide key={(movie as Movie).id}>
      <Link to={`/icerik/movie/${(movie as Movie).id}`}>
        <div className="movie-card">
          <div className="movie-image-container">
            <img
              src={`https://image.tmdb.org/t/p/w500/${(movie as Movie).poster_path}`}
              alt={(movie as Movie).title}
            />
            <div className="movie-info">
              <h3>{(movie as Movie).title}</h3>
              <p>
                {(movie as Movie).release_date}{" "}
                <IonIcon aria-hidden="true" slot="start" icon={calendarClearOutline} />{" "}
              </p>
              <p>
                {(movie as Movie).vote_average}{" "}
                <IonIcon aria-hidden="true" slot="start" icon={starSharp} />
              </p>
            </div>
          </div>
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>
        <h1>Popüler</h1>
        <Swiper
        spaceBetween={10}
        slidesPerView={2}
      >
        {populer.map((movie) => (
    <SwiperSlide key={(movie as Movie).id}>
      <Link to={`/icerik/movie/${(movie as Movie).id}`}>
    <div className="movie-card">
      <div className="movie-image-container">
        <img
          src={`https://image.tmdb.org/t/p/w500/${(movie as Movie).poster_path}`}
          alt={(movie as Movie).title}
        />
        <div className="movie-info">
          <h3>{(movie as Movie).title}</h3>
          <p>
            {(movie as Movie).release_date}{" "}
            <IonIcon aria-hidden="true" slot="start" icon={calendarClearOutline} />{" "}
          </p>
          <p>
            {(movie as Movie).vote_average}{" "}
            <IonIcon aria-hidden="true" slot="start" icon={starSharp} />
          </p>
        </div>
      </div>
    </div>
    </Link>
  </SwiperSlide>
        ))}
      </Swiper>
      <h1>Yakında vizyona gircekler</h1>
        <Swiper
        spaceBetween={10}
        slidesPerView={2}
      >
        {yakinda.map((movie) => (
    <SwiperSlide key={(movie as Movie).id}>
      <Link to={`/icerik/movie/${(movie as Movie).id}`}>
      <div className="movie-card">
        <div className="movie-image-container">
          <img
            src={`https://image.tmdb.org/t/p/w500/${(movie as Movie).poster_path}`}
            alt={(movie as Movie).title}
          />
          <div className="movie-info">
            <h3>{(movie as Movie).title}</h3>
            <p>
              {(movie as Movie).release_date}{" "}
              <IonIcon aria-hidden="true" slot="start" icon={calendarClearOutline} />{" "}
            </p>
            <p>
              {(movie as Movie).vote_average}{" "}
              <IonIcon aria-hidden="true" slot="start" icon={starSharp} />
            </p>
          </div>
        </div>
      </div>
      </Link>
    </SwiperSlide>
        ))}
      </Swiper>
      <h1>Cineverse Vizyondakiler</h1>
      <Swiper
        spaceBetween={10}
        slidesPerView={2}
      >
        {cineversevizyon.map((movie) => (
    <SwiperSlide key={(movie as Movie).id}>
    <div className="movie-card" key={movie.id} onClick={() => openCineversePage((movie as Movie).incelemelink)}>
      <div className="movie-image-container">
        <img
          src={(movie as Movie).poster_path}
          alt={(movie as Movie).title}
        />
        <div className="movie-info">
          <h3>{(movie as Movie).title}</h3>
          <p>
            {(movie as Movie).duration}{" "}
            <IonIcon aria-hidden="true" slot="start" icon={timeSharp} />{" "}
          </p>
          <p>
            {(movie as Movie).vote_average}{" "}
            <IonIcon aria-hidden="true" slot="start" icon={starSharp} />
          </p>
        </div>
      </div>
    </div>
  </SwiperSlide>
        ))}
      </Swiper>
      <h1>Cineverse yakında</h1>
        <Swiper
        spaceBetween={10}
        slidesPerView={2}
      >
        {cineverseyakinda.map((movie) => (
    <SwiperSlide key={(movie as Movie).id}>
   <div className="movie-card" key={movie.id} onClick={() => openCineversePage((movie as Movie).incelemelink)}>
      <div className="movie-image-container">
        <img
          src={(movie as Movie).poster_path}
          alt={(movie as Movie).title}
        />
        <div className="movie-info">
          <h3>{(movie as Movie).title}</h3>
          <p>
            {(movie as Movie).release_date}{" "}
            <IonIcon aria-hidden="true" slot="start" icon={calendarClearOutline} />{" "}
          </p>
        </div>
      </div>
    </div>
  </SwiperSlide>
        ))}
      </Swiper>
      <h1>Uygulamadaki En çok beğenilenler</h1>
      <Swiper
        spaceBetween={10}
        slidesPerView={2}
      >
        {eniyiler.map((movie) => (
    <SwiperSlide key={(movie as Movie).id}>
      <Link to={`/icerik/movie/${(movie as Movie).id}`}>
    <div className="movie-card">
      <div className="movie-image-container">
        <img
          src={(movie as Movie).tur === 'local' ? (movie as Movie).image : `https://image.tmdb.org/t/p/w500${(movie as Movie).poster_path}`}
          alt={(movie as Movie).title}
        />
        <div className="movie-info">
          <h3>{(movie as Movie).tur === 'local' ? (movie as Movie).name : (movie as Movie).title}</h3>
          <p>
            {(movie as Movie).vote_average}{" "}
            <IonIcon aria-hidden="true" slot="start" icon={starSharp} />
          </p>
        </div>
      </div>
    </div>
    </Link>
  </SwiperSlide>
        ))}
      </Swiper>
      <h1>Uygulamadaki İçerikler</h1>
        <Swiper
          spaceBetween={10}
          slidesPerView={2}
        >
          {icerikler.map((icerik) => (
            <SwiperSlide key={icerik.filmId}>
                   <Link to={`/icerik/local/${icerik.filmId}`}>
              <div className="movie-card">
        <div className="movie-image-container">
          <img
            src={icerik.image}
            alt={icerik.name}
          />
          <div className="movie-info">
            <h3>{icerik.name}</h3>
          </div>
        </div>
      </div>
      </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;