import NavBar from '@/components/molecules/NavBar';
import { ReactNode, useEffect, useState } from 'react';
import { getFromLocalStorage } from '@/lib/tokenUtils';
import { jwtDecode } from 'jwt-decode';
import { Token } from "@/types/graphql"
import router from 'next/router';

export const description = ''


export default function Layout({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("OTHER");

  useEffect(() => {
    const token = getFromLocalStorage('token', null);
    if (token) {
      try {
        const userDecoded: Token = jwtDecode(token);
        setUserId(userDecoded.id);
        setUserRole(userDecoded.role || "OTHER");
        if (userDecoded) {
          const isExpired = userDecoded.exp < Math.floor(Date.now() / 1000);
          console.log("¿El token está expirado?", isExpired);
          if(isExpired){
            localStorage.removeItem("token");
            router.reload();
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      router.push('/authentication/login/login');
      console.log('No token found, skipping decode.');
    }
  }, []);

  return (

    <div className='flex flex-col min-h-screen'>
      <NavBar userId={userId} userRole={userRole} />
      <main className=''>{children}</main>
    </div>

  );
}