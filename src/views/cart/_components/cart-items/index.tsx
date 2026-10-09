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
import { useStorefront } from "../../../../providers/storefront-provider";
import EllipsisCell from "@/components/ellipse-cell";

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
      {staffList.map((entry: any, index: number) => {
        const staff = entry.staff;
        const isSelected = selectedStaffId === staff?.uuid;
        const staffName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();
        const photo = staff?.photos?.secure_url ?? staff?.photos?.url;
        const staffPrice = entry.price;
        const staffKey = staff?.uuid || entry.staff_id || staff?.id || entry.uuid || `staff-${index}`;

        const cardClass = isSelected
          ? "bg-(--app-primary)/10 border-(--app-primary)"
          : "bg-(--app-bg) border-(--app-primary)/15 hover:border-(--app-primary)/50";

        const avatarClass = isSelected
          ? "w-11 h-11 transition-all duration-150 border-2 border-(--app-primary) bg-(--app-surface) capitalize"
          : "w-11 h-11 transition-all duration-150 border border-(--app-primary)/20 bg-(--app-surface) capitalize";

        const staffNameClass = isSelected ? "text-(--app-text) font-bold" : "text-(--app-muted)/70 font-medium";
        const staffPriceClass = isSelected ? "text-(--app-primary) font-semibold" : "text-(--app-muted)/50 font-medium";

        return (
          <Box
            key={staffKey}
            onClick={() => onStaffClick(entry)}
            className={`flex flex-col items-center gap-1.5 cursor-pointer group transition-all duration-150 rounded-xl px-3 py-2 min-w-22 border ${cardClass} ${updating ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <Box className="relative">
              <Avatar src={photo} className={avatarClass}>
                {staffName?.[0]}
              </Avatar>

              {isSelected && (
                <Box className="absolute -bottom-1 -right-1 w-5 h-5 bg-(--app-primary) border-2 border-(--app-surface) rounded-full flex items-center justify-center shadow-xs">
                  <CheckIcon className="text-[12px] text-white" />
                </Box>
              )}
            </Box>

            <EllipsisCell value={staffName || "Artisan"} className={`text-[11px] text-center w-full leading-tight truncate ${staffNameClass} capitalize`} maxChars={10} />

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
      <Box className="bg-(--app-surface) border border-(--app-primary)/15 rounded-2xl overflow-hidden transition-all duration-200">
        <Box className="flex items-center gap-4 sm:gap-6 p-5">
          <Avatar
            src={image}
            variant="rounded"
            className="rounded-xl shrink-0 w-16 h-16 sm:w-20 sm:h-20 border border-(--app-primary)/20 bg-(--app-bg)"
          />

          <Box className="flex-1 min-w-0">
            <EllipsisCell value={name} className="font-editorial text-lg sm:text-xl font-bold text-(--app-text) capitalize" maxChars={20} />
            <Box className="flex items-center gap-2 mt-1">
              <AccessTimeIcon className="text-(--app-primary) text-sm shrink-0" />
              <Typography variant="caption" className="text-xs text-(--app-muted)/70 truncate">
                {duration} MIN
                {gender && (
                  <>
                    <Box component="span" className="mx-2 text-(--app-primary)/30">
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
              <Box className="flex items-center gap-2 mt-2 px-2.5 py-1 rounded-lg bg-(--app-bg) border border-(--app-primary)/20 w-fit">
                <Avatar
                  src={currentStaffInfo.photo}
                  className="w-5 h-5 text-[10px] border border-(--app-primary) shrink-0 capitalize"
                >
                  {currentStaffInfo.name?.[0]}
                </Avatar>
                <EllipsisCell value={currentStaffInfo.name} className="text-(--app-text) text-xs font-medium truncate capitalize" maxChars={20} />
                <Box className="w-1.5 h-1.5 rounded-full shrink-0" />
              </Box>
            )}
          </Box>

          <Box className="flex items-center gap-3 shrink-0">
            <Typography className="font-editorial text-xl font-bold text-(--app-primary) leading-none">
              ₹{price}
            </Typography>
            <IconButton
              onClick={() => setConfirmOpen(true)}
              className="/50 border border-(--app-primary)/15 rounded-xl transition-all duration-150 hover: hover:/10 hover:border-(--app-primary) w-9 h-9"
            >
              <DeleteOutlineIcon className="text-lg" />
            </IconButton>
          </Box>
        </Box>

        <Box className="border-t border-(--app-primary)/10 px-5 py-4 bg-(--app-bg)">
          <Box className="flex items-center justify-between mb-3">
            <Typography
              variant="caption"
              className="text-(--app-primary)/70 font-mono font-semibold tracking-widest uppercase text-[10px]"
            >
              Assign Specialist
            </Typography>
            {selectedStaffId && (
              <Typography variant="caption" className="text-(--app-primary) font-semibold text-[10px]">
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
