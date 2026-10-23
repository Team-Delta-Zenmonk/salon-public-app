import { Box, Typography, Avatar, IconButton, Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { removeItemLocal, updateItemLocalStaff } from "../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../features/salon/cart/remove-item/remove-item.action";
import { updateCartItemAction } from "../../../../features/salon/cart/update-item/update-item.action";
import { deleteCartAction } from "../../../../features/salon/cart/delete-cart/delete-cart.action";
import ConfirmRemoveItemDialog from "../remove-item-dialog";
import { getServiceStaffsAction } from "../../../../features/salon/staff/get-service-staffs/get-service-staffs.action";
import ConfirmStaffDialog from "./_components/confirm-staff-dialog";
import StaffModal from "./_components/staff-modal";
import { useStorefront } from "../../../../providers/storefront-provider";
import { callSnack } from "@/components/snackbar";
import EllipsisCell from "@/components/ellipse-cell";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "./cart-items.module.css";

interface CartItemProps {
  item: any;
}

interface StaffSelectorProps {
  staffLoading: boolean;
  staffList: any[];
  totalStaffCount: number;
  selectedStaffId: string | null;
  updating: boolean;
  onStaffClick: (entry: any) => void;
  onSeeMoreClick: () => void;
}

const getStaffInfo = (staffEntry?: any, staff?: any) => {
  if (staffEntry) {
    return {
      name: `${staffEntry.staff.first_name} ${staffEntry.staff.last_name ?? ""}`.trim(),
      photo: staffEntry.staff.photos?.secure_url ?? staffEntry.staff.photos?.url,
    };
  }
  if (staff) {
    return {
      name: `${staff.first_name} ${staff.last_name ?? ""}`.trim(),
      photo: staff.photos?.secure_url ?? staff.photos?.url,
    };
  }
  return null;
};

function StaffSelector({
  staffLoading,
  staffList,
  totalStaffCount,
  selectedStaffId,
  updating,
  onStaffClick,
  onSeeMoreClick,
}: Readonly<StaffSelectorProps>) {
  if (staffLoading) {
    return (
      <Box className={styles.staffSkeletonList}>
        {[1, 2, 3].map((i) => (
          <Box key={i} className={styles.staffSkeletonItem}>
            <Skeleton variant="circular" width={44} height={44} />
            <Skeleton variant="text" width={40} height={12} />
          </Box>
        ))}
      </Box>
    );
  }

  if (staffList.length === 0) {
    return (
      <Typography variant="caption" className={styles.noStaffText}>
        No staff assigned to this service
      </Typography>
    );
  }

  let displayedStaff = staffList.slice(0, 5);
  if (selectedStaffId && !displayedStaff.some((entry: any) => entry.staff?.uuid === selectedStaffId)) {
    const selectedEntry = staffList.find((entry: any) => entry.staff?.uuid === selectedStaffId);
    if (selectedEntry) {
      displayedStaff = [selectedEntry, ...displayedStaff.slice(0, 4)];
    }
  }
  const remainingCount = Math.max(0, (totalStaffCount || staffList.length) - displayedStaff.length);

  return (
    <Box className={styles.staffGrid}>
      {displayedStaff.map((entry: any, index: number) => {
        const staff = entry.staff;
        const isSelected = selectedStaffId === staff?.uuid;
        const staffName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();

        return (
          <Box
            key={entry.uuid || staff?.uuid || `${entry.staff_id}-${index}`}
            onClick={() => !updating && onStaffClick(entry)}
            className={`${styles.staffCard} ${isSelected ? styles.staffCardSelected : ""}`}
          >
            <Avatar
              src={staff?.photos?.secure_url ?? staff?.photos?.url}
              className={`${styles.staffAvatar} ${isSelected ? styles.staffAvatarSelected : ""}`}
            >
              {staffName[0]}
            </Avatar>
            <Typography className={`${styles.staffName} ${isSelected ? styles.staffNameSelected : ""}`}>
              {staffName.split(" ")[0]}
            </Typography>
            {entry.price && (
              <Typography className={`${styles.priceTag} ${isSelected ? styles.priceTagSelected : ""}`}>
                ₹{Math.round(Number.parseFloat(String(entry.price)))}
              </Typography>
            )}
          </Box>
        );
      })}

      {remainingCount > 0 && (
        <Box
          onClick={onSeeMoreClick}
          className={`${styles.staffCard} ${styles.seeMoreCard}`}
        >
          <Avatar className={`${styles.staffAvatar} ${styles.seeMoreAvatar}`}>
            <MoreHorizIcon fontSize="small" />
          </Avatar>
          <Typography className={styles.seeMoreText}>
            +{remainingCount} More
          </Typography>
          <Typography className={styles.priceTag}>
            See all
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function CartItem({ item }: Readonly<CartItemProps>) {
  const dispatch = useAppDispatch();
  const { isGuest, salonId, items, cartUuid } = useAppSelector((s) => s.cart);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { salon } = useStorefront();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [pendingStaffEntry, setPendingStaffEntry] = useState<any>(null);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);

  const service = item.service;
  const name = service?.name ?? "Ceremony";
  const image = service?.logo;
  const duration = item.duration;
  const price = item.final_price ?? item.base_price;
  const gender = service?.gender;
  const selectedStaffId = item.staff?.uuid ?? item.staff_uuid ?? null;
  const effectiveSalonId = salonId || salon?.uuid || service?.salon_id || item?.salon_id;

  const [staffTotal, setStaffTotal] = useState(0);
  const [modalStaffList, setModalStaffList] = useState<any[]>([]);
  const [staffPage, setStaffPage] = useState(1);
  const [loadingMoreStaff, setLoadingMoreStaff] = useState(false);

  useEffect(() => {
    if (!service?.uuid || !effectiveSalonId) return;
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const res = await dispatch(
          getServiceStaffsAction({
            serviceUuid: service.uuid,
            salonId: effectiveSalonId,
            page: 1,
            limit: 10,
          }),
        ).unwrap();
        const data = Array.isArray(res) ? res : (res?.data ?? res?.rows ?? []);
        const total = typeof res?.total === "number" ? res.total : (Array.isArray(data) ? data.length : 0);
        setStaffTotal(total);

        if (Array.isArray(data) && data.length > 0) {
          const seen = new Set();
          const uniqueData = data.filter((entry: any) => {
            const id = entry?.staff?.uuid || entry?.staff_id;
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
          });
          setStaffList(uniqueData);
          setModalStaffList(uniqueData);
          setStaffPage(1);
        } else if (salon?.staff && salon.staff.length > 0) {
          const fallbackData = salon.staff.map((st: any) => ({
            staff: st,
            staff_id: st.uuid || st.id,
            price,
            duration: duration || service?.duration,
          }));
          setStaffList(fallbackData.slice(0, 10));
          setModalStaffList(fallbackData.slice(0, 10));
          setStaffTotal(salon.staff.length);
          setStaffPage(1);
        } else {
          setStaffList([]);
          setModalStaffList([]);
          setStaffTotal(0);
        }
      } catch {
        if (salon?.staff && salon.staff.length > 0) {
          const fallbackData = salon.staff.map((st: any) => ({
            staff: st,
            staff_id: st.uuid || st.id,
            price,
            duration: duration || service?.duration,
          }));
          setStaffList(fallbackData.slice(0, 10));
          setModalStaffList(fallbackData.slice(0, 10));
          setStaffTotal(salon.staff.length);
          setStaffPage(1);
        } else {
          setStaffList([]);
          setModalStaffList([]);
          setStaffTotal(0);
        }
      } finally {
        setStaffLoading(false);
      }
    };
    fetchStaff();
  }, [service?.uuid, effectiveSalonId, salon?.staff, dispatch, price, duration, service?.duration]);

  const fetchMoreStaff = async () => {
    if (loadingMoreStaff || !service?.uuid || !effectiveSalonId) return;
    const nextPage = staffPage + 1;
    setLoadingMoreStaff(true);
    try {
      const res = await dispatch(
        getServiceStaffsAction({
          serviceUuid: service.uuid,
          salonId: effectiveSalonId,
          page: nextPage,
          limit: 10,
        }),
      ).unwrap();
      const data = Array.isArray(res) ? res : (res?.data ?? res?.rows ?? []);
      if (Array.isArray(data) && data.length > 0) {
        setModalStaffList((prev) => {
          const seen = new Set(prev.map((e) => e?.staff?.uuid || e?.staff_id));
          const additions = data.filter((entry: any) => {
            const id = entry?.staff?.uuid || entry?.staff_id;
            return id && !seen.has(id);
          });
          return [...prev, ...additions];
        });
        setStaffPage(nextPage);
      } else if (salon?.staff && salon.staff.length > modalStaffList.length) {
        const nextSlice = salon.staff
          .slice(modalStaffList.length, modalStaffList.length + 10)
          .map((st: any) => ({
            staff: st,
            staff_id: st.uuid || st.id,
            price,
            duration: duration || service?.duration,
          }));
        setModalStaffList((prev) => [...prev, ...nextSlice]);
        setStaffPage(nextPage);
      }
    } catch {
      if (salon?.staff && salon.staff.length > modalStaffList.length) {
        const nextSlice = salon.staff
          .slice(modalStaffList.length, modalStaffList.length + 10)
          .map((st: any) => ({
            staff: st,
            staff_id: st.uuid || st.id,
            price,
            duration: duration || service?.duration,
          }));
        setModalStaffList((prev) => [...prev, ...nextSlice]);
        setStaffPage(nextPage);
      }
    } finally {
      setLoadingMoreStaff(false);
    }
  };

  const onStaffClick = (entry: any) => {
    if (updating) return;
    if (entry.staff?.uuid === selectedStaffId) return;
    setPendingStaffEntry(entry);
    setStaffDialogOpen(true);
  };

  const onConfirmStaff = async () => {
    if (!pendingStaffEntry) return;
    const staffToSet = pendingStaffEntry;
    setStaffDialogOpen(false);

    setStaffList((prev) => {
      const exists = prev.some((e) => (e.staff?.uuid || e.staff_id) === (staffToSet.staff?.uuid || staffToSet.staff_id));
      if (!exists) {
        return [staffToSet, ...prev];
      }
      return prev;
    });

    const isLocalGuestItem = !isAuthenticated || isGuest || !item.uuid;

    if (isLocalGuestItem) {
      dispatch(updateItemLocalStaff({ service_id: item.service_id, staff: staffToSet.staff, staff_uuid: staffToSet.staff.uuid, price: staffToSet.price, duration: staffToSet.duration }));
      setPendingStaffEntry(null);
      return;
    }
    setUpdating(true);
    try {
      await dispatch(updateCartItemAction({ itemUuid: item.uuid, staffUuid: staffToSet.staff.uuid })).unwrap();
    } catch (error: any) {
      console.error("Failed to update staff:", error);
      callSnack(error?.message || "Failed to update specialist", "error");
    } finally {
      setUpdating(false);
      setPendingStaffEntry(null);
    }
  };

  const onCancelStaff = () => {
    setStaffDialogOpen(false);
    setPendingStaffEntry(null);
  };

  const onConfirmRemove = async () => {
    const isLocalGuestItem = !isAuthenticated || isGuest || !item.uuid;

    if (isLocalGuestItem) {
      dispatch(removeItemLocal(item.service_id));
      setConfirmOpen(false);
    } else {
      setRemoving(true);
      try {
        if (items.length === 1 && cartUuid) {
          await dispatch(deleteCartAction(cartUuid)).unwrap();
        } else {
          await dispatch(removeCartItemAction(item.uuid)).unwrap();
        }
      } catch (error: any) {
        console.error("Failed to remove item:", error);
        callSnack(error?.message || "Failed to remove item", "error");
      } finally {
        setRemoving(false);
        setConfirmOpen(false);
      }
    }
  };

  const currentStaffEntry = selectedStaffId ? staffList.find((e) => e.staff?.uuid === selectedStaffId) : null;
  const currentStaffInfo = getStaffInfo(currentStaffEntry, item.staff);
  const newStaffInfo = getStaffInfo(pendingStaffEntry);

  return (
    <>
      <Box className={styles.itemCard}>
        <Box className={styles.itemTop}>
          <Avatar
            src={image}
            variant="rounded"
            className={styles.serviceAvatar}
          />

          <Box className={styles.itemInfo}>
            <EllipsisCell value={name} className={styles.serviceTitle} maxChars={20} />
            <Box className={styles.metaRow}>
              <AccessTimeIcon className={styles.metaDurationIcon} />
              <Typography variant="caption" className={styles.metaDuration}>
                {duration} MIN
                {gender && (
                  <>
                    <Box component="span" className={styles.metaDot}>•</Box>
                    <Box component="span" className={styles.metaGender}>{gender}</Box>
                  </>
                )}
              </Typography>
            </Box>
            {selectedStaffId && currentStaffInfo && (
              <Box className={styles.assignedStaffChip}>
                <Avatar src={currentStaffInfo.photo} className={styles.assignedStaffAvatar}>
                  {currentStaffInfo.name?.[0]}
                </Avatar>
                <EllipsisCell value={currentStaffInfo.name} className={styles.assignedStaffName} maxChars={20} />
              </Box>
            )}
          </Box>

          <Box className={styles.itemActions}>
            <Typography className={styles.itemPrice}>₹{price}</Typography>
            <IconButton onClick={() => setConfirmOpen(true)} className={styles.deleteBtn}>
              <DeleteOutlineIcon className={styles.deleteBtnIcon} />
            </IconButton>
          </Box>
        </Box>

        <Box className={styles.staffSection}>
          <Box className={styles.staffHeader}>
            <Typography variant="caption" className={styles.staffLabel}>
              Assign Specialist
            </Typography>
            {selectedStaffId && (
              <Typography variant="caption" className={styles.staffAssigned}>
                ✓ Specialist Assigned
              </Typography>
            )}
          </Box>
          <StaffSelector
            staffLoading={staffLoading}
            staffList={staffList}
            totalStaffCount={staffTotal}
            selectedStaffId={selectedStaffId}
            updating={updating}
            onStaffClick={onStaffClick}
            onSeeMoreClick={() => setStaffModalOpen(true)}
          />
        </Box>
      </Box>

      <ConfirmRemoveItemDialog
        open={confirmOpen}
        serviceName={name}
        removing={removing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirmRemove}
      />

      <ConfirmStaffDialog
        open={staffDialogOpen}
        currentStaff={currentStaffInfo}
        newStaff={newStaffInfo}
        price={pendingStaffEntry?.price}
        duration={pendingStaffEntry?.duration}
        loading={updating}
        onConfirm={onConfirmStaff}
        onCancel={onCancelStaff}
      />

      <StaffModal
        open={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        staffList={modalStaffList}
        selectedStaffId={selectedStaffId}
        onSelectStaff={onStaffClick}
        serviceName={name}
        hasMore={modalStaffList.length < staffTotal}
        onFetchMore={fetchMoreStaff}
        loadingMore={loadingMoreStaff}
      />
    </>
  );
}
