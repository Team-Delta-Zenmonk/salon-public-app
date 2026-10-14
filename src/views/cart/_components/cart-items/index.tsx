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
import { useStorefront } from "../../../../providers/storefront-provider";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./cart-items.module.css";

interface CartItemProps {
  item: any;
}

interface StaffSelectorProps {
  staffLoading: boolean;
  staffList: any[];
  selectedStaffId: string | null;
  updating: boolean;
  onStaffClick: (entry: any) => void;
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
  selectedStaffId,
  updating,
  onStaffClick,
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

  return (
    <Box className={styles.staffGrid}>
      {staffList.map((entry: any) => {
        const staff = entry.staff;
        const isSelected = selectedStaffId === staff?.uuid;
        const staffName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();

        return (
          <Box
            key={staff?.uuid ?? entry.staff_id}
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
    </Box>
  );
}

export default function CartItem({ item }: Readonly<CartItemProps>) {
  const dispatch = useAppDispatch();
  const { isGuest, salonId, items, cartUuid } = useAppSelector((s) => s.cart);
  const { salon } = useStorefront();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [pendingStaffEntry, setPendingStaffEntry] = useState<any>(null);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);

  const service = item.service;
  const name = service?.name ?? "Ceremony";
  const image = service?.logo;
  const duration = item.duration;
  const price = item.final_price ?? item.base_price;
  const gender = service?.gender;
  const selectedStaffId = item.staff?.uuid ?? item.staff_uuid ?? null;
  const effectiveSalonId = salonId || salon?.uuid || service?.salon_id || item?.salon_id;

  useEffect(() => {
    if (!service?.uuid || !effectiveSalonId) return;
    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const data = await dispatch(getServiceStaffsAction({ serviceUuid: service.uuid, salonId: effectiveSalonId })).unwrap();
        if (Array.isArray(data) && data.length > 0) {
          setStaffList(data);
        } else if (salon?.staff && salon.staff.length > 0) {
          setStaffList(salon.staff.map((st: any) => ({ staff: st, staff_id: st.uuid || st.id, price, duration: duration || service?.duration })));
        } else {
          setStaffList([]);
        }
      } catch {
        if (salon?.staff && salon.staff.length > 0) {
          setStaffList(salon.staff.map((st: any) => ({ staff: st, staff_id: st.uuid || st.id, price, duration: duration || service?.duration })));
        } else {
          setStaffList([]);
        }
      } finally {
        setStaffLoading(false);
      }
    };
    fetchStaff();
  }, [service?.uuid, effectiveSalonId, salon?.staff, dispatch, price, duration, service?.duration]);

  const onStaffClick = (entry: any) => {
    if (updating) return;
    if (entry.staff?.uuid === selectedStaffId) return;
    setPendingStaffEntry(entry);
    setStaffDialogOpen(true);
  };

  const onConfirmStaff = async () => {
    if (!pendingStaffEntry) return;
    setStaffDialogOpen(false);
    if (isGuest) {
      dispatch(updateItemLocalStaff({ service_id: item.service_id, staff: pendingStaffEntry.staff, staff_uuid: pendingStaffEntry.staff.uuid, price: pendingStaffEntry.price, duration: pendingStaffEntry.duration }));
      setPendingStaffEntry(null);
      return;
    }
    setUpdating(true);
    try {
      await dispatch(updateCartItemAction({ itemUuid: item.uuid, staffUuid: pendingStaffEntry.staff.uuid })).unwrap();
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
    if (isGuest) {
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
      } catch (error) {
        console.error("Failed to remove item:", error);
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
            selectedStaffId={selectedStaffId}
            updating={updating}
            onStaffClick={onStaffClick}
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
    </>
  );
}
