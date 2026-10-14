"use client";
import { Box, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { logout } from "../../features/auth/auth.slice";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";

import styles from "./profile.module.css";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const { customer, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <Box className={styles.unauthContainer}>
        <div className={styles.unauthCard}>
          <AccountCircleIcon className={styles.unauthIcon} />
          <h2 className={styles.unauthTitle}>Sign In Required</h2>
          <p className={styles.unauthSub}>
            Please sign in to access your appointments, profile details, and booking history.
          </p>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className={styles.primaryBtn}
          >
            SIGN IN / CREATE ACCOUNT
          </button>
        </div>
      </Box>
    );
  }

  const fullName = `${customer?.first_name || customer?.name || "Private"} ${customer?.last_name || "Client"}`.trim();

  return (
    <Box className={styles.profilePage}>
      <div className={styles.topBar}>
        <div className={styles.breadcrumbs}>
          <span className={styles.crumbGold}>MEMBER SANCTUARY</span>
          <span className={styles.crumbSlash}>/</span>
          <span className={styles.crumbText}>CLIENT DOSSIER</span>
        </div>
        <div className={styles.clientMeta}>
          <span className={styles.metaText}>CLIENT ID #{customer?.uuid?.slice(0, 8) || "8924"}</span>
          <div className={styles.dividerDot} />
          <span className={`${styles.metaText} ${styles.metaTextActive}`}>PRIVATE SALON PATRON</span>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <aside className={styles.leftColumn}>
          <div className={styles.avatarCard}>
            <div className={styles.avatarHeader}>
              <Avatar className={styles.avatarCircle}>
                {fullName[0]}
              </Avatar>
              <div>
                <h3 className={styles.userName}>{fullName}</h3>
                <p className={styles.userEmail}>{customer?.email}</p>
                {customer?.phone && (
                  <p className={styles.userPhone}>{customer.phone}</p>
                )}
              </div>
            </div>

            <div className={styles.statusList}>
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>ACCOUNT STATUS</span>
                <span className={`${styles.statusValue} ${styles.statusConfirmed}`}>ACTIVE PATRON</span>
              </div>
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>DOSSIER VERIFICATION</span>
                <span className={styles.statusValue}>AUTHENTICATED</span>
              </div>
            </div>
          </div>
        </aside>

        <section className={styles.rightColumn}>
          <div className={styles.specCard}>
            <div className={styles.specHeader}>
              <div>
                <span className={styles.crumbGold}>PATRON DOSSIER</span>
                <h2 className={styles.specTitle}>Client Specifications</h2>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.signOutBtn}
              >
                <LogoutIcon />
                <span>SIGN OUT</span>
              </button>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>FIRST NAME</span>
                <span className={styles.infoVal}>
                  {customer?.first_name || customer?.name || "Not provided"}
                </span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>LAST NAME</span>
                <span className={styles.infoVal}>
                  {customer?.last_name || "—"}
                </span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>EMAIL ADDRESS</span>
                <span className={styles.emailVal}>{customer?.email || "—"}</span>
              </div>
              <div className={styles.infoBox}>
                <span className={styles.infoLabel}>PHONE NUMBER</span>
                <span className={styles.infoVal}>{customer?.phone || "—"}</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className={styles.actionBtn}
              >
                <span>VIEW BOOKINGS</span>
                <CalendarMonthIcon />
              </button>
            </div>
          </div>
        </section>
      </div>
    </Box>
  );
}

