import React, { useRef, useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonImg,
  IonText,
  IonIcon,
  IonModal,
  IonRange,
  IonButton,
  IonLabel,
  IonInput,
  IonList,
  IonItem
} from '@ionic/react';
import { thumbsUp, star, library, send } from 'ionicons/icons';
import { getBilgi, addComment, getComments, addİzlemeListesi, getİzlemeListesi, postPuanla, getPuanlarim, deletePuan } from '../utils/api';
import { useParams } from 'react-router';
import { Rating } from 'react-custom-rating-component'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './IcerikPage.css';

  const IcerikPage: React.FC = () => {

  const modal = useRef<HTMLIonModalElement>(null);
  const [rating, setRating] = useState(0);
  const [filmData, setFilmData] = useState<any>(null);
  const { id, tur } = useParams<{ id: string; tur: string }>();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    getBilgi(id, tur)
      .then((response) => {
        setFilmData(response.data);
      })
      .catch((error) => {
        toast.error('veriler getirilirken hata oldu', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        console.error('Verileri getirirken hata oldu: ', error);
      });

    fetchWatchlist();
    fetchComments();
    fetchPuanlarim();
  }, [id]);

  async function fetchWatchlist() {
    try {
      const headers = {
        Authorization: `${localStorage.getItem('token')}`,
      };
      const watchlistData = await getİzlemeListesi(headers);
      setWatchlist(watchlistData);
    } catch (error) {
      toast.error('izleme listeni getirirken hata oldu', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error('izleme listeni getirirken hata oldu: ', error);
    }
  }

  function isInWatchlist() {
    return watchlist.some((entry: any) => entry.filmId == id);
  }

  async function handleaddİzlemeListesi() {
    try {
      const headers = {
        Authorization: `${localStorage.getItem('token')}`,
      };

      await addİzlemeListesi(id, tur, headers);

      fetchWatchlist();
      toast.success('İzleme listesi güncellendi', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      toast.error('İzleme listene ekleme yapmak için giriş yapman gerek', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error('izleme listeni getirirken hata oldu: ', error);
    }
  }

  async function fetchComments() {
    try {
      const response = await getComments(id);
      const filteredComments = response.filter((yorum:any) => yorum.durum);
      setComments(filteredComments);
    } catch (error) {
      toast.error('Yorumları çekerken hata oldu', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error('Yorumları çekerken hata oldu: ', error);
    }
  }

  async function fetchPuanlarim() {
    try {
      const headers = {
        Authorization: `${localStorage.getItem('token')}`,
      };
      const puanlar = await getPuanlarim(headers);
      setRating(puanlar.length > 0 ? puanlar[0].puan : 0);
    } catch (error) {
      toast.error('Puanlarını çekerken hata oldu', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      
      console.error('Puanlarını çekerken hata oldu: ', error);
    }
  }

  const handleDeletePuan = async (filmId:any, tur:any) => {
    try {
      const headers = {
        Authorization: `${localStorage.getItem('token')}`,
      };
      await deletePuan(filmId, tur, headers);
      fetchPuanlarim();
      setRating(0);
      dismiss();
      toast.success('Başarıyla puanın silindi', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      toast.error('Puan silinirken hata oldu', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error('Puan silinirken hata oldu: ', error);
    }
  };

  function dismiss() {
    modal.current?.dismiss();
  }


  async function submitRating() {
    try {
      const headers = {
        Authorization: `${localStorage.getItem('token')}`,
      };

      await postPuanla(id, tur, rating, headers);
      
      await fetchPuanlarim();
      
      dismiss();
      toast.success('Başarıyla verdiği puan kaydedildi', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      toast.error('Puanlama için giriş yapman gerek', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      console.error('Puanlama gönderilirken hata oluştu: ', error);
    }
  }


  function addCommentHandler() {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };
    if (comment.trim() !== '') {
      addComment(id, comment, headers)
        .then((response) => {
          if(response.ban) {
            toast.error('Banlı olduğun için yorum yapamazsın', {
              position: 'bottom-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            });
          } else {
            fetchComments();
            toast.success('Yorum başarıyla gönderildi', {
              position: 'bottom-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            });
          }
        })
        .catch((error) => {
          toast.error('Yorum göndermek için giriş yapman gerek', {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
          console.error('Yorum eklerken hata oluştu: ', error);
        });

      setComment('');
    } else {
      toast.error('Yorum girmelisin', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Film Detayı</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {filmData && (
          <IonGrid>
            <IonRow>
              <IonCol size="12" size-sm="8">
                <IonCard>
                  <IonImg src={tur === 'local' ? filmData.poster_path : `https://image.tmdb.org/t/p/w500${filmData.poster_path}`} />
                  <IonCardContent>
                    <IonText>
                      <p>{filmData.overview}</p>
                    </IonText>
                    <IonText>
                      <p>
                        <IonIcon icon={star} color="warning" /> {filmData.vote_average}
                      </p>
                    </IonText>
                  </IonCardContent>
                  <div className="buttons">
                    <IonButton onClick={handleaddİzlemeListesi}>
                      <IonIcon
                        icon={isInWatchlist() ? library : library }
                        color={isInWatchlist() ? 'danger' : 'success'}
                      />
                    </IonButton>
                    <IonButton onClick={() => modal.current?.present()}>
                      <IonIcon icon={star} color="warning" />
                    </IonButton>
                  </div>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
<IonModal id="IcerikPage-modal" ref={modal}>
  <div className="wrapper">
    <h1>Değerlendirme</h1>
    <Rating
      defaultValue={rating}
      count={10}
      size='25px'
      spacing='7px'
      onChange={(newRating) => setRating(newRating)}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
    <IonButton color="danger" onClick={() => handleDeletePuan(id, tur)}>
        Sil
      </IonButton>
      <div style={{ width: '10px' }}></div>
      <IonButton expand="full" onClick={submitRating}>
        Gönder
      </IonButton>
    </div>
  </div>
</IonModal>

  
        <div className="comment-section">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IonInput
              placeholder="Yorumunuzu buraya yazın"
              value={comment}
              onIonChange={(e) => setComment(e.detail.value!)}
            />
            <IonButton onClick={addCommentHandler} style={{ marginLeft: '10px' }}>
              <IonIcon icon={send} />
            </IonButton>
          </div>
          <IonList>
            {comments &&
              comments.map((comment) => (
                <IonItem key={comment._id} lines="none" style={{ padding: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IonText style={{ fontSize: '14px', fontWeight: 'bold' }}>{comment.userName}</IonText>
                    <div style={{ borderLeft: '1px solid gray', height: '20px', margin: '0 10px' }}></div>
                    <IonText style={{ fontSize: '16px' }}>{comment.icerik}</IonText>
                  </div>
                </IonItem>
              ))}
          </IonList>
        </div>
  
        <ToastContainer />
      </IonContent>
    </IonPage>
  );


}

export default IcerikPage;



