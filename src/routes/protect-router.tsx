import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: JSX.Element;
  allowedRoles: string[]; // Pass the roles that are allowed to access the route
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const userRoleId = localStorage.getItem('userRoleId');

  if (!userRoleId || !allowedRoles.includes(userRoleId)) {
    // If the user does not have the required role, redirect them
    return <Navigate to="/403" replace />;
  }

  // If the user has the required role, allow access
  return children;
}
