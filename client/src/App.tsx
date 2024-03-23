import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import { NotAuth } from './router/notauth';
import { PrivateRoute } from "./router/private";

import store from "./store";
import { Provider } from 'react-redux'

import Menu from './components/Menu';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MePage from './pages/MePage';
import LogOutPage from './pages/LogOutPage';
import AraPage from './pages/AraPage';
import IcerikPage from './pages/IcerikPage';

import İzlemeListeleriPage from './pages/İzlemeListeleriPage';

import OwnerPage from './pages/Owner/OwnerPage';
import İcerikEklePage from './pages/Owner/İcerikEklePage';
import İcerikGuncellePage from './pages/Owner/İcerikGuncellePage';

import AdminPage from './pages/Admin/AdminPage';
import YorumlarPage from './pages/Admin/YorumPage';
import YorumOnayPage from './pages/Admin/YorumOnayPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
      <Provider store={store}>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <NotAuth path="/" component={HomePage} exact></NotAuth>
        <NotAuth path="/register" component={RegisterPage} exact></NotAuth>
        <NotAuth path="/login" component={LoginPage} exact></NotAuth>
        <NotAuth path="/ara" component={AraPage} exact></NotAuth>
        <NotAuth path="/icerik/:tur/:id" component={IcerikPage} exact></NotAuth> 
        <NotAuth path="/icerikguncelle" component={İcerikGuncellePage} exact></NotAuth>
        <NotAuth path="/izlemeListeleri" component={İzlemeListeleriPage} exact></NotAuth>
        <PrivateRoute path="/me" component={MePage} exact></PrivateRoute>
        <PrivateRoute path="/logout" component={LogOutPage} exact></PrivateRoute>
        <PrivateRoute path="/admin" component={AdminPage} exact></PrivateRoute>
        <PrivateRoute path="/owner" component={OwnerPage} exact></PrivateRoute>
        <PrivateRoute path="/icerikekle" component={İcerikEklePage} exact></PrivateRoute>
        <PrivateRoute path="/yorumlar" component={YorumlarPage} exact></PrivateRoute>
        <PrivateRoute path="/yorumonay" component={YorumOnayPage} exact></PrivateRoute>
          </IonRouterOutlet>
        </IonSplitPane>
        </Provider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;