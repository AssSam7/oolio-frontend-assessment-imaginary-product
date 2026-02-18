import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon, { type IconName } from "../common/Icon";
import AssessmentProgressIndicator from "@/components/ui/AssessmentProgress/AssessmentProgressIndicator";
import { useAuthStore } from "@/domain/auth/store/auth.store";
import AuthLogoutModal from "@/features/auth/components/AuthLogoutModal";
import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";

type NavigationItemType = {
  label: string;
  path: string;
  icon: IconName;
  problemCount?: number;
};

const Header = () => {
  /* Local State & Refs */
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  /* Zustland State */
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const showSnackbar = useSnackbarStore((s) => s.show);

  /* Consts and References */
  const navigationItems: NavigationItemType[] = [
    { label: "Dashboard", path: "/dashboard", icon: "LayoutDashboard" },
    { label: "Products", path: "/products", icon: "Package" },
    { label: "Cart", path: "/shopping-cart", icon: "ShoppingCart" },
    { label: "Account", path: "/user-authentication", icon: "User" },
    { label: "E Book", path: "/ebook", icon: "Book" },
    { label: "Library", path: "/library", icon: "LibraryBig" },
  ];
  const filteredNavItems = navigationItems.filter((item) => {
    if (item.label === "Account") {
      return !isAuthenticated;
    }
    return true;
  });
  const fullName = user?.user_metadata?.full_name ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const nameInitial = fullName
    ? fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();
  const location = useLocation();

  /* Handlers and Helper Functions */
  const isActivePath = (path: string) => {
    if (path.startsWith("/products")) {
      return location.pathname.startsWith("/products");
    }
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    setShowLogoutModal(true);
    await logout();
    showSnackbar({ message: "Logout successful!", variant: "success" });
  };

  /* Side Effects */
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-card glass shadow-md z-[1000] border-b border-border">
        <div className="h-full flex items-center justify-between px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 transition-opacity duration-250 hover:opacity-80"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center">
              <Icon name="Code2" size={24} color="var(--color-primary)" />
            </div>
            <span className="font-mono text-lg font-semibold text-foreground">
              Imaginary
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-md
                    transition-all duration-250 ease-smooth
                    ${
                      isActivePath(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color={
                      isActivePath(item.path)
                        ? "var(--color-primary-foreground)"
                        : "currentColor"
                    }
                  />
                  <span className="font-medium text-sm">{item.label}</span>

                  {isActivePath(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                  )}
                </Link>
              ))}

              {/* Show profile at end when authenticated */}
              {isAuthenticated && user && (
                <div className="relative" ref={profileRef}>
                  {/* Avatar Button */}
                  <button
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition-all"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {nameInitial}
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-card glass border border-border rounded-md shadow-lg z-[11100]">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">
                          {fullName || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <Icon name="User" size={16} />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors"
                        >
                          <Icon name="LogOut" size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Assessment Progress */}
            <AssessmentProgressIndicator />
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors duration-250"
            aria-label="Toggle mobile menu"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[1200] md:hidden"
          style={{ top: "60px" }}
        >
          <nav className="flex flex-col p-6 gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-md
                  transition-all duration-250 ease-smooth
                  ${
                    isActivePath(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    size={20}
                    color={
                      isActivePath(item.path)
                        ? "var(--color-primary-foreground)"
                        : "currentColor"
                    }
                  />
                  <span className="font-medium">{item.label}</span>
                </div>

                {item.problemCount && item.problemCount > 0 && (
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-mono
                      ${
                        isActivePath(item.path)
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-warning/20 text-warning"
                      }
                    `}
                  >
                    {item.problemCount} issues
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {showLogoutModal && (
        <AuthLogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </>
  );
};

export default Header;
