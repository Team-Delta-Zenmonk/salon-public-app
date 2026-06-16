import { Box, Typography, Avatar, IconButton, Skeleton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { removeItemLocal, updateItemLocalStaff } from "../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../features/salon/cart/remove-item/remove-item.action";
import { updateCartItemAction } from "../../../../features/salon/cart/update-item/update-item.action";
import { deleteCartAction } from "../../../../features/salon/cart/delete-cart/delete-cart.action";
import ConfirmRemoveItemDialog from "../remove-item-dialog";
import { getServiceStaffsAction } from "../../../../features/salon/staff/get-service-staffs/get-service-staffs.action";
import ConfirmStaffDialog from "./_components/confirm-staff-dialog";

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
      <Box className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <Box key={i} className="flex flex-col items-center gap-1">
            <Skeleton variant="circular" width={44} height={44} />
            <Skeleton variant="text" width={40} height={12} />
          </Box>
        ))}
      </Box>
    );
  }

  if (staffList.length === 0) {
    return (
      <Typography variant="caption" className="text-(--app-muted) block">
        No staff assigned to this service
      </Typography>
    );
  }

  return (
    <Box className="flex gap-2.5 sm:gap-3 flex-wrap">
      {staffList.map((entry: any) => {
        const staff = entry.staff;
        const isSelected = selectedStaffId === staff?.uuid;
        const staffName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();
        const photo = staff?.photos?.secure_url ?? staff?.photos?.url;
        const staffPrice = entry.price;

        const cardClass = isSelected
          ? "bg-(--app-primary-soft) border-(--app-primary)"
          : "bg-(--app-surface) border-(--app-border) hover:bg-(--app-surface-alt) hover:border-(--app-muted)";

        const avatarClass = isSelected
          ? "w-11 h-11 transition-all duration-150 border-[2.5px] border-(--app-primary) bg-(--app-surface) shadow-[0_8px_20px_var(--app-primary-soft)]"
          : "w-11 h-11 transition-all duration-150 border-2 border-(--app-border) bg-(--app-surface-alt)";

        const staffNameClass = isSelected ? "text-(--app-text) font-bold" : "text-(--app-text) font-medium";

        const staffPriceClass = isSelected ? "text-(--app-text) font-semibold" : "text-(--app-muted) font-medium";

        return (
          <Box
            key={entry.uuid}
            onClick={() => onStaffClick(entry)}
            className={`flex flex-col items-center gap-1.5 cursor-pointer group transition-all duration-150 rounded-xl px-2.5 py-2 min-w-20 sm:min-w-22 border ${cardClass} ${
              updating ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Box className="relative">
              <Avatar src={photo} className={avatarClass}>
                {staffName?.[0]}
              </Avatar>

              {isSelected && (
                <Box className="absolute -bottom-1 -right-1 w-4 h-4 bg-(--app-primary) border border-(--app-surface) rounded-full flex items-center justify-center">
                  <CheckIcon className="text-[10px] text-(--app-primary-contrast)" />
                </Box>
              )}
            </Box>

            <Typography
              variant="caption"
              className={`text-[11px] text-center w-full leading-tight truncate ${staffNameClass}`}
              title={staffName || "Staff"}
            >
              {staffName || "Staff"}
            </Typography>

            {staffPrice && (
              <Typography variant="caption" className={`text-[10px] ${staffPriceClass}`}>
                ₹{Math.round(Number.parseFloat(String(staffPrice)))}
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [pendingStaffEntry, setPendingStaffEntry] = useState<any>(null);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);

  const service = item.service;
  const name = service?.name ?? "Service";
  const image = service?.logo;
  const duration = item.duration;
  const price = item.final_price ?? item.base_price;
  const gender = service?.gender;
  const selectedStaffId = item.staff?.uuid ?? item.staff_uuid ?? null;

  useEffect(() => {
    if (!service?.uuid || !salonId) return;

    const fetchStaff = async () => {
      setStaffLoading(true);
      try {
        const data = await dispatch(getServiceStaffsAction({ serviceUuid: service.uuid, salonId })).unwrap();
        setStaffList(data);
      } catch {
        setStaffList([]);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
  }, [service?.uuid]);

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
      dispatch(
        updateItemLocalStaff({
          service_id: item.service_id,
          staff: pendingStaffEntry.staff,
          staff_uuid: pendingStaffEntry.staff.uuid,
          price: pendingStaffEntry.price,
          duration: pendingStaffEntry.duration,
        }),
      );
      setPendingStaffEntry(null);
      return;
    }

    setUpdating(true);
    try {
      await dispatch(
        updateCartItemAction({
          itemUuid: item.uuid,
          staffUuid: pendingStaffEntry.staff.uuid,
        }),
      ).unwrap();
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
      <Box className="bg-(--app-surface) border border-(--app-border) rounded-2xl overflow-hidden transition-all duration-200">
        <Box className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-5">
          <Avatar
            src={image}
            variant="rounded"
            className="rounded-xl shrink-0 w-14 h-14 sm:w-16 lg:w-18 sm:h-16 lg:h-18 border border-(--app-border) bg-(--app-surface-alt)"
          />

          <Box className="flex-1 min-w-0">
            <Typography className="font-bold text-sm sm:text-base text-(--app-text) truncate" title={name}>
              {name}
            </Typography>
            <Box className="flex items-center gap-1.5 mt-1 overflow-hidden">
              <AccessTimeIcon className="text-(--app-muted) text-[13px] shrink-0" />
              <Typography variant="caption" className="text-(--app-muted) text-xs sm:text-[13px] truncate">
                {duration} min
                {gender && (
                  <>
                    <Box component="span" className="mx-1.5 text-(--app-border)">
                      •
                    </Box>
                    <Box component="span" className="capitalize">
                      {gender}
                    </Box>
                  </>
                )}
              </Typography>
            </Box>
            {selectedStaffId && currentStaffInfo && (
              <Box className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-lg bg-(--app-surface-alt) border border-(--app-border) w-fit max-w-full overflow-hidden">
                <Avatar
                  src={currentStaffInfo.photo}
                  className="w-5 h-5 text-[10px] border border-(--app-border) shrink-0"
                >
                  {currentStaffInfo.name?.[0]}
                </Avatar>
                <Typography
                  variant="caption"
                  className="text-(--app-text) text-[11px] font-medium truncate max-w-28 sm:max-w-44 lg:max-w-56"
                >
                  {currentStaffInfo.name}
                </Typography>
                <Box className="w-1.5 h-1.5 rounded-full bg-(--app-primary) shrink-0" />
              </Box>
            )}
          </Box>

          <Box className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Typography className="font-extrabold text-base sm:text-lg text-(--app-text) leading-none">
              ₹{price}
            </Typography>
            <IconButton
              onClick={() => setConfirmOpen(true)}
              className="text-(--app-muted) border border-(--app-border) rounded-xl transition-all duration-150 hover:text-(--app-primary) hover:bg-(--app-primary-soft) hover:border-(--app-primary) w-8 h-8 sm:w-9 sm:h-9"
            >
              <DeleteOutlineIcon className="text-base sm:text-lg" />
            </IconButton>
          </Box>
        </Box>

        <Box className="border-t border-(--app-border) px-4 sm:px-5 py-3">
          <Box className="flex items-center justify-between mb-2">
            <Typography
              variant="caption"
              className="text-(--app-muted) font-semibold tracking-wide uppercase text-[10px]"
            >
              Select Staff
            </Typography>
            {selectedStaffId && (
              <Typography variant="caption" className="text-(--app-primary) font-semibold text-[10px]">
                ✓ Assigned
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
