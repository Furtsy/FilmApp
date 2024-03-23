import React from 'react';
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react';
import { useSelector } from 'react-redux';
import { logInOutline, logInSharp, homeOutline, homeSharp, search, personCircleSharp, personCircleOutline, hammerOutline, hammerSharp, constructOutline, constructSharp, chatboxOutline, chatboxSharp, addSharp, pencilSharp, playCircleSharp } from 'ionicons/icons';

import './Menu.css';
import { Link } from 'react-router-dom';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Ana sayfa', 
    url: '/',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'Ara',
    url: '/ara',
    iosIcon: search,
    mdIcon: search
  },
  {
    title: 'İzleme Listeleri',
    url: '/izlemeListeleri',
    iosIcon: playCircleSharp,
    mdIcon: playCircleSharp
  },
];

const Menu: React.FC = () => {
  interface RootState {
    user: {
      email: string;
      name: string;
      admin: boolean;
      owner: boolean;
    };
  }

  const { user } = useSelector((state: RootState) => state);

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="main-list">
          <IonListHeader>Film App</IonListHeader>
          <IonNote>{user.email ? `Merhaba, ${user.name}` : 'Merhaba, Anon'}</IonNote>

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} aria-hidden="true" />
                  <IonLabel>
                    <Link to={appPage.url} style={{ textDecoration: 'none', color: '#ebebeb' }}>{appPage.title}</Link>
                  </IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        {user.email && (
        <IonList id="main-list">
            <IonMenuToggle autoHide={false}>
            <IonItem routerDirection="none" lines="none" detail={false}>
              <IonIcon slot="start" ios={personCircleOutline} md={personCircleSharp} aria-hidden="true" />
              <IonLabel>
                <Link to="/me" style={{ textDecoration: 'none', color: '#ebebeb' }}>Profilim</Link>
              </IonLabel>
            </IonItem>
            </IonMenuToggle>
          
          {user.admin && (
            <IonMenuToggle autoHide={false}>
              <IonItem routerDirection="none" lines="none" detail={false}>
                <IonIcon slot="start" ios={hammerOutline} md={hammerSharp} aria-hidden="true" />
                <IonLabel>
                  <Link to="/admin" style={{ textDecoration: 'none', color: '#ebebeb' }}>Admin</Link>
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          )}

          {user.owner && (
        <IonMenuToggle autoHide={false}>
        <IonItem routerDirection="none" lines="none" detail={false}>
          <IonIcon slot="start" ios={constructOutline} md={constructSharp} aria-hidden="true" />
          <IonLabel>
            <Link to="/owner" style={{ textDecoration: 'none', color: '#ebebeb' }}>Owner</Link>
          </IonLabel>
        </IonItem>
        <IonItem routerDirection="none" lines="none" detail={false}>
          <IonIcon slot="start" ios={constructOutline} md={addSharp} aria-hidden="true" />
          <IonLabel>
            <Link to="/icerikekle" style={{ textDecoration: 'none', color: '#ebebeb' }}>İçerik ekle</Link>
          </IonLabel>
        </IonItem>
        <IonItem routerDirection="none" lines="none" detail={false}>
          <IonIcon slot="start" ios={constructOutline} md={pencilSharp} aria-hidden="true" />
          <IonLabel>
            <Link to="/icerikguncelle" style={{ textDecoration: 'none', color: '#ebebeb' }}>İçerik Güncelle</Link>
          </IonLabel>
        </IonItem>
        </IonMenuToggle>
          )}

{(user.owner || user.admin) && (
  <IonMenuToggle autoHide={false}>
    <IonItem routerDirection="none" lines="none" detail={false}>
      <IonIcon slot="start" ios={chatboxOutline} md={chatboxSharp} aria-hidden="true" />
      <IonLabel>
        <Link to="/yorumlar" style={{ textDecoration: 'none', color: '#ebebeb' }}>Yorumlar</Link>
      </IonLabel>
    </IonItem>
    <IonItem routerDirection="none" lines="none" detail={false}>
      <IonIcon slot="start" ios={chatboxOutline} md={chatboxSharp} aria-hidden="true" />
      <IonLabel>
        <Link to="/yorumonay" style={{ textDecoration: 'none', color: '#ebebeb' }}>Yorum Onay</Link>
      </IonLabel>
    </IonItem>
  </IonMenuToggle>
)}

        </IonList>
        )}
      </IonContent>
      <IonList id="main-list">
        {user.email ? (
          <IonMenuToggle autoHide={false}>
          <IonItem routerDirection="none" lines="none" detail={false}>
            <IonIcon slot="start" ios={logInOutline} md={logInSharp} aria-hidden="true" />
            <IonLabel>
              <Link to="/logout" style={{ textDecoration: 'none', color: '#DC143C' }}>Çıkış Yap</Link>
            </IonLabel>
          </IonItem>
          </IonMenuToggle>
        ) : (
          <IonMenuToggle autoHide={false}>
          <IonItem routerDirection="none" lines="none" detail={false}>
            <IonIcon slot="start" ios={logInOutline} md={logInSharp} aria-hidden="true" />
            <IonLabel>
              <Link to="/login" style={{ textDecoration: 'none', color: '#1A8327' }}>Giriş Yap</Link> | <Link to="/register" style={{ textDecoration: 'none', color: '#1A8327' }}>Kayıt Ol</Link>
            </IonLabel>
          </IonItem>
          </IonMenuToggle>
        )}
      </IonList>
    </IonMenu>
  );
};

export default Menu;