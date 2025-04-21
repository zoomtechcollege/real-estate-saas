// properties-module/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import UserPropertiesList from './pages/UserPropertiesList';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import PropertyDetails from './pages/PropertyDetails';

function App() {
	return (
		<Provider store={store}>
			<Routes>
				<Route path='/' element={<UserPropertiesList />} />
				<Route path='/create' element={<CreateProperty />} />
				<Route path='/edit/:id' element={<EditProperty />} />
				<Route path='/view/:id' element={<PropertyDetails />} />
			</Routes>
		</Provider>
	);
}

export default App;
