// properties-module/src/pages/UserPropertiesList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserProperties } from '../store/slices/propertySlice';
import { getUserState } from '../store';
import PropertyCard from '../components/PropertyCard';

function UserPropertiesList() {
	const dispatch = useDispatch();
	const { items: properties, loading, error } = useSelector((state) => state.properties);

	// קבלת מידע מה-Shell Store
	const userInfo = getUserState();

	useEffect(() => {
		dispatch(fetchUserProperties());
	}, [dispatch]);

	if (loading) return <div>טוען...</div>;
	if (error) return <div>שגיאה: {error.message}</div>;

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>הנכסים שלי</h1>
				<Link to='/properties/create' className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
					הוסף נכס חדש
				</Link>
			</div>

			{properties.length === 0 ? (
				<div className='text-center py-8'>
					<p>אין לך נכסים עדיין. התחל ביצירת נכס חדש!</p>
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{properties.map((property) => (
						<PropertyCard key={property._id} property={property} editable={true} />
					))}
				</div>
			)}
		</div>
	);
}

export default UserPropertiesList;
