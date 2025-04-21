// shell/src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Loading from './components/Loading';

// טעינה דינמית של המודולים
const Auth = lazy(() => import('authModule/App'));
const Properties = lazy(() => import('propertiesModule/App'));
const Feed = lazy(() => import('feedModule/App'));
const Admin = lazy(() => import('adminModule/App'));

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={<Loading />} persistor={persistor}>
				<Router>
					<Header />
					<main className='container mx-auto py-4'>
						<Suspense fallback={<Loading />}>
							<Routes>
								<Route path='/auth/*' element={<Auth />} />
								<Route
									path='/properties/*'
									element={
										<PrivateRoute>
											<Properties />
										</PrivateRoute>
									}
								/>
								<Route path='/feed/*' element={<Feed />} />
								<Route
									path='/admin/*'
									element={
										<PrivateRoute requireAdmin>
											<Admin />
										</PrivateRoute>
									}
								/>
								<Route path='/' element={<Navigate to='/feed' replace />} />
							</Routes>
						</Suspense>
					</main>
					<Footer />
				</Router>
			</PersistGate>
		</Provider>
	);
}

export default App;
