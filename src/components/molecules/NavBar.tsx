import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/mutations";
import { User } from "@/types/graphql";
import Logo from "./Logo";
import NavLink from "./NavLink";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

interface NavBarProps {
    userId?: string | null;
    userRole?: string | null;
}

export const NavBar = ({ userId, userRole }: NavBarProps) => {

    const { data } = useQuery<{ getUser: User }>(GET_USER, {
        variables: { id: userId },
        skip: !userId,
    });

    const userInfo = data?.getUser;

    const renderNavLinks = () => {
        switch (userRole) {
            case 'ADMIN':
                return (
                    <>
                        <NavLink href="https://gestion-de-vuelos.vercel.app/" text="Gestión de vuelos" />
                        <NavLink href="https://code-factory-virtual-front-fj3flbr87.vercel.app/fligth-search/" text="Busqueda de vuelos" />
                        <NavLink href="#" text="Reservas" />
                        <NavLink href="/authentication/updateRol/updateRol" text="Permisos de usuario" />
                    </>
                );
            case 'USER':
                return (
                    <>
                        <NavLink href="https://gestion-de-vuelos.vercel.app/" text="Gestión de vuelos" />
                        <NavLink href="https://code-factory-virtual-front-fj3flbr87.vercel.app/fligth-search/" text="Busqueda de vuelos" />
                        <NavLink href="#" text="Reservas" />
                    </>
                );
            default:
                return null;
        }
    };

    const renderUserMenu = () => {
        switch (userRole) {
            case 'ADMIN':
                return (
                    <UserMenu userInfo={userInfo} />
                );
            case 'USER':
                return (
                        <UserMenu userInfo={userInfo} />
                );
            default:
                return null;
        }
    };

    return (
        <header className="sticky bg-black top-0 flex h-24 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex-1  items-center gap-4">
                <nav className="hidden  flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Logo />
                    <div className="flex-1 flex justify-center h-full">
                        {renderNavLinks()}
                    </div>
                </nav>

                <MobileMenu renderNavLinks={renderNavLinks} />
            </div>

            {renderUserMenu()}
        </header>
    );
}

export default NavBar;
