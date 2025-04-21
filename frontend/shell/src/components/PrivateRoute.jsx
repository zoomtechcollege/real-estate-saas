// shell/src/components/PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { selectUserRole } from '../store/slices/userSlice';

function PrivateRoute({ children, requireAdmin = false }) {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const userRole = useSelector(selectUserRole);

	if (!isAuthenticated) {
		return <Navigate to='/auth/login' replace />;
	}

	if (requireAdmin && userRole !== 'admin') {
		return <Navigate to='/feed' replace />;
	}

	return children;
}

export default PrivateRoute;
